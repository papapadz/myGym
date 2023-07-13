<template>
    <ion-content>
        <ion-card>
            <ion-card-content>
                <ion-grid>
                    <ion-row>
                        <ion-col class="ion-padding">
                            <h1><b>Package: {{ membershipItem.membership_name }}</b></h1>
                            <h2>Price: Php {{ membershipItem.amount.toLocaleString('en-PH') }}</h2>
                            <p>Description: {{ membershipItem.remarks }}</p>
                        </ion-col>
                        <ion-col v-if="page==2" class="ion-padding">
                            <ion-loading v-if="loading" message="Saving please wait"> </ion-loading>
                            <div v-else>
                                <h1><b>Payment Details</b></h1>
                                <h2><ion-badge>1</ion-badge> Start Date</h2>
                                <ion-datetime v-model="selectedDate" locale="en-PH" presentation="date"></ion-datetime>
                                <h2><ion-badge>2</ion-badge> Payment Received</h2>
                                <ion-input type="decimal" class="large" placeholder="Enter Amount" v-model="amount"></ion-input>
                                <h2><ion-badge>3</ion-badge> Remarks</h2>
                                <ion-input type="decimal" class="large" placeholder="Remarks" v-model="remarks"></ion-input>
                                <ion-button color="success" @click="save">Save</ion-button>
                                <br>
                            </div>
                        </ion-col>
                    </ion-row>
                </ion-grid>
                <ion-button v-if="page==1" @click="enroll">Enroll</ion-button>
            </ion-card-content>
        </ion-card>
    </ion-content>
</template>

<script>
import { defineComponent } from 'vue'
import { IonContent, IonCard, IonCardContent, IonGrid, IonCol, IonRow, IonBadge, IonButton, IonInput, IonDatetime, IonLoading } from '@ionic/vue'
import { membershipStore } from '../stores/membeships'
import { navigationStore } from '../stores/navigation'

export default defineComponent({
    name: 'MembershipItem',
    components: {
        IonContent, IonCard, IonCardContent, IonGrid, IonCol, IonRow, IonBadge, IonButton, IonInput, IonDatetime, IonLoading
    },
    props: ['membershipItem'],
    setup() {
        const membership = membershipStore()
        const navigation = navigationStore()

        return {
            membership, navigation, personData: navigation.getFlipPage.data
        }
    },
    data() {
        return {
            page: 1,
            selectedDate: new Date().toISOString(),
            amount: 0,
            loading: false,
            remarks: 'Downpayment'
        }
    },
    methods: {
        enroll() {
            this.page = 2
        },
        async save() {
            try {
                this.loading = true
                const data = {
                    personID: this.personData.id,
                    itemID: this.membershipItem.id,
                    startDate: this.selectedDate,
                    payment: this.amount,
                    remarks: this.remarks
                }
                await this.membership.enroll(data).then(() => {
                    this.loading = false
                })
            } catch(error) {
                this.loading = false
                alert('An error occurred while saving, please try again.')
                console.error(error)
            } finally {
                this.loading = false
                this.navigation.$patch({
                        membershipsNavigation: {
                            page:1,
                            isAddShown: false,
                            isPaymentFormShown: false,
                            isClicked: false,
                            isExtendFormShown: false
                        }
                    })
            }
        }
    }
})
</script>

<style scoped>
.large {
    font-size: 24px;
}
</style>