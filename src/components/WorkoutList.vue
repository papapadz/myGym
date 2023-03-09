<template>
<ion-item-group>
  <ion-item-divider>
    <ion-label>A</ion-label>
  </ion-item-divider>
    <ion-item v-for="item in workout.getAttendanceWorkOuts" :key="item.id">
        <ion-label>Angola</ion-label>
    </ion-item>
</ion-item-group>
</template>

<script>
import { defineComponent } from 'vue';
import { workoutStore } from '../stores/workout';
import { IonItemGroup, IonItemDivider, IonLabel, IonItem } from '@ionic/vue';

export default defineComponent({
  name: 'WorkoutList',
  component: {
    IonItemGroup, IonItemDivider, IonLabel, IonItem
  },
  props: ['propList'],
  setup() {
    const workout = workoutStore()
    return {
        workout
    }
  },
  mounted() {
    console.log(this.propList)
  },
  data() {
    return {

    }
  }
})
</script>