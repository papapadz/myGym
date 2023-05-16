<template>
    <ion-content v-if="!isLoading">
        <ion-card>
            <ion-card-header>
                <ion-button size="small" color="warning" @click="back"><ion-icon  slot="start" :icon="arrowBack"></ion-icon> Back</ion-button>
                <ion-button v-if="isActive(membershipDetails.expiry_date)" size="small" color="danger" @click="cancel"><ion-icon slot="start" :icon="trash"></ion-icon> Cancel</ion-button>
            </ion-card-header>
            <ion-card-content>
                <h2>Package: {{ membershipDetails.membership_category.membership_name }}</h2>
                <h3>Price: Php {{ membershipDetails.membership_category.amount.toLocaleString('en-PH') }}</h3>
                <h3>Start: {{ formatDate(membershipDetails.start_date) }}</h3>
                <h3><ion-badge v-if="isActive(membershipDetails.expiry_date)">{{ getDaysLeft(membershipDetails.expiry_date) }}</ion-badge></h3>
                <ion-list>
                    <ion-item-divider>
                        <ion-label> <h2><b>Payments</b></h2> </ion-label>
                    </ion-item-divider>
                    <ion-item v-for="item in membershipDetails.payments" :key="item.id">
                        <ion-label>
                            <h2>Php {{ item.payment.toLocaleString('en-PH') }}</h2>
                            <p>{{ formatDate(item.created_at) }}</p>
                        </ion-label>
                    </ion-item>
                </ion-list>
            </ion-card-content>
        </ion-card>
    </ion-content>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonCardHeader } from "@ionic/vue"
import { membershipStore } from "../stores/membeships";
import { navigationStore } from "../stores/navigation";
import { format, formatDistanceToNow, isPast } from 'date-fns'
import { arrowBack, trash } from 'ionicons/icons'

export default defineComponent({
    props: ['membershipObject'],
    components: {
        IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonCardHeader
    },
    setup() {
        const membership = membershipStore()
        const navigation = navigationStore()

        const membershipDetails = computed(() => {
            return membership.selectedMembership
        })
        const isLoading = ref(false)
        return { membership, membershipDetails, isLoading, arrowBack, navigation, trash }
    },
    beforeMount() {
        this.isLoading = true
        this.membership.findMembership(this.membershipObject.id).then(() => {
            this.isLoading = false
        })
    },
    methods: {
        isActive(expiry_date) {
            const thisDate = new Date(expiry_date)
            if(isPast(thisDate))
                return false
            return true 
        },
        formatDate(date) {
            return format(new Date(date), 'LLL d, yyyy hh:mm a')
        },
        getDaysLeft(date) {
            const thisDate = new Date(date)
            const daysLeft = formatDistanceToNow(thisDate)
            console.log('asdasd')
            return 'Membership expires in ' + daysLeft
        },
        back() {
            this.navigation.$patch({
                membershipsNavigation: {
                    isPaymentHistoryShown: false
                }
            })
        },
        cancel() {
            const x = confirm('Are you sure you want to cancel this membership?')

            if(x) {
                this.membership.cancel(this.membershipDetails.id).then(() => {
                    // this.navigation.setMembership(this.navigation.getFlipPage.data.id).then(() => {
                    //     this.navigation.$patch({
                    //         membershipsNavigation: {
                    //             isPaymentHistoryShown: false,
                    //         }
                    //     })
                    // })
                    this.$router.go(0)
                })
            }
        }
    }
})
</script>