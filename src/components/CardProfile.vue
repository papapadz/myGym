<template>
  <ion-content>
    <ion-card>
    <div v-if="!flipped">
      <div class="card-image">
        <img :src="cardData.img.url">
      </div>
      <ion-card-content>
        <ion-card-title>
          {{ cardData.card_number }}
        </ion-card-title>
        <ion-card-subtitle>
          {{ cardData.lastname }}, {{ cardData.firstname }} {{ cardData.middlename }}
        </ion-card-subtitle>
        <ion-chip>
          <ion-icon name="pin" color="primary"></ion-icon>
          <ion-label>Members since {{ getMembership.joinDate }}</ion-label>
          <ion-icon name="close"></ion-icon>
        </ion-chip>
        <div class="fb-like" data-href="https://example.com/my-page" data-layout="button" data-action="like" data-size="small" data-share="true"></div>
      </ion-card-content>
      <ion-button fill="clear" @click="openProfile">View Profile</ion-button>
    </div>
    <div v-else>
      <ion-card-content>
        <ion-card-title>
          {{ cardData.card_number }}
        </ion-card-title>
        <ion-card-subtitle>
          {{ cardData.lastname }}, {{ cardData.firstname }} {{ cardData.middlename }}
        </ion-card-subtitle>
        <ion-grid>
          <ion-row>
            <ion-col>{{ cardData.birthdate }}</ion-col>
            <ion-col>{{ cardData.gender }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col>{{ cardData.contact_num }}</ion-col>
            <ion-col>{{ cardData.category.category }}</ion-col>
          </ion-row>
        </ion-grid>
      </ion-card-content>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
          <ion-fab-button>
            <ion-icon :icon="gridOutline"></ion-icon>
          </ion-fab-button>
          <ion-fab-list side="top">
            <ion-fab-button>
              <ion-icon :icon="pencil"></ion-icon>
            </ion-fab-button>
            <ion-fab-button>
              <ion-icon :icon="ribbonOutline"></ion-icon>
            </ion-fab-button>
            <ion-fab-button>
              <ion-icon :icon="barChart" @click="openProfile"></ion-icon>
            </ion-fab-button>
          </ion-fab-list>
        </ion-fab>
    </div>
  </ion-card>
  </ion-content>
</template>
<script>
import { defineComponent } from 'vue';
import { navigationStore } from '../stores/navigation';
import { membersStore } from '../stores/members';
import moment from 'moment'
import { schoolOutline as schoolIcon, gridOutline, pencil, ribbonOutline, barChart } from 'ionicons/icons';

export default defineComponent({
name: 'CardProfile',
props: ['data'],
components: {  },
setup() {
const navigation = navigationStore()
const members = membersStore()
const flipData = navigation.getFlipPage

return {
  schoolIcon,
  navigation,
  gridOutline,
  ribbonOutline,
  pencil,
  barChart,
  members,
  flipData
}
},
beforeMount() {
console.log(this.navigation.getPage)
switch(this.navigation.getPage) {
  case "members":
    this.cardData = this.data
    break
  case "attendance":
    this.cardData = this.data.person
    this.membership.timein = 'logged in ' + moment(this.data.created_at).format('LT')
    break
}
if(this.cardData.gender=='M')
  this.cardData.gender = 'Male'
else
  this.cardData.gender = 'Female'
if(Object.is(this.cardData.active_membership,null)) {
  if(this.navigation.getPage=="members") {
    this.membership.text = 'Not enrolled'
    this.membership.color = 'danger'
  }
  else
    this.membership.text = 'Walk-In'
} else {
  this.membership.show = true
  this.membership.color = 'success'
  this.membership.text = this.cardData.active_membership.membership_category.membership_name
  this.membership.expiry = moment(this.cardData.active_membership.expiry_date).format('LL')
}
this.membership.joinDate = moment(this.cardData.created_at).format('LL')
if(this.cardData.attendance.length>0)
  this.membership.attendanceLastDate = moment(this.cardData.attendance[0].attendance_date).format('LL')
this.cardData.birthdate = moment(this.cardData.birthdate).format('LL')
},
data() {
  return {
      cardData: {},
      flip: 1,
      membership: {
          text: '',
          color: 'primary',
          show: false,
          expiry: '',
          timein: '',
          joinDate: '',
          attendanceLastDate: ''
      },
  }
},
computed: {
  getMembership() {
    return this.membership
  },
  flipped() {
    if(!Object.is(this.flipData.data,null))
      if(this.flipData.data.card_number==this.cardData.card_number)
        return true
    return false
  }
},
methods: {
  flipPage() {
    let d = this.cardData
    let p = 2
    
    if(!Object.is(this.flipData.data,null)) {
      if(this.flipData.data.card_number==this.cardData.card_number) {
        d = null,
        p = 1
      }
    }
      this.navigation.$patch({
        flip: {
          data: d,
          page: p
        }
      })
  },
  openProfile() {
    this.navigation.$patch({
      flip: {
        data: this.cardData,
        page: 3
      }
    })
  }
}
})
</script>

<style>

ion-card {
  max-width: 500px;
  max-height: 250px;
  min-width: 300px;
  min-height: 250px;
}

.card-image img {
  float: left;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
  width: 150px;
  height: 150px;
  object-fit: cover;
  padding: 10px;
}
</style>