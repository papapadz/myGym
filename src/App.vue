<template>
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
          <ion-icon slot="start" :icon="peopleIcon" />
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
      <ion-title>Admin</ion-title>
    </ion-toolbar>
  </ion-header>

    <ion-router-outlet id="main-content"></ion-router-outlet>

</template>

<script>
import { IonMenu, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonMenuButton, IonRouterOutlet, IonMenuToggle } from '@ionic/vue';
import { menu as menuIcon, people as peopleIcon, cart as cartIcon } from 'ionicons/icons';
import { defineComponent } from 'vue';
import { navigationStore } from './stores/navigation';

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
    IonMenuToggle
  },
  setup() {
      const navigation = navigationStore()
      return {
        navigation
      }
  },
  data() {
    return {
      menuIcon,
      peopleIcon,
      cartIcon,
    };
  },
  methods: {
    navigate(page) {
      this.navigation.$patch({
        page: page
      })
    }
  }
});
</script>