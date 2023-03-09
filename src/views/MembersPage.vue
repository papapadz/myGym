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
          <ion-title size="large"></ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-searchbar @ionChange="searchMember($event)"></ion-searchbar>
      <CardList :dataProp="results"/>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end" class="ion-padding">
          <ion-fab-button id="open-modal" expand="block">
              <ion-icon :icon="peopleIcon" />
          </ion-fab-button>
      </ion-fab>
      <ion-modal ref="modal" trigger="open-modal" @willDismiss="onWillDismiss">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="cancel()">Cancel</ion-button>
            </ion-buttons>
            <ion-title>Welcome</ion-title>
            <ion-buttons slot="end">
              <ion-button :strong="true" @click="confirm()">Confirm</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="stacked">Enter your Last Name</ion-label>
            <ion-input type="text" placeholder="Last Name"></ion-input>
            <ion-label position="stacked">Enter your First Name</ion-label>
            <ion-input type="text" placeholder="First Name"></ion-input>
            <ion-label position="stacked">Enter your Middlename</ion-label>
            <ion-input type="text" placeholder="Middlename (optional)"></ion-input>
            <ion-label position="stacked">Enter Birthday</ion-label>
            <ion-input type="date" placeholder="Birthday"></ion-input>
            <ion-label position="stacked">Select Gender</ion-label>
            <ion-select interface="popover" placeholder="Select fruit">
              <IonSelectOption value="apples">Apples</IonSelectOption>
              <IonSelectOption value="oranges">Oranges</IonSelectOption>
              <IonSelectOption value="bananas">Bananas</IonSelectOption>
            </ion-select>
          </ion-item>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonHeader, IonToolbar, IonContent, IonTitle, IonPage, IonSearchbar, IonFab, IonFabButton, IonIcon, IonModal, IonButtons, IonButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption  } from '@ionic/vue'
import { defineComponent, ref } from 'vue';
import CardList from '../components/CardList.vue';
import { membersStore } from '../stores/members';
import { navigationStore } from '../stores/navigation';
import { people as peopleIcon, close as closeIcon } from 'ionicons/icons';
//import { OverlayEventDetail } from '@ionic/core/components';

export default defineComponent({
    name: 'MembersPage',
    components: {
      CardList, IonHeader, IonToolbar, IonContent, IonTitle, IonPage, IonSearchbar, IonFab, IonFabButton, IonIcon, IonModal, IonButtons, IonButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption 
    },
    setup() {
      const navigation = navigationStore()
      const members = membersStore()
      const memberList = members.getMembers
      const results = ref(memberList)
      return {
        navigation,
        members,
        memberList,
        results,
        peopleIcon,
        closeIcon
      }
    },
    beforeMount() {
      this.navigation.$patch({
        page: "members"
      })
    },
    mounted() {
      this.members.getAllMembers();
    },
    methods: {
      searchMember(event) {
        const query = event.target.value.toLowerCase();
        this.results = this.memberList.filter(d => d.lastname.toLowerCase().includes(query) || d.firstname.toLowerCase().includes(query));
      },
      cancel() {
        this.$refs.modal.$el.dismiss(null, 'cancel');
      },
      confirm() {
        const name = this.$refs.input.$el.value;
        this.$refs.modal.$el.dismiss(name, 'confirm');
      },
    }
});
</script>