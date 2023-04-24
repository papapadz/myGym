<template>
      <ion-page>
        <div class="profile">
          <div class="profile-banner" style="background-image: url('https://img.freepik.com/premium-vector/black-yellow-background-with-paint-vector-illustration-with-gradient-background-vector-illustration_176456-656.jpg?w=360')">
            <img :class="isActive" :src="flipData.data.img.url" />
            <h2 class="profile-name">{{ flipData.data.card_number }}</h2>
          </div>
          <div class="profile-info">
            <ion-grid>
                <ion-row>
                    <ion-col>
                        <p><strong>Last Name:</strong> {{ flipData.data.lastname }}</p>
            <p><strong>First Name:</strong> {{ flipData.data.firstname }}</p>
            <p><strong>Middle Name:</strong> {{ flipData.data.middlename }}</p>
                    </ion-col>
                    <ion-col class="ion-text-end">
                        <p><strong>Birthday:</strong> {{ flipData.data.birthdate }}</p>
            <p><strong>Age:</strong> {{ flipData.data.firstname }}</p>
            <p><strong>Middle Name:</strong> {{ flipData.data.middlename }}</p>
                    </ion-col>
                </ion-row>
            </ion-grid>
          </div>
          <div class="profile-timeline">
            <ion-grid>
                <ion-row>
                 <!-- Card list menu -->
                    <ion-col size="12" size-md="4">
                        <ion-list class="card-list">
                        <ion-item button v-for="(item, index) in cardList" :key="index" @click="selectedCard = item" :class="{ 'selected-item': selectedCard.title === item.title }">
                                <ion-thumbnail slot="start">
                                    <img :src="item.image" />
                                </ion-thumbnail>
                                <ion-label>{{ item.title }}</ion-label>
                                </ion-item>
                        </ion-list>
                    </ion-col>
    
                    <!-- Dynamic card content -->
                    <ion-col size="12" size-md="8" v-if="selectedCard">
                        <ion-page v-if="selectedCard.title=='Profile'">
                            <ion-list lines="none">
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
                        </ion-page>
                        <ion-page v-if="selectedCard.title=='Attendance'">
                            <AttendanceList :attendanceData="navigation.getFlipAttendance" />
                        </ion-page>
                        <ion-page v-if="selectedCard.title=='Membership'">
                            <MembershipsVue :membershipData="navigation.getFlipMemberships" />
                        </ion-page>
                    </ion-col>
                </ion-row>
            </ion-grid>  
          </div>
        </div>
      </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { navigationStore } from '../stores/navigation'
import AttendanceList from '../components/AttendanceList.vue';
import MembershipsVue from '../components/MembershipsVue.vue';

export default defineComponent({
    components: {
        AttendanceList, MembershipsVue
    },
    data() {
        return {
            selectedIndex: 0,
            selectedCard: {
                title: 'Profile',
                image: 'https://law.ucdavis.edu/sites/g/files/dgvnsk10866/files/styles/sf_profile/public/media/images/website-user-icon-01b.png?h=b4f6d533&itok=J9JTcFmm',
                content: 'This is the content for Card 3.',
            },
            cardList: [
                {
                title: 'Profile',
                image: 'https://law.ucdavis.edu/sites/g/files/dgvnsk10866/files/styles/sf_profile/public/media/images/website-user-icon-01b.png?h=b4f6d533&itok=J9JTcFmm',
                content: 'This is the content for Card 3.',
                },
                {
                title: 'Attendance',
                image: 'https://www.iconarchive.com/download/i103365/paomedia/small-n-flat/calendar.1024.png',
                content: 'This is the content for Card 1.',
                },
                {
                title: 'Membership',
                image: 'https://img.freepik.com/premium-vector/id-card-icon-comic-style-identity-tag-vector-cartoon-illustration-white-isolated-background-driver-licence-business-concept-splash-effect_157943-6347.jpg',
                content: 'This is the content for Card 2.',
                }
            ],
        }
    },
    setup() {
        const navigation = navigationStore()
        const flipData = navigation.getFlipPage
        
        return {
            navigation,
            flipData
        }
    },
    computed: {
        isActive() {
            if(!Object.is(this.flipData.data.active_membership,null))
                return 'profile-image-active'
            return 'profile-image-inactive'
        }
    },
    mounted() {
        console.log(this.flipData)
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
  width: 100%;
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

/* Dynamic card content styles */
.dynamic-card {
  margin: 1rem auto;
  max-width: 90%;
}

.dynamic-card ion-card {
  height: 100%;
}

.selected-item {
  font-weight: bold;
}
</style>