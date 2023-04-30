<template>
  <ion-page>
    <ion-content>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title style="text-align: right;">{{ timestamp }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-header :translucent="true">
                <ion-toolbar>
                <ion-title></ion-title>
                </ion-toolbar>
            </ion-header>
    <ion-grid :fixed="true">
      <ion-row>
        <ion-col size="12" size-md="4">
          <ion-card>
            <img class="card-image" :src="attendanceData.person.img.url" />
            <ion-card-header>
              <ion-card-title>{{ renderedData.name }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p>{{ renderedData.gender }} | {{ renderedData.age }} years old</p>
              <p>Clocked In: {{ renderedData.timein }}</p>
            </ion-card-content>
            <ion-button class="ion-text-end" color="warning" @click="back">
              <ion-icon :icon="arrowBack"></ion-icon> Go Back
            </ion-button>
            <ion-button v-if="!attendanceData.timeout" class="ion-text-start" color="danger" @click="out">
              <ion-icon :icon="exit"></ion-icon> Clock Out
            </ion-button>
          </ion-card>
        </ion-col>
        <ion-col size="12" size-md="8">
          <ion-grid :fixed="true">
            <ion-row v-if="page==1" class="ion-justify-content-start">
              <ion-col v-for="workoutItem in workOutList" :key="workoutItem.id">            
                <ion-card :color="getIntensity(workoutItem.work_out_item)">
                  <ion-card-header>
                    <ion-card-title>{{ workoutItem.work_out_item.workout_name }}</ion-card-title>
                    <ion-card-subtitle>{{ workoutItem.created_at }}</ion-card-subtitle>
                  </ion-card-header>
                  <ion-card-content>
                    {{ workoutItem.notes }}
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>
            <ion-row v-else>
              <ion-col size="12">
                <ion-card v-if="!isLoading">
                  <ion-card-content>
                    <ion-fab slot="fixed" vertical="top" horizontal="end">
                      <ion-fab-button @click="page=1" color="danger">
                        <ion-icon :icon="close"></ion-icon>
                      </ion-fab-button>
                    </ion-fab>
                    <ion-list>
                      <ion-item lines="none">
                        <ion-label>Select Workout:</ion-label>
                      </ion-item>
                      <ion-item lines="none">
                        <ion-select v-model="selectedItemID" placeholder="Select Workout">
                          <ion-select-option :value="witem.id" v-for="witem in workout.getWorkoutItems" :key="witem.id">{{ witem.workout_name }}</ion-select-option>
                        </ion-select>
                      </ion-item>
                      <ion-item lines="none">
                        <ion-label>Trainer's Notes/Instructions:</ion-label>
                      </ion-item>
                      <ion-item lines="none">
                        <ion-textarea v-model="selectedItemNote" placeholder="Type something here" :auto-grow="true">
                        </ion-textarea>
                      </ion-item>
                      <ion-button class="ion-padding" expand="full" shape="round" @click="saveWorkout">Add</ion-button>
                    </ion-list>
                  </ion-card-content>
                </ion-card>
                <p v-else>Loading...</p>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-col>
      </ion-row>
    </ion-grid>
    <ion-fab v-if="page==1" slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button @click="page=2">
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-content>
  </ion-page>
</template>


<script>
import { defineComponent, onBeforeMount, ref } from 'vue';
import { add, close, arrowBack, exit } from 'ionicons/icons'
import { workoutStore } from '../stores/workout';
import { navigationStore } from '../stores/navigation';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonGrid, IonRow, IonCol, IonFab, IonFabButton, IonIcon, IonPage, IonContent, IonButton, IonCardContent, IonList, IonItem, IonSelect, IonTextarea, IonHeader, IonToolbar, IonTitle, IonSelectOption, IonLabel } from '@ionic/vue';
import moment from 'moment';

export default defineComponent({
  props: ['attendanceData'],
  data() {
    return {
      selectedItemID: null,
      selectedItemNote: null,
      page: 1,
      workOutList : this.attendanceData.work_outs
    }
  },
  components: {
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonGrid, IonRow, IonCol, IonFab, IonFabButton, IonIcon, IonPage, IonContent, IonButton, IonCardContent, IonList, IonItem, IonSelect, IonTextarea, IonTitle, IonHeader, IonToolbar, IonSelectOption, IonLabel
  },
  setup() {
    const workout = workoutStore()
    const navigation = navigationStore()
    const isLoading = ref(false)
    onBeforeMount(() => {
      isLoading.value = true
      workout.getWorkoutItemsList().then(() => {
        isLoading.value = false
      })
    })

    return {
      isLoading, workout, add, close, arrowBack, navigation, exit
    }
  },
  methods: {
    addItem() {
      this.page = 2
    },
    back() {
      this.$router.go(0);
    },
    saveWorkout() {
      const rdata = {
        attendanceID:this.attendanceData.id,
        workoutID:this.selectedItemID,
        note:this.selectedItemNote
      }
      this.isLoading = true
      this.workout.setNewAttendanceWorkout(rdata).then(()=> {
        this.workOutList.push(this.workout.getNewAttendanceWorkout)
        this.isLoading = false
        this.page=1
      })
    },
    getIntensity(workout) {
      console.log(workout)
      switch(workout.intensity) {
        case 1: return 'success'
        case 2: return 'warning'
        case 3: return 'danger'
      }
    },
    out() {
      this.navigation.timeOut(this.attendanceData.id).then(() => {
        this.$router.go(0);
      })
    }
  },
  mounted() {
    console.log(this.attendanceData)
  },
  computed: {
    renderedData() {
      return {
        name: this.attendanceData.person.lastname+', '+this.attendanceData.person.firstname,
        age: moment().diff(this.attendanceData.person.birthdate,'years'),
        gender: (this.attendanceData.person.gender=='M' ? 'Male' : 'Female'),
        timein: moment(this.attendanceData.created_at).format("LT")
      }
    } 
  }
})
</script>

<style>
.card-image {
  float: center;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
  width: 150px;
  height: 150px;
  object-fit: cover;
  padding: 10px;
}
</style>