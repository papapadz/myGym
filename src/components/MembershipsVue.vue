<template>
  <ion-page>
    <ion-loading v-if="navigation.isLoading"></ion-loading>
    <ion-content>
      <ion-content v-if="navPage.isAddShown">
        <ion-item>
            <ion-label>Select Membership</ion-label>
          </ion-item>
        <ion-content>
            <ion-content v-if="navPage.page==2">
              <MembershipItemVue :membershipItem="selectedMembership"/>
            </ion-content>
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
      </ion-content>
      <ion-content v-else-if="navPage.isPaymentFormShown">
        <ion-card v-if="!navigation.isLoading">
          <ion-card-content>
            <h2><ion-button @click="toggle" slot="end" size="small" :color="isPayment ? 'success' : 'danger'"> {{ isPaymentLabel }}</ion-button>
            </h2>
            <hr/>
            <h2><ion-icon :color="isPayment ? 'success' : 'danger'" :icon="isPayment ? add : remove"></ion-icon> Amount</h2>
            <ion-input type="decimal" class="large" placeholder="Enter Amount" v-model="amount"></ion-input>
            <h2>Remarks/Particulars</h2>
            <ion-input class="large" placeholder="Enter note/remarks" v-model="remarks"></ion-input>
            <ion-button color="success" @click="save">Save</ion-button>
          </ion-card-content>
        </ion-card>
      </ion-content>
      <ion-content v-else>
        <ion-list v-if="!navPage.isPaymentHistoryShown">
          <ion-item-group>
            <ion-item-divider>Memberships</ion-item-divider>
            <ion-item lines="none" v-for="membershipItem in getMemberships" :key="membershipItem.id" detail="true" button="true" @click="showPaymentDetails(membershipItem)">
              <ion-icon v-if="this.isActive(membershipItem.expiry_date)" color="primary" :icon="star" slot="start"></ion-icon>
              <ion-icon v-else color="disabled" :icon="star" slot="start"></ion-icon>
              <ion-label>
                <h3>{{ membershipItem.membership_category.membership_name }}</h3>
                <p>{{ displayDate(membershipItem) }}</p>
                <hr>
                <ion-chip v-if="this.isActive(membershipItem.expiry_date)" color="success">{{ getDaysLeft(membershipItem.expiry_date) }}</ion-chip>
              </ion-label>
            </ion-item>
          </ion-item-group>
      </ion-list>
      <MembershipDetailsVue v-else :membershipObject="selectedMembership" />
      </ion-content>
      <ion-fab slot="fixed" vertical="top" horizontal="end">
        <ion-fab-button v-if="!navPage.isClicked" color="success" id="open-modal" expand="block" @click="open">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
        <ion-fab-button v-else color="danger" id="open-modal" expand="block" @click="reset">
          <ion-icon :icon="close"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>
  
