<template>
    <ion-content>
        <ion-loading v-if="isLoading"></ion-loading>
        <ion-content v-else>
            <ion-card v-if="page==1">
                <ion-card-header>Membership Items</ion-card-header>
                <ion-list>
                    <ion-item button detail="true" v-for="item in membershipList" :key="item.id" @click="select(item)">
                        <ion-icon color="success" :icon="stopOutline" slot="start"></ion-icon>
                        <ion-label>
                            <h3>{{ item.membership_name }}</h3>
                            <p>{{ item.remarks }}</p>
                            <p>Php {{ item.amount.toLocaleString('en-PH') }}</p>
                        </ion-label>
                    </ion-item>
                </ion-list>
            </ion-card>
            <ion-card v-else>
                <ion-list lines="none">
                    <ion-item>
                        <ion-icon :icon="pencil" color="primary" slot="end"></ion-icon>
                        <ion-label><b>Package Name:</b></ion-label>
                        <ion-input placeholder="Enter Package Name" v-model="selectedMembership.membership_name" :value="selectedMembership.membership_name"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-icon :icon="pencil" color="primary" slot="end"></ion-icon>
                        <ion-label><b>Description:</b></ion-label>
                        <ion-input placeholder="Enter Description" v-model="selectedMembership.remarks" :value="selectedMembership.remarks"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-icon :icon="pencil" color="primary" slot="end"></ion-icon>
                        <ion-label><b>Price:</b></ion-label>
                        <ion-input placeholder="Enter Price" v-model="selectedMembership.amount" :value="selectedMembership.amount"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-icon :icon="pencil" color="primary" slot="end"></ion-icon>
                        <ion-label><b>Duration:</b></ion-label>
                        <ion-select placeholder="Set Duration" v-model="selectedMembership.duration">
                            <ion-select-option value="5">1 Year</ion-select-option>
                            <ion-select-option value="4">6 Months</ion-select-option>
                            <ion-select-option value="3">3 Months</ion-select-option>
                            <ion-select-option value="2">1 Month</ion-select-option>
                            <ion-select-option value="1">1 Week</ion-select-option>
                          </ion-select>
                    </ion-item>
                    <ion-item>
                        <ion-button color="success" @click="save">Save</ion-button>
                        <ion-button color="danger" @click="page--">Cancel</ion-button>
                    </ion-item>
                </ion-list>
            </ion-card>
            <ion-fab v-if="page==1" slot="fixed" vertical="top" horizontal="end">
                <ion-fab-button color="success" @click="addNew">
                  <ion-icon :icon="add"></ion-icon>
                </ion-fab-button>
              </ion-fab>
        </ion-content>
    </ion-content>
</template>

<script>
import { IonContent, IonLoading, IonList, IonItem, IonIcon, IonInput, IonLabel, IonFab, IonFabButton, IonSelect, IonSelectOption, IonButton, IonCard, IonCardHeader } from '@ionic/vue'
import { defineComponent, onBeforeMount, computed, ref } from 'vue'
import { membershipStore } from '../stores/membeships'
import { stopOutline, pencil, add } from 'ionicons/icons'

export default defineComponent({
    components: {
        IonLoading, IonContent, IonList, IonItem, IonIcon, IonInput, IonLabel, IonFab, IonFabButton, IonSelect, IonSelectOption, IonButton, IonCard, IonCardHeader
    },
    setup() {
        const membership = membershipStore()
        const isLoading = ref(false)

        onBeforeMount(() => {
            isLoading.value = true
            membership.fetchMemberships().then(() => {
                isLoading.value = false
            })
        })

        const membershipList = computed(() => {
            return membership.getmembershipList
        })

        return {
            membership, membershipList, isLoading, stopOutline, pencil, add
        }
    },
    data() {
        return {
            page: 1,
            selectedMembership: {
                id: '',
                membership_name: '',
                remarks: '',
                amount: '',
                duration: '',
                isNew: true
            }
        }
    },
    methods: {
        select(membership) {
            this.page = 2
            this.selectedMembership=membership
            this.selectedMembership.duration = membership.duration+""
            this.selectedMembership.isNew = false
        },
        addNew() {
            this.page = 2
            this.selectedMembership={
                id: '',
                membership_name: '',
                remarks: '',
                amount: '',
                duration: '',
                isNew: true
            }
        },
        save() {
            this.isLoading = true
            this.membership.newMembershipCategory(this.selectedMembership).then(() => {
                this.isLoading = false
                this.page = 1
            })
        }
    }
})

</script>