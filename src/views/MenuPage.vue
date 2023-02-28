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
    <CardList :items=items />
    </ion-content>
    </ion-page>
</template>
  
  <script>
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  import { defineComponent } from 'vue';
  import CardList from '../components/CardList.vue';
  export default defineComponent({
    name: 'MenuPage',
    components: {
        IonPage,CardList, IonHeader, IonToolbar, IonTitle, IonContent
    },
    data() {
      return {
        items: [
          {
            id: 1,
            name: 'OK',
            image: 'https://picsum.photos/200/300',
            title: 'Item 1',
            subtitle: 'Subtitle 1',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          },
          {
            id: 2,
            name: 'OKAA',
            image: 'https://picsum.photos/200/300',
            title: 'Item 2',
            subtitle: 'Subtitle 2',
            content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          },
          {
            id: 3,
            name: 'OKAYYY',
            image: 'https://picsum.photos/200/300',
            title: 'Item 3',
            subtitle: 'Subtitle 3',
            content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          },
        ],
      };
    },
  });
  </script>