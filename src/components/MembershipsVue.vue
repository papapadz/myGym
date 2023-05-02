<template>
  <ion-page>
    <ion-content v-if="isAddShown">
      <ion-item>
          <ion-label>Select Membership</ion-label>
        </ion-item>
      <ion-loading v-if="isSavingMembership" content="Fetching memberships..." />
      <ion-content v-else>
        <ion-item-sliding detail="true" v-for="membershipListItem in useMembershipStore.getmembershipList" :key="membershipListItem.id">
          <ion-item>
            <ion-label>
              <h3>{{ membershipListItem.membership_name }}</h3>
              <p>{{ membershipListItem.remarks }}</p>
              <p>{{ membershipListItem.amount }}</p>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option @click="() => this.enroll(membershipListItem.id)">
              <ion-icon :icon="addCircle"></ion-icon>
              Enroll
            </ion-item-option>
          </ion-item-options>
          </ion-item-sliding>
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
  import { IonPage, IonContent, IonList, IonItemGroup, IonItem, IonIcon, IonFab, IonFabButton, IonLoading, IonItemDivider, IonLabel, IonItemOption, IonItemOptions, IonItemSliding } from '@ionic/vue'
  import { star, add, informationCircle, close, addCircle, removeCircle } from 'ionicons/icons';
  import { defineComponent, ref, onBeforeMount } from 'vue';
  import moment from 'moment'
  import { membershipStore } from '../stores/membeships'
  import { navigationStore } from '../stores/navigation';

  export default defineComponent({
    props: ['membershipData'],
    components: {
      IonPage, IonContent, IonList, IonItemGroup, IonItem, IonIcon, IonFab, IonFabButton, IonLoading, IonItemDivider, IonLabel, IonItemOption, IonItemOptions, IonItemSliding
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

      onBeforeMount(() => {
        isLoading.value = true
        useMembershipStore.fetchMemberships().then(() => {
          isLoading.value = false
        })
      })

      return { navigation, isLoading, useMembershipStore, isFetchingMemberships, isSavingMembership, star, add, informationCircle, close, addCircle, removeCircle };
    },
    computed: {
      getMemberships() {
        return this.memberships
      }
    },
    methods: {
      isActive(expiry_date) {
          
          if(moment().isBefore(moment(expiry_date)))
            return true
          else
            return false
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
            const daysLeft = moment.duration(moment(date).diff()).days()
            return 'Membership expires in '+moment.duration(daysLeft, "days").humanize()
      },
      displayDate(membership) {
        const dateTo = moment(membership.created_at).format('LL')
        const dateFrom = moment(membership.expiry_date).format('LL')
        return dateTo+" to "+dateFrom
      },
      showPaymentDetails(membership) {
        console.log(membership)
      }
    }
  })
</script>

  <style>
  .success {
    background-color: lime;
  }
  </style>
  