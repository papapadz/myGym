<template>
    <ion-content>
        <ion-header :translucent="true">
        <ion-toolbar>
          <ion-title>Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <ProfilePage v-if="flipPage.page==3" />
      <ion-content v-else :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large"></ion-title>
          </ion-toolbar>
        </ion-header>
        
        <ion-content>
          <NewMember v-if="navigation.getMemberPageSettings.isNewFormShown"/>
          <ion-content v-else>
            <ion-searchbar @ionChange="search($event.target.value.toLowerCase())"></ion-searchbar>
            <CardList :dataProp="members.getSearchResult"/>
          </ion-content>
          
          <ion-fab slot="fixed" vertical="bottom" horizontal="end" class="ion-padding">
            <ion-fab-button expand="block" @click="showAddForm" :color="btnColor">
                <ion-icon :icon="btnIcon" />
            </ion-fab-button>
          </ion-fab>
        </ion-content>
      </ion-content>
    </ion-content>
</template>

<script>
import { IonHeader, IonToolbar, IonContent, IonTitle, IonSearchbar, IonFab, IonFabButton, IonIcon  } from '@ionic/vue'
import { defineComponent, ref } from 'vue';
import CardList from '../components/CardList.vue';
import NewMember from '../components/NewMember.vue'
import ProfilePage from './ProfilePage.vue';
import { membersStore } from '../stores/members';
import { navigationStore } from '../stores/navigation';
import { people as peopleIcon, close as closeIcon, add as plusIcon, checkbox as checkIcon } from 'ionicons/icons';
//import { OverlayEventDetail } from '@ionic/core/components';

export default defineComponent({
    name: 'MembersPage',
    components: {
      CardList, NewMember, IonHeader, IonToolbar, IonContent, IonTitle, IonSearchbar, IonFab, IonFabButton, IonIcon, ProfilePage
    },
    setup() {
      const BASE_URL = 'http://localhost/myGymServer/public/api/mobile'
      const navigation = navigationStore()
      const members = membersStore()
      members.getAllMembers()

      const memberList = members.getMembers
      const results = ref(memberList)
      const flipPage = ref(navigation.getFlipPage)
      
      const search = (val) => {
        members.find(val)
      }
      
      return {
        search,
        BASE_URL,
        navigation,
        members,
        memberList,
        results,
        peopleIcon,
        closeIcon,
        plusIcon,
        checkIcon,
        flipPage
      }
    },
    data() {
      return {
        btnIcon: this.plusIcon,
        btnColor: 'success'
      }
    },
    methods: {
      searchMember(event) {
        this.results = this.members.getSearchResult(event.target.value)
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