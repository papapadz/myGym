<template>
  <ion-page>
    <ion-content v-if="isAddShown">
      <MembershipItemVue v-if="navPage==2" :membershipItem="selectedMembership"/>
      <ion-item>
          <ion-label>Select Membership</ion-label>
        </ion-item>
      <ion-loading v-if="isSavingMembership" content="Fetching memberships..." />
      <ion-content v-else>
        <ion-item button detail="true" v-for="membershipListItem in useMembershipStore.getmembershipList" :key="membershipListItem.id" @click="viewMore(membershipListItem)">
            <ion-label>
              <h3>{{ membershipListItem.membership_name }}</h3>
              <p>{{ membershipListItem.remarks }}</p>
              <p>{{ membershipListItem.amount }}</p>
            </ion-label>
          </ion-item>
      </ion-content>
    </ion-content>
    <ion-content v-else>
      <ion-list>
        <ion-item-group>
          <ion-item-divider>Memberships</ion-item-divider>
          <ion-item lines="none" v-for="membershipItem in getMemberships" :key="membershipItem.id" detail="true" button="true" @click="showPaymentDetails(membershipItem)">
            <ion-icon v-if="this.isActive(membershipItem.expiry_date)" color="primary" :icon="star" slot="start"></ion-icon>
            <ion-icon v-else color="disabled" :icon="star" slot="start"></ion-icon>
            <ion-label>
              <h3>{{ membershipItem.membership_category.membership_name }}</h3>
              <p>{{ displayDate(membershipItem) }}</p>
              <hr>
              <ion-badge v-if="this.isActive(membershipItem.expiry_date)" color="success">{{ getDaysLeft(membershipItem.expiry_date) }}</ion-badge>
            </ion-label>
          </ion-item>
        </ion-item-group>
    </ion-list>
    </ion-content>
    <ion-fab slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button v-if="!isAddShown" color="success" id="open-modal" expand="block" @click="openAddMembership">
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
      <ion-fab-button v-else color="danger" id="open-modal" expand="block" @click="reset">
        <ion-icon :icon="close"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-page>
</template>
  
<script>
  import { IonPage, IonContent, IonList, IonItemGroup, IonItem, IonIcon, IonFab, IonFabButton, IonLoading, IonItemDivider, IonLabel } from '@ionic/vue'
  import { star, add, informationCircle, close, addCircle, removeCircle } from 'ionicons/icons';
  import { defineComponent, ref, onBeforeMount } from 'vue';
  import { membershipStore } from '../stores/membeships'
  import { navigationStore } from '../stores/navigation';
  import { format, formatDistanceToNow, isPast } from 'date-fns'
  import MembershipItemVue from './MembershipItem.vue';

  export default defineComponent({
    props: ['membershipData'],
    components: {
      IonPage, IonContent, IonList, IonItemGroup, IonItem, IonIcon, IonFab, IonFabButton, IonLoading, IonItemDivider, IonLabel, MembershipItemVue
    },
    data() {
      return {
        memberships: this.membershipData,
        isAddShown: false,
        selectedMembership: null,
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      }
    },
    setup() {
      const useMembershipStore = membershipStore()
      const navigation = navigationStore()
      const isFetchingMemberships = useMembershipStore.getIsSavingMembership
      const isSavingMembership = useMembershipStore.getIsSavingMembership
      const isLoading = ref(false)

      const navPage = ref(navigation.getMembershipsNavigation.page)

      onBeforeMount(() => {
        isLoading.value = true
        useMembershipStore.fetchMemberships().then(() => {
          isLoading.value = false
        })
      })

      return { navigation, isLoading, useMembershipStore, isFetchingMemberships, isSavingMembership, star, add, informationCircle, close, addCircle, removeCircle, navPage };
    },
    computed: {
      getMemberships() {
        return this.memberships
      }
    },
    methods: {
      isActive(expiry_date) {
          const thisDate = new Date(expiry_date)
          if(isPast(thisDate))
            return false
          return true 
      },
      openAddMembership() {
        this.isAddShown = true
      },
      async enroll(id) {
        this.useMembershipStore.enroll({
          personID: this.navigation.getFlipPage.data.id,
          itemID: id
        }).then(() => {
          this.memberships.push(this.useMembershipStore.newItem)
          this.isAddShown=false
        })
      },
      reset() {
        this.isAddShown=false
      },
      getDaysLeft(date) {
          const thisDate = new Date(date)
            const daysLeft = formatDistanceToNow(thisDate)
            console.log('asdasd')
            return 'Membership expires in ' + daysLeft
      },
      displayDate(membership) {
        const dateTo = format(new Date(membership.created_at), 'LLL d, yyyy')
        const dateFrom = format(new Date(membership.expiry_date), 'LLL d, yyyy')
        return dateTo+" to "+dateFrom
      },
      showPaymentDetails(membership) {
        console.log(membership)
      },
      viewMore(membership) {
        this.selectedMembership = membership
        this.navigation.$patch({
          getMembershipsNavigation: {
            page: 2
          }
        })
        alert('asdsa')
      }
    }
  })
</script>

  <style>
  .success {
    background-color: lime;
  }
  </style>
  