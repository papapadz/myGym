<template>
        <ion-card>
            <div class="card">
              <div class="additional">
                <div class="user-card">
                    <div class="level center">
                        {{ cardData.card_number }}
                      </div>
                  <div class="points center">
                    <ion-chip @click="presentActionSheet" :color="membership.color">{{ membership.text }}</ion-chip>
                  </div>
                  <img :src="cardData.img.url" alt="Profile Image" >
                </div>
                <div class="more-info">
                  <h1>{{ cardData.lastname }} {{ cardData.firstname }}</h1>
                  <div class="coords">
                    <span>{{ cardData.birthdate }}</span>
                    <span>{{ cardData.category.category }}</span>
                  </div>
                  <div class="coords">
                    <span>{{ cardData.contact_num }}</span>
                    <span>{{ cardData.gender }}</span>
                  </div>
                  <div class="coords">
                    <span>{{ cardData.address.name }}, {{ cardData.address.city.name }}, {{ cardData.address.province.name }}</span>
                  </div>
                  <div class="stats">
                    <div>
                      <div class="title">Days Left</div>
                      <i class="fa fa-gamepad"></i>
                      <div class="value">27</div>
                    </div>
                    <div>
                      <div class="title">Visits</div>
                      <i class="fa fa-trophy"></i>
                      <div class="value">{{ cardData.attendance.length }}</div>
                    </div>
                    <div>
                      <div class="title">Pals</div>
                      <i class="fa fa-group"></i>
                      <div class="value">123</div>
                    </div>
                    <div>
                      <div class="title">Coffee</div>
                      <i class="fa fa-coffee"></i>
                      <div class="value infinity">∞</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="general">
                <h1>{{ cardData.firstname }}</h1>
                <p>Member since {{ membership.joinDate }}</p>
                <p v-if="this.membership.show">Membership will expire on {{ membership.expiry }}</p>
                <p v-if="(this.cardData.attendance.length>0)">Last visit at {{ membership.attendanceLastDate }}</p>
                <span class="more">Mouse over the card for more info</span>
              </div>
            </div>
            <code>{{ result }}</code>
        </ion-card>
</template>
<script>
  import { IonCard, IonChip, actionSheetController } from '@ionic/vue';
  import { defineComponent, ref } from 'vue';
  import { navigationStore } from '../stores/navigation';
  import moment from 'moment'

  export default defineComponent({
    name: 'CardProfile',
    props: ['data'],
    components: { IonCard, IonChip },
    setup() {
      const navigation = navigationStore()
      const result = ref('')
      const appSheetButton = {
          text: 'Enroll',
          isEnrolled: false
      }
      const presentActionSheet = async () => {
        const actionSheet = await actionSheetController.create({
          header: 'Options',
          buttons: [
            {
              text: appSheetButton.text,
              role: 'appl',
              data: {
                action: 'delete',
              },
              handler:() => {

              }
            },
            {
              text: 'Share',
              data: {
                action: 'share',
              },
            },
            {
              text: 'Cancel',
              role: 'cancel',
              data: {
                action: 'cancel',
              },
            },
          ],
        });

        await actionSheet.present();

        const res = await actionSheet.onDidDismiss();
        result.value = JSON.stringify(res, null, 2);
      };

      return {
        navigation,
        presentActionSheet
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
    }
  })
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Abel');

ion-card {
    max-width: 500px;
    margin: 0 auto;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    border-radius: 5px;
  }

.center {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
}

.card {
  width: 450px;
  height: 250px;
  background-color: #fff;
  background: linear-gradient(#f8f8f8, #fff);
  box-shadow: 0 8px 16px -8px rgba(0,0,0,0.4);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin: 1.5rem;
}

.card h1 {
  text-align: center;
}

.card .additional {
  position: absolute;
  width: 150px;
  height: 100%;
  background: linear-gradient(#e1f10b, #eeea6e);
  transition: width 0.4s;
  overflow: hidden;
  z-index: 2;
}

.card.green .additional {
  background: linear-gradient(#92bCa6, #A2CCB6);
}


.card:hover .additional {
  width: 100%;
  border-radius: 0 5px 5px 0;
}

.card .additional .user-card {
  width: 150px;
  height: 100%;
  position: relative;
  float: left;
}

.card .additional .user-card::after {
  content: "";
  display: block;
  position: absolute;
  top: 10%;
  right: -2px;
  height: 80%;
  border-left: 2px solid rgba(0,0,0,0.025);
}

.card .additional .user-card .level,
.card .additional .user-card .points {
  top: 15%;
  text-transform: uppercase;
  font-size: 0.75em;
  font-weight: bold;
  padding: 0.125rem 0.75rem;
  white-space: nowrap;
}

.card .additional .user-card .points {
  top: 85%;
}

.card .additional .user-card svg {
  top: 50%;
}

.card .additional .more-info {
  width: 300px;
  float: left;
  position: absolute;
  left: 150px;
  height: 100%;
}

.card .additional .more-info h1 {
  color: #fff;
  margin-bottom: 0;
}

.card.green .additional .more-info h1 {
  color: #224C36;
}

.card .additional .coords {
  margin: 0 1rem;
  color: #fff;
  font-size: 1rem;
}

.card.green .additional .coords {
  color: #325C46;
}

.card .additional .coords span + span {
  float: right;
}

.card .additional .stats {
  font-size: 2rem;
  display: flex;
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  top: auto;
  color: #fff;
}

.card.green .additional .stats {
  color: #325C46;
}

.card .additional .stats > div {
  flex: 1;
  text-align: center;
}

.card .additional .stats i {
  display: block;
}

.card .additional .stats div.title {
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.card .additional .stats div.value {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.5rem;
}

.card .additional .stats div.value.infinity {
  font-size: 2.5rem;
}

.card .general {
  width: 300px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  box-sizing: border-box;
  padding: 1rem;
  padding-top: 0;
}

.card .general .more {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  font-size: 0.9em;
}
</style>