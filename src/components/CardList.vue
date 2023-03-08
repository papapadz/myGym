<template>
    <ion-grid>
      <ion-row>
        <ion-col v-for="card in dataProp" :key="card.id" :size="3">
          <Card :data="card" @click="viewCard(card.id)"/>
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
            <Card :data="cardSelected"/>
          </ion-content>
        </ion-modal>
      </ion-content>
    </ion-grid>
</template>
  
  <script>
  import { IonGrid, IonRow, IonCol, IonContent, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/vue';
  import Card from './Card.vue';
  import { defineComponent } from 'vue';
  import { attendanceStore } from '../stores/attendance';

  export default defineComponent({
    name: 'CardList',
    components: {
      Card, IonGrid, IonRow, IonCol, IonContent, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton 
    },
    setup() {
      const attendance = attendanceStore()
      return {
        attendance
      }
    },
    props: [
      'dataProp'
    ],
    data() {
      return {
        isOpen: false,
        cardSelected: null,
        attendanceSelected: {}
      };
    },
    methods: {
      viewCard(x) {
        //console.log(this.cardList.find(e => e.id == 1))
        //this.cardList.splice(this.cardList.findIndex(e => e.id == x),this.cardList.length)
        this.setOpen(true)
        this.cardSelected = this.dataProp.find(e => e.id == x)
        this.attendanceSelected = this.attendance.getAttendanceWorkOutToday(x)
        console.log(x)
      },
      setOpen(val) {
        this.isOpen = val
      }
    }
  });
  </script>