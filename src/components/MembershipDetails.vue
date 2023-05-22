<template>
    <ion-content v-if="!isLoading">
        <ion-card>
            <ion-card-header>
                <div v-if="!isExtendFormShown">
                    <ion-button size="small" color="warning" @click="back"><ion-icon  slot="start" :icon="arrowBack"></ion-icon> Back</ion-button>
                    <ion-button v-if="isActive(membershipDetails.expiry_date)" size="small" color="success" @click="showExtendForm"><ion-icon slot="start" :icon="timer"></ion-icon> Extend</ion-button>
                    <ion-button ion-button v-if="isActive(membershipDetails.expiry_date)" size="small" color="danger" @click="cancel"><ion-icon slot="start" :icon="trash"></ion-icon> Cancel</ion-button>
                </div>
            </ion-card-header>
            <ion-card-content>
                <div v-if="!isExtendFormShown">
                    <h2>Package: {{ membershipDetails.membership_category.membership_name }}</h2>
                    <h3>Price: Php {{ membershipDetails.membership_category.amount.toLocaleString('en-PH') }}</h3>
                    <h3>Start: {{ formatDate(membershipDetails.start_date) }}</h3>
                    <h3>End: {{ formatDate(membershipDetails.expiry_date) }}</h3>
                    <h3><ion-chip color="primary" v-if="isActive(membershipDetails.expiry_date)">{{ getDaysLeft(membershipDetails.expiry_date) }}</ion-chip></h3>
                    <ion-list>
                        <ion-item-divider>
                            <ion-label> <h2><b>Balance: Php {{ balance.toLocaleString('en-PH') }}</b></h2> </ion-label>
                        </ion-item-divider>
                        <ion-item v-for="item in membershipDetails.payments" :key="item.id">
                            <ion-label :color="!item.is_payment ? 'success' : 'danger'" >
                                <h2>Php {{ item.payment.toLocaleString('en-PH') }}</h2>
                                <p>{{ formatDate(item.created_at) }}</p>
                                <p>{{ item.remarks }}</p>
                            </ion-label>
                            <ion-icon slot="start" :color="!item.is_payment ? 'success' : 'danger'" :icon="!item.is_payment ? add : remove"></ion-icon>
                        </ion-item>
                    </ion-list>
                </div>
                <div v-else>
                    <ion-item-divider>
                        Extend
                    </ion-item-divider>
                    <ion-item>
                        <ion-label>Value: </ion-label>
                        <ion-input v-model="extensionObject.duration" placeholder="1 - 10" class="ion-text-end"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Duration: </ion-label>
                        <ion-select v-model="extensionObject.unit">
                            <ion-select-option value="day">Day</ion-select-option>
                            <ion-select-option value="mon">Month</ion-select-option>
                            <ion-select-option value="yr">Year</ion-select-option>
                        </ion-select>
                    </ion-item>
                    <ion-button size="small" color="success" @click="extend">Save</ion-button>
                </div>
            </ion-card-content>
        </ion-card>
    </ion-content>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonCardHeader, IonInput, IonSelect } from "@ionic/vue"
import { membershipStore } from "../stores/membeships";
import { navigationStore } from "../stores/navigation";
import { format, formatDistanceToNow, isPast } from 'date-fns'
import { arrowBack, trash, timer, remove, add } from 'ionicons/icons'

export default defineComponent({
    props: ['membershipObject'],
    components: {
        IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonCardHeader, IonInput, IonSelect
    },
    setup() {
        const membership = membershipStore()
        const navigation = navigationStore()
        const balance = ref(0)
        const membershipDetails = computed(() => {
            return membership.selectedMembership
        })

        const isExtendFormShown = computed(() => {
            return navigation.getMembershipsNavigation.isExtendFormShown
        })

        const extensionObject = ref({
            'unit' : 'day',
            'duration': 1
        })

        const isLoading = ref(false)
        return { membership, membershipDetails, isLoading, arrowBack, navigation, trash, timer, isExtendFormShown, extensionObject, remove, add, balance }
    },
    beforeMount() {
        this.isLoading = true
        this.membership.findMembership(this.membershipObject.id).then(() => {
            this.isLoading = false
            this.balance = Number(this.membership.selectedMembership.membership_category.amount)
            for(var i in this.membership.selectedMembership.payments)
               if(this.membership.selectedMembership.payments[i].is_payment)
                    this.balance -= Number(this.membership.selectedMembership.payments[i].payment)
                else
                    this.balance += Number(this.membership.selectedMembership.payments[i].payment)
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
            return 'Membership expires in ' + daysLeft
        },
        back() {
            this.navigation.$patch({
                membershipsNavigation: {
                    isPaymentHistoryShown: false,
                    isExtendFormShown: false
                }
            })
        },
        cancel() {
            const x = confirm('Are you sure you want to cancel this membership?')

            if(x) {
                this.isLoading = true
                this.membership.cancel(this.membershipDetails.id).then(() => {
                    this.isLoading = false
                    this.back()
                })
            }
        },
        extend() {
            
            const x = confirm('Are you sure you want to extend this membership for '+this.extensionObject.duration+' '+this.extensionObject.unit+'/s?')

            if(x) {
                this.isLoading = true
                this.membership.extend({
                    membershipID: this.membershipDetails.id,
                    value: this.extensionObject.duration,
                    duration: this.extensionObject.unit
                }).then(() => {
                    this.membership.findMembership(this.membershipObject.id).then(() => {
                        this.isLoading = false
                        this.isExtendFormShown = false
                    })
                })
            }
        },
        showExtendForm() {
            this.navigation.$patch({
                membershipsNavigation: {
                  isClicked: true,
                  isExtendFormShown: true
                }
              })
        }
    }
})
</script>