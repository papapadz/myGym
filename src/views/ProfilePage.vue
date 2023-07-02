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
                        <ion-row class="ion-padding-bottom">
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
                                                    <ion-icon v-if="isEditing" :icon="pencil" slot="end" color="primary"/>
                                                    <ion-input :clear-input="true" :readonly="!isEditing" v-model="profileData.card_number"></ion-input>
                                                </ion-item>
                                            </ion-item-group>
                                            
                                            <ion-loading v-if="isLoading"></ion-loading>
                                            <ion-item-group>
                                                <ion-item-divider>
                                                    <ion-label>
                                                        Personal Information
                                                    </ion-label>
                                                </ion-item-divider>
                                                    <ion-item>
                                                        <ion-label slot="start">Last Name:</ion-label>
                                                        <ion-input :clear-input="true" :readonly="!isEditing" v-model="profileData.lastname"></ion-input>
                                                        <ion-icon v-if="isEditing" :icon="pencil" slot="end" color="primary"/>
                                                    </ion-item>
                                                    <ion-item>
                                                        <ion-label slot="start">First Name:</ion-label>
                                                        <ion-input :clear-input="true" :readonly="!isEditing" v-model="profileData.firstname"></ion-input>
                                                        <ion-icon v-if="isEditing" :icon="pencil" slot="end" color="primary"/>
                                                    </ion-item>
                                                    <ion-item>
                                                        <ion-label slot="start" >Middle Name:</ion-label>
                                                        <ion-input :clear-input="true" :readonly="!isEditing" v-model="profileData.middlename"></ion-input>
                                                        <ion-icon v-if="isEditing" :icon="pencil" slot="end" color="primary"/>
                                                    </ion-item>
                                                    <ion-item>
                                                        <ion-label slot="start">Birthday:</ion-label>
                                                        <ion-input type="date" :clear-input="true" :readonly="!isEditing" v-model="profileData.birthdate"></ion-input>
                                                        <ion-icon v-if="isEditing" :icon="pencil" slot="end" color="primary"/>
                                                    </ion-item>
                                                    <ion-item>
                                                        <ion-label slot="start">
                                                           Gender
                                                        </ion-label>
                                                        <ion-input v-if="!isEditing" :readonly="!isEditing" :value="(profileData.gender=='M' ? 'Male' : 'Female')"></ion-input>
                                                        <ion-select v-else placeholder="Select Gender" v-model="profileData.gender">
                                                            <ion-select-option value="M">Male</ion-select-option>
                                                            <ion-select-option value="F">Female</ion-select-option>
                                                        </ion-select>  
                                                        <ion-icon v-if="isEditing" :icon="pencil" slot="end" color="primary"/>
                                                    </ion-item>
                                                    <ion-item>
                                                        <ion-label>
                                                            Address:
                                                        </ion-label>
                                                        <ion-input v-if="!isEditing" :readonly="!isEditing" :value="displayAddress"></ion-input>
                                                    </ion-item>
                                                    <ion-item  v-if="isEditing">
                                                        <ion-label position="floating">Select Region</ion-label>
                                                        <ion-select placeholder="Select Region" v-model="selectedAddress.region" @ionChange="selectAddress(1)">
                                                            <ion-select-option v-for="item in address.getRegionList" :key="item.id" :value="item.region_id">{{ item.name }}</ion-select-option>
                                                        </ion-select>
                                                        <ion-icon v-if="isEditing" :icon="pencil" slot="end" color="primary"/>
                                                    </ion-item>
                                                    <ion-item v-if="isEditing">
                                                        <ion-label position="floating">Select Province</ion-label>
                                                        <ion-select placeholder="Select Province" v-model="selectedAddress.province" @ionChange="selectAddress(2)">
                                                            <ion-select-option v-for="item in address.getProvinceList" :key="item.id" :value="item.province_id">{{ item.name }}</ion-select-option>
                                                        </ion-select>
                                                        <ion-icon v-if="isEditing" :icon="pencil" slot="end" color="primary"/>
                                                    </ion-item>
                                                    <ion-item v-if="isEditing">
                                                        <ion-label position="floating">Select City/Municipality</ion-label>
                                                        <ion-select placeholder="Select City/Municipality" v-model="selectedAddress.city" @ionChange="selectAddress(3)">
                                                            <ion-select-option v-for="item in address.getCityList" :key="item.id" :value="item.city_id">{{ item.name }}</ion-select-option>
                                                        </ion-select>
                                                        <ion-icon v-if="isEditing" :icon="pencil" slot="end" color="primary"/>
                                                    </ion-item>
                                                    <ion-item v-if="isEditing">
                                                        <ion-label position="floating">Select Barangay</ion-label>
                                                        <ion-select placeholder="Select Barangay" v-model="profileData.address_id" @ionChange="selectAddress(4)">
                                                            <ion-select-option v-for="item in address.getBarangayList" :key="item.id" :value="item.code">{{ item.name }}</ion-select-option>
                                                        </ion-select>
                                                        <ion-icon v-if="isEditing" :icon="pencil" slot="end" color="primary"/>
                                                    </ion-item>
                                            </ion-item-group>

                                            <ion-item-group>
                                                <ion-item-divider>
                                                    <ion-label>
                                                        Contact Information
                                                    </ion-label>
                                                </ion-item-divider>
                                                <ion-item>
                                                    <ion-label slot="start" >Phone Nunber:</ion-label>
                                                    <ion-input :clear-input="true" :readonly="!isEditing" v-model="profileData.contact_num"></ion-input>
                                                    <ion-icon v-if="isEditing" :icon="pencil" slot="end" color="primary"/>
                                                </ion-item>
                                            </ion-item-group>

                                            <ion-item-group>
                                                <ion-item-divider>
                                                    <ion-label>Other Information</ion-label>
                                                </ion-item-divider>
                                                <ion-item>
                                                        <ion-label slot="start">
                                                           Category
                                                        </ion-label>
                                                        <ion-input v-if="!isEditing" :readonly="!isEditing" :value="profileData.category.category"></ion-input>
                                                        <ion-select v-else placeholder="Select Category" v-model="profileData.category_id">
                                                            <ion-select-option v-for="cateItem in members.getMemberCategories" :key="cateItem.id" :value="cateItem.id">{{ cateItem.category }}</ion-select-option>
                                                        </ion-select>  
                                                        <ion-icon v-if="isEditing" :icon="pencil" slot="end" color="primary"/>
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
                    <ion-fab-button v-if="!isEditing" @click="deleteMember">
                        <ion-icon color="danger" :icon="trash"></ion-icon>
                    </ion-fab-button>
                    <ion-fab-button v-if="!isEditing" @click="editMember">
                        <ion-icon color="primary" :icon="pencil"></ion-icon>
                    </ion-fab-button>
                    <ion-fab-button v-if="isEditing" @click="saveEdit">
                        <ion-icon color="success" :icon="save"></ion-icon>
                    </ion-fab-button>
                    <ion-fab-button v-if="isEditing" @click="isEditing=false">
                        <ion-icon color="danger" :icon="close"></ion-icon>
                    </ion-fab-button>
                </ion-fab-list>
              </ion-fab>
        </ion-content>
      </ion-page>
