<template>
    <ion-grid>
      <ion-row>
        <ion-col v-for="card in dataProp" :key="card.id">
          
          <CardProfile :data="card" />
          <Card :data="card" @click="viewCard(card.id)" v-if="false"/>
        </ion-col>
      </ion-row>
      <ion-content>
        <ion-modal :is-open="isOpen">
          <ion-header>
            <ion-toolbar>
              <ion-title>Modal</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="setOpen(false)">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <div class="container">
              <CardProfile />
              <Card :data="cardSelected" v-if="false"/>
                <WorkoutList />
            </div>
          </ion-content>
        </ion-modal>
      </ion-content>
    </ion-grid>
</template>
  
  <script>
  import { IonGrid, IonRow, IonCol, IonContent, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/vue';
  import Card from './Card.vue';
  import CardProfile from '@/components/CardProfile'
  import { defineComponent } from 'vue';  
  import WorkoutList from './WorkoutList.vue';
  import { navigationStore } from '../stores/navigation';
  import { workoutStore } from '../stores/workout';


  export default defineComponent({
    name: 'CardList',
    components: {
      CardProfile, Card, IonGrid, IonRow, IonCol, IonContent, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, WorkoutList
    },
    // setup() {
    //   const attendance = attendanceStore()
    //   return {
    //     attendance
    //   }
    // },
    props: [
      'dataProp'
    ],
    setup() {
      const navigation = navigationStore()
      const workout = workoutStore()
      return {
        navigation,
        workout
      }
    },
    data() {
      return {
        dataList: [],
        isOpen: false,
        cardSelected: null
      };
    },
    methods: {
      viewCard(x) {
        console.log(x)
        this.cardSelected = this.dataProp.find(e => e.id == x)
        
        switch(this.navigation.getPage) {
          case 'members': 
          break
          case 'attendance':
            this.workout.getAttendanceWorkOutToday(x)
            this.dataList = this.workout.getAttendanceWorkOuts
          break
        }
        this.setOpen(true)
      },
      setOpen(val) {
        this.isOpen = val
      }
    }
  });
  </script>

<style>
.card-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
</style>