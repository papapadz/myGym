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
        <NewMember v-if="navigation.getMemberPageSettings.isNewFormShown"/>
        <div v-else>
          <ion-searchbar @ionChange="searchMember($event)"></ion-searchbar>
          <CardList :dataProp="results"/>
        </div>
        <ion-fab slot="fixed" vertical="bottom" horizontal="end" class="ion-padding">
          <ion-fab-button expand="block" @click="showAddForm" :color="btnColor">
              <ion-icon :icon="btnIcon" />
          </ion-fab-button>
        </ion-fab>
      </ion-content>
  </ion-page>
</template>

<script>
import { IonHeader, IonToolbar, IonContent, IonTitle, IonPage, IonSearchbar, IonFab, IonFabButton, IonIcon  } from '@ionic/vue'
import { defineComponent, ref } from 'vue';
import CardList from '../components/CardList.vue';
import NewMember from '../components/NewMember.vue'
import { membersStore } from '../stores/members';
import { navigationStore } from '../stores/navigation';
import { people as peopleIcon, close as closeIcon, add as plusIcon, checkbox as checkIcon } from 'ionicons/icons';
import axios from 'axios';
//import { OverlayEventDetail } from '@ionic/core/components';

export default defineComponent({
    name: 'MembersPage',
    components: {
      CardList, NewMember, IonHeader, IonToolbar, IonContent, IonTitle, IonPage, IonSearchbar, IonFab, IonFabButton, IonIcon
    },
    setup() {
      const BASE_URL = 'http://localhost/myGymServer/public/api/mobile'
      const navigation = navigationStore()
      const members = membersStore()
      const memberList = members.getMembers
      const results = ref(memberList)
      
      return {
        BASE_URL,
        navigation,
        members,
        memberList,
        results,
        peopleIcon,
        closeIcon,
        plusIcon,
        checkIcon
      }
    },
    data() {
      return {
        btnIcon: this.plusIcon,
        btnColor: 'success'
      }
    },
    beforeMount() {
      this.navigation.$patch({
        page: "members"
      })
      const self = this
        axios.get(this.BASE_URL+'/person/all')
          .then(function(response) {
            self.members.$patch({
              members:  response.data
            })
        })
      this.results = this.members.getMembers
    },
    methods: {
      searchMember(event) {
        const query = event.target.value.toLowerCase();
        this.results = this.memberList.filter(d => d.lastname.toLowerCase().includes(query) || d.firstname.toLowerCase().includes(query));
      },
      cancel() {
        //this.$refs.modal.$el.dismiss(null, 'cancel');
        this.navigation.$patch({
          members: {
            isNewFormShown: false
          }
        })
      },
      confirm() {
        const name = this.$refs.input.$el.value;
        this.$refs.modal.$el.dismiss(name, 'confirm');
      },
      showAddForm() {
        if(this.navigation.getMemberPageSettings.isNewFormShown) {
          this.btnIcon = this.plusIcon
          this.btnColor = 'success'
        }
        else {
          this.btnIcon = this.closeIcon
          this.btnColor = 'danger'
        }
        
        this.navigation.$patch({
          members: {
            isNewFormShown: !this.navigation.getMemberPageSettings.isNewFormShown
          }
        })
      }
    }
});
</script>