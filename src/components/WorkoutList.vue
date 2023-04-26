<template>
  <ion-content>
    <ion-label v-if="isLoading">Loading Data Please Wait...</ion-label>
    <ion-card v-else>
      <ion-card-header>
        <ion-card-title>{{ attendanceData.person.lastname }}, {{ attendanceData.person.firstname }}</ion-card-title>
        <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
      </ion-card-header>

      <ion-card-content>
        Here's a small text description for the card content. Nothing more, nothing less.
      </ion-card-content>
    </ion-card>
  </ion-content>
</template>

<script>
import { defineComponent } from 'vue';
import { navigationStore } from '../stores/navigation';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonLabel } from '@ionic/vue';

export default defineComponent({
  name: 'WorkoutList',
  component: {
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonLabel
  },
  setup() {
    const navigation = navigationStore()

    return {
      attendanceData: navigation.getFlipAttendance, isLoading: navigation.getIsLoading
    }
  },
  methods: {
    
  }
})
</script>