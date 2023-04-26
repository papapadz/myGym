<template>
  <ion-page>
    <ion-grid>
      <ion-row>
        <ion-col size-md="4">
          <ion-card>
            <ion-img src="attendanceData.person.img" />
            <ion-card-header>
              <ion-card-title>{{ renderedData.name }}</ion-card-title>
            </ion-card-header>

            <ion-card-content>
              <p>{{ renderedData.gender }} | {{ renderedData.age }} years old</p>
              <p>Clocked In: {{ renderedData.timein }}</p>
            </ion-card-content>
          </ion-card>
        </ion-col>
        <ion-col size-md="8">
          <ion-row class="ion-justify-content-start">
            <ion-col size="12" size-sm="3" v-for="workoutItem in workOutList" :key="workoutItem.id">            
              <ion-card>
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
        </ion-col>
      </ion-row>
    </ion-grid>
    <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button>
              Add
            </ion-fab-button>
          </ion-fab>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { navigationStore } from '../stores/navigation';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonLabel, IonGrid, IonRow, IonCol, IonFab, IonFabButton } from '@ionic/vue';
import moment from 'moment';

export default defineComponent({
  name: 'WorkoutList',
  props: ['attendanceData'],
  data() {
    return {
      workOutList : this.attendanceData.work_outs,
      renderedData: null
    }
  },
  component: {
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonLabel, IonGrid, IonRow, IonCol, IonFab, IonFabButton
  },
  setup() {
    const navigation = navigationStore()

    return {
      isLoading: navigation.getIsLoading
    }
  },
  methods: {
    
  },
  mounted() {
    console.log(this.attendanceData)
    this.renderedData = {
      name: this.attendanceData.person.lastname+', '+this.attendanceData.person.firstname,
      age: moment().diff(this.attendanceData.person.birthdate,'years'),
      gender: (this.attendanceData.person.gender=='M' ? 'Male' : 'Female'),
      timein: moment(this.attendanceData.created_at).format("LT")
    }
  },
})
</script>