</template>

<script>
import { IonLoading, IonContent, IonPage, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonItemGroup, IonItemDivider, IonSegment, IonSegmentButton, IonFab, IonFabButton, IonIcon, IonFabList, IonInput, IonSelect, IonSelectOption } from '@ionic/vue'
import { defineComponent, computed, ref } from 'vue';
import { navigationStore } from '../stores/navigation'
import AttendanceList from '../components/AttendanceList.vue';
import MembershipsVue from '../components/MembershipsVue.vue';
import { isPast } from 'date-fns'
import { chevronUpCircle, trash, pencil, close, save } from 'ionicons/icons'
import { membersStore } from '../stores/members';
import { adminStore } from '../stores/admin'
import { addressStore } from '../stores/address';

export default defineComponent({
    components: {
        AttendanceList, MembershipsVue,
        IonLoading, IonContent, IonPage, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonItemGroup, IonItemDivider, IonSegment, IonSegmentButton, IonFab, IonFabButton, IonIcon, IonFabList, IonInput, IonSelect, IonSelectOption
    },
    data() {
        return {
            selectedAddress: {
                region: '',
                province: '',
                city: ''
            },
            profileData: this.flipData.data,
            isEditing: false,
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
        const isLoading = ref(false)
        const navigation = navigationStore()
        const flipData = navigation.getFlipPage
        const flipMembership = computed(() => {
            return navigation.getFlipMemberships
        })
        const members = membersStore()
        const admin = adminStore()
        const address = addressStore()

        return {
            navigation,
            members,
            flipData,
            flipMembership,
            chevronUpCircle, trash, pencil, close, save,
            admin,
            address,
            isLoading
        }
    },
    computed: {
        isActive() {
            if(!Object.is(this.flipData.data.active_membership,null))
                if(!isPast(new Date(this.flipData.data.active_membership.expiry_date)))
                    return 'profile-image-active'
            return 'profile-image-inactive'
        },
        displayAddress() {
            return this.flipData.data.address.name+', '+this.flipData.data.address.city.name+', '+this.flipData.data.address.province.name
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
        },
        editMember() {
            this.isLoading = true
            let memberData = this.flipData.data
            this.admin.fetchCategories().then(() => {
                memberData.category = this.admin.getCategories.find(e => e.id == this.flipData.data.category.id)
            }).finally(() => {
                
                this.members.$patch({
                    person: memberData
                })

                this.address.getRegions().then(() => {
                    this.isEditing = true
                }).finally(() => {
                    
                    this.members.getCategories().then(() => {
                        this.isLoading = false
                    })
                })

            })
        },
        selectAddress(flag) {
            this.isLoading = true
            switch(flag) {
            case 1:
                this.address.getProvinces(this.selectedAddress.region).then(() => {
                    this.isLoading = false
                    this.selectedAddress.province = ''
                    this.selectedAddress.city = ''
                    this.selectedAddress.barangay = ''
                })
                
                break
            case 2:
                this.address.getCities(this.selectedAddress.province).then(() => {
                    this.isLoading = false
                    this.selectedAddress.city = ''
                    this.selectedAddress.barangay = ''
                })
                break
            case 3:
                this.address.getBarangays(this.selectedAddress.city).then(() => {
                    this.isLoading = false
                })
                break
            default: 
                this.isLoading = false
            }
        },
        fetchRegions() {
            this.isLoading = true
            this.address.getRegions().then(() => {
                this.isLoading = false
            })
        },
        saveEdit() {
            const x = confirm('Are you sure you want save the changes made?')
            if(x) {
                this.isLoading = true
                this.members.update(this.profileData).then(() => {
                    this.isEditing = false
                    this.isLoading = false
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