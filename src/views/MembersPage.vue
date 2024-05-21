<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
          <ion-title>Blank</ion-title>
        </ion-toolbar>
    </ion-header>

    <ProfilePage v-if="flipPage.page==3" />  
    <ion-content v-else :fullscreen="true">
      <ion-header collapse="condense"></ion-header>
          <NewMember v-if="navigation.getMemberPageSettings.isNewFormShown"/>
          <ion-content v-else>
            <ion-loading v-if="isLoading"></ion-loading>
            <ion-content v-else>
              <ion-fab vertical="top" horizontal="end">
                <ion-fab-button color="success" @click="showAddForm"><ion-icon :icon="plusIcon"></ion-icon></ion-fab-button>
              </ion-fab>
              <ion-searchbar @ionChange="search($event.target.value.toLowerCase())"></ion-searchbar>
              <ion-grid>
                <ion-row size="auto" class="ion-justify-content-start">
                  <ion-col size-md="6" size-lg="3" size-xs="12" v-for="memberItem in memberResults" :key="memberItem.id">
                    <ion-card :class="checkStatus(memberItem)" @click="openProfile(memberItem)">
                      <img class="card-image" :src="memberItem.img.url!=null ? memberItem.img.url : '#'" alt="Profile Image" />
                      <ion-card-header>
                        <ion-card-subtitle>
                          {{ memberItem.card_number }}
                        </ion-card-subtitle>
                        <ion-card-title>{{ memberItem.lastname }}, {{ memberItem.firstname }}</ion-card-title>
                      </ion-card-header>
                    </ion-card>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-content>
          </ion-content>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonHeader, IonToolbar, IonContent, IonTitle, IonSearchbar, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonPage, IonCardTitle, IonFab, IonFabButton, IonIcon, IonLoading  } from '@ionic/vue'
import { defineComponent, ref, onBeforeMount, computed } from 'vue';
import NewMember from '../components/NewMember.vue'
import ProfilePage from './ProfilePage.vue';
import { membersStore } from '../stores/members';
import { navigationStore } from '../stores/navigation';
import { people as peopleIcon, close as closeIcon, add as plusIcon, checkbox as checkIcon } from 'ionicons/icons';
import { isPast } from 'date-fns'
//import { OverlayEventDetail } from '@ionic/core/components';

export default defineComponent({
    name: 'MembersPage',
    components: {
      NewMember, ProfilePage, 
      IonHeader, IonToolbar, IonContent, IonTitle, IonSearchbar, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonPage, IonCardTitle, IonFab, IonFabButton, IonIcon, IonLoading
    },
    setup() {
      const navigation = navigationStore()
      const members = membersStore()
      const isLoading = ref(true)
      const memberList = computed(() => {
        return members.getMembers
      })
      const results = ref(memberList)
      const flipPage = ref(navigation.getFlipPage)
      const memberResults = computed(() => {
        return members.getSearchResult
      })
      const search = (val) => {
        members.find(val)
      }
      
      onBeforeMount( async () => {
        isLoading.value = true
        await members.getAllMembers().then(() => {
          members.$patch({
            searchResults: members.getMembers
          })
          isLoading.value = false
        })
      })

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
        flipPage,
        memberResults
      }
    },
    data() {
      return {
        btnIcon: this.plusIcon,
        btnColor: 'success'
      }
    },
    methods: {
      checkStatus(item) {
        
        if(item.active_membership) {
          
          if(isPast(new Date(item.active_membership.expiry_date)))
            return 'list-card near-expiry'

          return 'list-card active'
        }
          
        return 'list-card'
      },
      searchMember(event) {
        this.results = this.members.getSearchResult(event.target.value)
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
        console.log(this.$router)
        //this.navigation.setAttendance(memberData.id)
        //this.navigation.setMembership(memberData.id)
        this.navigation.setFlippedProfile(memberData.id)
        this.navigation.$patch({
          flip: {
            data: memberData,
            page: 3
          }
        })
        this.$router.push({path: 'member/', replace: true})
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

.list-card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transform: scale(1.05);
  transition: all 0.3s ease-in-out;
}

.active {
    border: solid;
    border-color: lime;
}

.near-expiry {
    border: solid;
    border-color: orange;
}
</style>