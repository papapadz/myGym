<template>
  <ion-page>
<ion-menu-toggle>
  <ion-menu side="start" content-id="main-content">
    
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item :router-link="{ path: '/home' }" routerDirection="root" ion-menu-toggle @click="navigate('home')">
          <ion-icon slot="start" :icon="menuIcon" />
          Dashboard
        </ion-item>
        <ion-item :router-link="{ path: '/members' }" routerDirection="root" ion-menu-toggle @click="navigate('members')">
          <ion-icon slot="start" :icon="peopleIcon" />
          Members
        </ion-item>
        <ion-item :router-link="{ path: '/attendance' }" routerDirection="root" ion-menu-toggle @click="navigate('attendance')">
          <ion-icon slot="start" :icon="calendar" />
          Attendance
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>

</ion-menu-toggle>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button />
      </ion-buttons>
      <ion-title><center>{{ timestamp }}</center></ion-title>
    </ion-toolbar>
  </ion-header>
    <ion-router-outlet id="main-content"></ion-router-outlet>
  </ion-page>
</template>

<script>
import { IonPage, IonMenu, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonMenuButton, IonRouterOutlet, IonMenuToggle } from '@ionic/vue';
import { menu as menuIcon, people as peopleIcon, calendar } from 'ionicons/icons';
import { defineComponent, onMounted, ref } from 'vue';
import { navigationStore } from './stores/navigation';
import { format } from 'date-fns'

export default defineComponent({
  name: 'App',
  components: {
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonMenuButton,
    IonRouterOutlet,
    IonButtons,
    IonMenuToggle,
    IonPage
  },
  setup() {
      const navigation = navigationStore()
      const timestamp = ref(format(new Date(),'EEE, LLL d, yyy h:mm:ss a'))

      onMounted(() => {
        setInterval(() => {
          timestamp.value = format(new Date(),'EEE, LLL d, yyy h:mm:ss a');
        }, 1000);  
      })
      return {
        navigation, timestamp
      }
  },
  data() {
    return {
      menuIcon,
      peopleIcon,
      calendar,
    };
  },
  methods: {
    navigate(page) {
      this.navigation.$patch({
        page: page,
        flip: {
          data: null,
          page:1
        }
      })
    }
  }
});
</script>