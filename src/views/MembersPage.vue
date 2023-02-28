<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>
      <CardList/>
    </ion-content>
  </ion-page>
</template>

<script>
import {IonHeader, IonToolbar, IonContent, IonTitle, IonPage} from '@ionic/vue'
import { defineComponent } from 'vue';
import CardList from '../components/CardList.vue';

export default defineComponent({
  name: 'MenuPage',
  components: {
    CardList,
    IonHeader,
    IonToolbar,
    IonContent,
    IonTitle,
    IonPage
  }
});
</script>