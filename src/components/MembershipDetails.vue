<template>
    <ion-content v-if="!isLoading">
        <ion-card>
            <ion-card-content>
                <h2>Package: {{ membershipDetails.membership_category.membership_name }}</h2>
                <h3>Price: Php {{ membershipDetails.membership_category.amount.toLocaleString('en-PH') }}</h3>
                <h3>Start: {{ formatDate(membershipDetails.start_date) }}</h3>
                <h3><ion-badge>{{ getDaysLeft(membershipDetails.expiry_date) }}</ion-badge></h3>
                <ion-list>
                    <ion-item-divider>
                        <ion-label> <h2><b>Payments</b></h2> </ion-label>
                    </ion-item-divider>
                    <ion-item v-for="item in membershipDetails.payments" :key="item.id">
                        <ion-label>
                            <h2>{{ item.payment.toLocaleString('en-PH') }}</h2>
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
import { IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel } from "@ionic/vue"
import { membershipStore } from "../stores/membeships";
import { format, formatDistanceToNow } from 'date-fns'

export default defineComponent({
    props: ['membershipObject'],
    components: {
        IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel
    },
    setup() {
        const membership = membershipStore()
        const membershipDetails = computed(() => {
            return membership.selectedMembership
        })
        const isLoading = ref(false)
        return { membership, membershipDetails, isLoading }
    },
    beforeMount() {
        this.isLoading = true
        this.membership.findMembership(this.membershipObject.id).then(() => {
            this.isLoading = false
        })
    },
    methods: {
        formatDate(date) {
            return format(new Date(date), 'LLL d, yyyy hh:mm a')
        },
        getDaysLeft(date) {
            const thisDate = new Date(date)
            const daysLeft = formatDistanceToNow(thisDate)
            console.log('asdasd')
            return 'Membership expires in ' + daysLeft
      },
    }
})
</script>