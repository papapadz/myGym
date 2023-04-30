<template>
  <ion-page>
      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Blank</ion-title>
          </ion-toolbar>
        </ion-header>
        <br><br>
        <ion-grid class="ion-padding">
          <ion-row v-if="!isLoading">
            <ion-col>
              <ion-card>
                <ion-card-content>
                  <ion-badge color="primary">{{ statData.members }}</ion-badge> Members
                </ion-card-content>
              </ion-card>  
            </ion-col>
            <ion-col>
              <ion-card>
                <ion-card-content>
                  <ion-badge color="primary">{{ statData.activeMembership }}</ion-badge> Active Memberships
                </ion-card-content>
              </ion-card>             
            </ion-col>
            <ion-col>
              <ion-card>
                <ion-card-content>
                  <ion-badge color="primary">{{ statData.memberships }}</ion-badge> Membership Packages
                </ion-card-content>
              </ion-card>  
            </ion-col>
            <ion-col>
              <ion-card>
                <ion-card-content>
                  <ion-badge color="primary">{{ statData.workouts }}</ion-badge> Members
                </ion-card-content>
              </ion-card>  
            </ion-col>
          </ion-row>
        </ion-grid>
    </ion-content>
  </ion-page>
</template>
  
  <script>
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  import { defineComponent, onBeforeMount, ref } from 'vue';
  import { adminStore } from '../stores/admin'
  
  export default defineComponent({
    name: 'MenuPage',
    components: {
        IonPage, IonHeader, IonToolbar, IonTitle, IonContent
    },
    setup() {
      const admin = adminStore()
      const isLoading = ref(false)

      onBeforeMount(() => {
        isLoading.value = true
        admin.fetchStatData().then(() => {
          isLoading.value = false
        })
      })

      return {
        isLoading, statData: admin.getStatData
      }
    },
    data() {
      
    },
  });
  </script>