<script>
  import { IonPage, IonContent, IonList, IonItemGroup, IonItem, IonIcon, IonFab, IonFabButton, IonLoading, IonItemDivider, IonLabel, IonInput } from '@ionic/vue'
  import { star, add, informationCircle, close, addCircle, removeCircle, remove } from 'ionicons/icons';
  import { defineComponent, ref, onBeforeMount, computed } from 'vue';
  import { membershipStore } from '../stores/membeships'
  import { navigationStore } from '../stores/navigation';
  import { format, formatDistanceToNow, isPast } from 'date-fns'
  import MembershipItemVue from './MembershipItem.vue';
  import MembershipDetailsVue from './MembershipDetails.vue';

  export default defineComponent({
    props: ['membershipData'],
    components: {
      IonPage, IonContent, IonList, IonItemGroup, IonItem, IonIcon, IonFab, IonFabButton, IonLoading, IonItemDivider, IonLabel, MembershipItemVue, MembershipDetailsVue, IonInput
    },
    data() {
      return {
        //memberships: this.navigation.getFlipMemberships,
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        amount: null,
        remarks: ''
      }
    },
    setup() {
      
      const useMembershipStore = membershipStore()
      const navigation = navigationStore()
      const isFetchingMemberships = useMembershipStore.getIsSavingMembership
      const isSavingMembership = useMembershipStore.getIsSavingMembership
      const isPayment = ref(true)
      const isPaymentLabel = ref('Receive Payment')
      const navPage = computed(() => {
        return navigation.getMembershipsNavigation
      })
      const selectedMembership = computed(() => {
        return useMembershipStore.getSelectedMembership
      })

      onBeforeMount(() => {
        navigation.setLoading(true)
        useMembershipStore.fetchMemberships().then(() => {
          navigation.setLoading(false)
        })
      })
      const getMemberships = computed(() => {
        return navigation.getFlipMemberships
      })

      return { 
        navigation, 
        useMembershipStore, 
        isFetchingMemberships, 
        isSavingMembership, 
        star, 
        add, 
        informationCircle, 
        close, 
        addCircle, 
        removeCircle, 
        remove,
        navPage,
        isPayment,
        isPaymentLabel, getMemberships, selectedMembership
      };
    },
    methods: {
      isActive(expiry_date) {
          const thisDate = new Date(expiry_date)
          if(isPast(thisDate))
            return false
          return true 
      },
      open() {
        if(this.navPage.isPaymentHistoryShown) {
          this.isPayment = true
          this.isPaymentLabel = 'Receive Payment'
          this.navigation.$patch({
            membershipsNavigation: {
              isPaymentFormShown: true,
              isClicked: true
            }
          })
        } else {
            if(this.navigation.getFlipPage.data.active_membership!=null) {
              if(isPast(new Date(this.navigation.getFlipPage.data.active_membership.expiry_date)))
                  this.navigation.$patch({
                    membershipsNavigation: {
                      isAddShown: true,
                      isClicked: true
                    }
                  })
                else
                  alert('You still have an existing membership')
            } else
                this.navigation.$patch({
                  membershipsNavigation: {
                    isAddShown: true,
                    isClicked: true
                  }
                })
        }
      },
      async enroll(id) {
        this.useMembershipStore.enroll({
          personID: this.navigation.getFlipPage.data.id,
          itemID: id
        }).then(() => {
          this.memberships.push(this.useMembershipStore.newItem)
          this.navigation.$patch({
            membershipsNavigation: {
              isAddShown: false,
              isClicked: false
            }
          })
        })
      },
      reset() {
        if(this.navPage.isPaymentHistoryShown)
          this.navigation.$patch({
              membershipsNavigation: {
                  page:1,
                  isPaymentFormShown: false,
                  isClicked: false,
                  isExtendFormShown: false
              }
          })
        else
          this.navigation.$patch({
              membershipsNavigation: {
                  page:1,
                  isAddShown: false,
                  isClicked: false,
              }
          })
      },
      getDaysLeft(date) {
          const thisDate = new Date(date)
            const daysLeft = formatDistanceToNow(thisDate)
            console.log('asdasd')
            return 'Membership expires in ' + daysLeft
      },
      displayDate(membership) {
        const dateTo = format(new Date(membership.start_date), 'LLL d, yyyy')
        const dateFrom = format(new Date(membership.expiry_date), 'LLL d, yyyy')
        return dateTo+" to "+dateFrom
      },
      showPaymentDetails(membership) {
        this.useMembershipStore.$patch({
          selectedMembership: membership
        })
        this.navigation.$patch({
          membershipsNavigation: {
            isPaymentHistoryShown: true
          }
        })
      },
      viewMore(membership) {
        this.useMembershipStore.$patch({
          selectedMembership: membership
        })
        this.navigation.$patch({
          membershipsNavigation: {
            page: 2
          }
        })
      },
      save() {
        if(this.amount>0) {
          const x = confirm('Are you sure you want to save this?')
          if(x) {
            this.useMembershipStore.pay({
              membershipID: this.selectedMembership.id,
              amount: this.amount,
              remarks: this.remarks,
              isPayment: this.isPayment
            }).then(() => {
              this.amount = 0
              this.remarks = ''
              this.isPayment = true
              this.navigation.$patch({
                membershipsNavigation: {
                  isPaymentFormShown: false,
                  isClicked: false
                }
              })
            })
          }
        } else 
          alert('Please enter a valid amount')
        
      },
      toggle() {
        if(this.isPayment) {
          this.isPaymentLabel = 'Add to Credit'
          this.isPayment = false
        }
        else {
          this.isPaymentLabel = 'Receive Payment'
          this.isPayment = true
        }
      }
    }
  })
</script>

  <style scoped>
  .success {
    background-color: lime;
  }
  </style>
  