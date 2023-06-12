<template>
      <ion-page>
        <ion-content>
            <ion-grid>
                <ion-row>
                    <ion-col size="12">
                        <div class="profile">
                            <div class="profile-banner" style="background-image: url('https://img.freepik.com/premium-vector/black-yellow-background-with-paint-vector-illustration-with-gradient-background-vector-illustration_176456-656.jpg?w=360')">
                                <img :class="isActive" :src="flipData.data.img.url" />
                            </div>
                        </div>
                    </ion-col>
                </ion-row>
                <ion-row class="ion-padding">
                    <ion-col size="12">
                        <hr>
                    </ion-col>
                </ion-row>
                        <ion-row>
                            <ion-col size="12">
                                <ion-segment>
                                    <ion-segment-button v-for="(item, index) in cardList" :key="index" @click="selectCard(item)" :value="{ 'default': selectedCard.title === item.title }">
                                        <ion-label>{{ item.title }}</ion-label>
                                    </ion-segment-button>
                                </ion-segment>
                            </ion-col>
                        </ion-row>
                        <ion-row>
                            <ion-col size="12" v-if="selectedCard" style="height: 50vh">
                                <ion-content>
                                    <ion-content v-if="selectedCard.title=='Profile'">
                                        <ion-list lines="none">
                                            <ion-item-group>
                                                <ion-item-divider>
                                                    <ion-label>
                                                        Card Number
                                                    </ion-label>
                                                </ion-item-divider>
                                                <ion-item>
                                                        <ion-label>
                                                            {{ flipData.data.card_number }}
                                                        </ion-label>
                                                    </ion-item>
                                            </ion-item-group>

                                            <ion-item-group>
                                                <ion-item-divider>
                                                    <ion-label>
                                                        Personal Information
                                                    </ion-label>
                                                </ion-item-divider>
                                                    <ion-item>
                                                        <ion-label>
                                                            Name: {{ flipData.data.lastname }}, {{ flipData.data.firstname }} {{ flipData.data.middlename }}
                                                        </ion-label>
                                                    </ion-item>
                                                    <ion-item>
                                                        <ion-label>
                                                            Birthday: {{ flipData.data.birthdate }}
                                                        </ion-label>
                                                    </ion-item>
                                                    <ion-item>
                                                        <ion-label>
                                                            Gender: {{ flipData.data.gender }}
                                                        </ion-label>
                                                    </ion-item>
                                                    <ion-item>
                                                        <ion-label>
                                                            Address: {{ flipData.data.address.name }}, {{ flipData.data.address.city.name }}, {{ flipData.data.address.province.name }}
                                                        </ion-label>
                                                    </ion-item>
                                            </ion-item-group>

                                            <ion-item-group>
                                                <ion-item-divider>
                                                    <ion-label>
                                                        Contact Information
                                                    </ion-label>
                                                </ion-item-divider>
                                                <ion-item>
                                                        <ion-label>
                                                            Phone Number: {{ flipData.data.contact_num }}
                                                        </ion-label>
                                                    </ion-item>
                                            </ion-item-group>
                                        </ion-list>
                                    </ion-content>
                                    <AttendanceList v-if="selectedCard.title=='Attendance'" :attendanceData="navigation.getFlipAttendance" />
                                    <MembershipsVue  v-if="selectedCard.title=='Membership'" :membershipData="flipMembership" />
                                </ion-content>
                            </ion-col>
                        </ion-row>
            </ion-grid> 
            <ion-fab slot="fixed" vertical="bottom" horizontal="end">
                <ion-fab-button>
                  <ion-icon :icon="chevronUpCircle"></ion-icon>
                </ion-fab-button>
                <ion-fab-list side="top">
                    <ion-fab-button @click="deleteMember">
                        <ion-icon color="danger" :icon="trash"></ion-icon>
                    </ion-fab-button>
                    <ion-fab-button>
                        <ion-icon color="primary" :icon="pencil"></ion-icon>
                    </ion-fab-button>
                </ion-fab-list>
              </ion-fab>
        </ion-content>
      </ion-page>
</template>

<script>
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonItemGroup, IonItemDivider, IonSegment, IonSegmentButton } from '@ionic/vue'
import { defineComponent, computed } from 'vue';
import { navigationStore } from '../stores/navigation'
import AttendanceList from '../components/AttendanceList.vue';
import MembershipsVue from '../components/MembershipsVue.vue';
import { isPast } from 'date-fns'
import { chevronUpCircle, trash, pencil } from 'ionicons/icons'
import { membersStore } from '../stores/members';
export default defineComponent({
    components: {
        AttendanceList, MembershipsVue,
        IonContent, IonPage, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonItemGroup, IonItemDivider, IonSegment, IonSegmentButton
    },
    data() {
        return {
            selectedIndex: 0,
            selectedCard: {
                title: 'Profile',
            },
            cardList: [
                {
                    title: 'Profile'
                },
                {
                    title: 'Attendance'
                },
                {
                    title: 'Membership'
                }
            ],
        }
    },
    setup() {
        const navigation = navigationStore()
        const flipData = navigation.getFlipPage
        const flipMembership = computed(() => {
            return navigation.getFlipMemberships
        })
        const members = membersStore()

        return {
            navigation,
            members,
            flipData,
            flipMembership,
            chevronUpCircle, trash, pencil,
        }
    },
    computed: {
        isActive() {
            if(!Object.is(this.flipData.data.active_membership,null))
                if(!isPast(new Date(this.flipData.data.active_membership.expiry_date)))
                    return 'profile-image-active'
            return 'profile-image-inactive'
        }
    },
    methods: {
        selectCard(item) {
            this.selectedCard = item
            this.navigation.$patch({
                membershipsNavigation: {
                    page:1,
                    isAddShown: false,
                    isPaymentHistoryShown: false
                }
            })
        },
        deleteMember() {
            const x = confirm('Are you sure you want to delete this member?')
            if(x) {
                this.members.delete(this.flipData.data.id).then(() => {
                    this.navigation.$patch({
                        flip: {
                            page: 1
                        }
                    })
                })
            }
        }
    }
})
</script>

<style>

.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.profile-banner {
  position: relative;
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  position: absolute;
  bottom: -75px;
}

.profile-image-active {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    position: absolute;
    bottom: -75px;
    border: 5px solid rgb(0, 102, 255);
}

.profile-image-inactive {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    position: absolute;
    bottom: -75px;
    border: 5px solid rgb(255, 255, 255);
}

.profile-name {
  color: white;
  margin-top: 1rem;
  font-size: 2rem;
}

.profile-status {
  color: white;
  margin-top: 0.5rem;
  font-size: 1.2rem;
}

.profile-info {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.profile-timeline {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.card-list {
  margin: 1rem;
}

.card-list ion-item {
  --ripple-color: var(--ion-color-primary);
}

.card-list ion-item.activated {
  --background: var(--ion-color-light);
}


.selected-item {
  font-weight: bold;
}

.full-height {
    height: 100%;
}
</style>