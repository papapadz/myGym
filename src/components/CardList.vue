<template>
    <ion-grid :fixed="true" >
      <ion-loading v-if="isLoading"></ion-loading>
      <ion-row v-else>
        <ion-col v-for="cardData in members" :key="cardData.id" size="12" size-md="6" size-lg="3">
          <ion-card v-if="cardData && cardData.person" outline="success" class="list-card" button @click="openProfile(cardData.person)">
            <ion-card-header>
              <ion-card-subtitle>{{ cardData.person.card_number }}</ion-card-subtitle>
              <ion-card-title>{{ cardData.person.lastname }}, {{ cardData.person.firstname }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-chip color="primary">{{ getDaysLeft(cardData.person.active_membership.expiry_date) }}</ion-chip>
              <ion-chip color="warning">Balance: {{ balance(cardData) }}</ion-chip>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-grid>
</template>
  
  <script>
  import { IonGrid, IonRow, IonCol, IonLoading } from '@ionic/vue';
  import { defineComponent, ref, onBeforeMount, computed } from 'vue';  
  import { formatDistanceToNow } from 'date-fns'
import { adminStore } from '../stores/admin';
import { navigationStore } from '../stores/navigation';

  export default defineComponent({
    name: 'CardList',
    components: {
      IonGrid, IonRow, IonCol, IonLoading
    },
    setup() {
      const navigation = navigationStore()
      const admin = adminStore()
      const isLoading = ref(true)

      onBeforeMount(() => {
        isLoading.value = true
        admin.getActiveMembers().then(() => {
          isLoading.value = false
        })
      })

      const members = computed(() => { return admin.getActiveMembersList })

      return {
        members, isLoading, navigation
      }
    },
    methods: {
      getDaysLeft(date) {
            const thisDate = new Date(date)
            const daysLeft = formatDistanceToNow(thisDate)
            console.log('asdasd')
            return 'Membership expires in ' + daysLeft
        },
        balance(item) {
            let total = parseFloat(item.person.active_membership.membership_category.amount)
            for(const k in item.payments) {
              total -= parseFloat(item.payments[k].payment)
            }
            return 'Php ' + total.toLocaleString('en-PH')
        },
        openProfile(memberData) {
          this.navigation.setFlippedProfile(memberData.id)
          this.navigation.$patch({
            flip: {
              data: memberData,
              page: 3
            }
          })
      }
    }
  })
  </script>

<style scoped>
.card-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
  
.list-card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transform: scale(1.05);
  transition: all 0.3s ease-in-out;
}
    
</style>