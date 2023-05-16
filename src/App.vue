<template>
<ion-page>
<ion-menu-toggle v-if="isLoggedIn">
  <ion-menu side="start" content-id="main-content">
    <ion-header>
      <ion-toolbar color="warning">
        <ion-title>DMAX Gym</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item-group>
          <ion-item-divider>
            <ion-label>MENU</ion-label>
          </ion-item-divider>
        </ion-item-group>
        <ion-item button :router-link="{ path: '/home' }" routerDirection="root" ion-menu-toggle @click="navigate('home')">
          <ion-icon slot="start" :icon="menuIcon" />
          Dashboard
        </ion-item>
        <ion-item button :router-link="{ path: '/members' }" routerDirection="root" ion-menu-toggle @click="navigate('members')">
          <ion-icon slot="start" :icon="peopleIcon" />
          Members
        </ion-item>
        <ion-item button :router-link="{ path: '/attendance' }" routerDirection="root" ion-menu-toggle @click="navigate('attendance')">
          <ion-icon slot="start" :icon="calendar" />
          Attendance
        </ion-item>
        <ion-item-group>
          <ion-item-divider>
            <ion-label>USER</ion-label>
          </ion-item-divider>
        </ion-item-group>
        <ion-item button :router-link="{ path: '/user' }" routerDirection="root" ion-menu-toggle @click="navigate('user')">
          <ion-icon slot="start" :icon="personCircle" />
          {{ loggedInUser.person.firstname }}
          <ion-button slot="end" color="danger" @click="logout">
            <ion-icon :icon="logOutOutline"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>

</ion-menu-toggle>
<ion-header v-if="isLoggedIn">
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
import { IonPage, IonMenu, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonMenuButton, IonRouterOutlet, IonMenuToggle, IonItemGroup, IonItemDivider, IonLabel, IonButton } from '@ionic/vue';
import { menu as menuIcon, people as peopleIcon, calendar, personCircle, logOutOutline } from 'ionicons/icons';
import { defineComponent, onMounted, ref, computed } from 'vue';
import { navigationStore } from './stores/navigation';
import { adminStore } from './stores/admin'
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
    IonPage,
    IonItemGroup, IonItemDivider, IonLabel, IonButton
  },
  setup() {
      const navigation = navigationStore()
      const admin = adminStore()
      const timestamp = ref(format(new Date(),'EEE, LLL d, yyy h:mm:ss a'))

      const isLoggedIn = computed(() => {
        if(admin.getSession.status==1)
          return true
        else return false
      })

      const loggedInUser = computed(() => {
        return admin.getSession.data
      })

      onMounted(() => {
        setInterval(() => {
          timestamp.value = format(new Date(),'EEE, LLL d, yyy h:mm:ss a');
        }, 1000);  
      })
      return {
        navigation, timestamp, isLoggedIn, personCircle, loggedInUser, logOutOutline, admin
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
    },
    logout() {
      const x = confirm('Are you sure you want to log out?')
      if(x) {
        
        this.admin.$patch({
          session: {
            status: 0,
            data: {}
          }
        })
        
        window.location.replace('/')
      }
    }
  }
});
</script>