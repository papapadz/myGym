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
      <CardList :dataProp="members.getMembers"/>
    </ion-content>
  </ion-page>
</template>

<script>
import {IonHeader, IonToolbar, IonContent, IonTitle, IonPage} from '@ionic/vue'
import { defineComponent } from 'vue';
import CardList from '../components/CardList.vue';
import { membersStore } from '../stores/members';
import { navigationStore } from '../stores/navigation';

export default defineComponent({
  name: 'MembersPage',
  components: {
    CardList,
    IonHeader,
    IonToolbar,
    IonContent,
    IonTitle,
    IonPage
  },
  setup() {
      const navigation = navigationStore()
      const members = membersStore()
      return {
        navigation,
        members
      }
    },
    beforeMount() {
      this.navigation.$patch({
        page: "members"
      })
    },
    mounted() {
      this.members.getAllMembers();
    }
    
});
</script>