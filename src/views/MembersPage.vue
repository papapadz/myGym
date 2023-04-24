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
            <ion-button @click="showAddForm"></ion-button>
          </ion-header>
          <NewMember v-if="navigation.getMemberPageSettings.isNewFormShown"/>
          <ion-content v-else>
            <ion-searchbar @ionChange="search($event.target.value.toLowerCase())"></ion-searchbar>
            <!-- <CardList :dataProp="members.getSearchResult"/> -->
            <ion-grid>
              <ion-row class="ion-justify-content-start">
                <ion-col size="12" size-sm="3" v-for="memberItem in members.getSearchResult" :key="memberItem.id">
                  <ion-card>
                <img class="card-image" :src="memberItem.img.url" alt="Profile Image" />
                <ion-card-header>
                  <ion-card-subtitle>
                    {{ memberItem.card_number }}
                  </ion-card-subtitle>
                  <ion-card-title>{{ memberItem.lastname }}, {{ memberItem.firstname }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <ion-item><button @click="openProfile(memberItem)">View Profile</button></ion-item>
                </ion-card-content>
              </ion-card>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-content>
        </ion-content>
      </ion-content>
</template>

<script>
import { IonHeader, IonToolbar, IonContent, IonTitle, IonSearchbar  } from '@ionic/vue'
import { defineComponent, ref } from 'vue';
//import CardList from '../components/CardList.vue';
import NewMember from '../components/NewMember.vue'
import ProfilePage from './ProfilePage.vue';
import { membersStore } from '../stores/members';
import { navigationStore } from '../stores/navigation';
import { people as peopleIcon, close as closeIcon, add as plusIcon, checkbox as checkIcon } from 'ionicons/icons';
//import { OverlayEventDetail } from '@ionic/core/components';

export default defineComponent({
    name: 'MembersPage',
    components: {
      NewMember, IonHeader, IonToolbar, IonContent, IonTitle, IonSearchbar, ProfilePage
    },
    setup() {
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
      },
      openProfile(memberData) {
        this.navigation.setAttendance(memberData.id)
        this.navigation.setMembership(memberData.id)
        this.navigation.$patch({
          flip: {
            data: memberData,
            page: 3
          }
        })
        
      }
    }
});
</script>

<style>
.card-image {
  float: center;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
  width: 150px;
  height: 150px;
  object-fit: cover;
  padding: 10px;
}
</style>