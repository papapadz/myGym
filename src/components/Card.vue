<template>
  <ion-card>
    <img :src="cardData.img.url" alt="Profile Image" >
    <ion-card-header>
      <ion-card-subtitle>{{ cardData.card_number }}</ion-card-subtitle>
      <ion-card-title>{{ cardData.lastname }}, {{ cardData.firstname }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <center>
        <ion-chip :color="membership.color">{{ membership.text }}</ion-chip>
        <ion-chip v-if="membership.show" color="warning">{{ membership.expiry }}</ion-chip>
        <ion-chip v-if="navigation.getPage=='attendance'" :color="secondary">{{ membership.timein }}</ion-chip>
      </center>
      <ion-list v-if="navigation.getPage=='members'">
        <ion-item-group>
          <ion-item-divider>
            <ion-label>
              MEMBER DETAILS
            </ion-label>
          </ion-item-divider>

          <ion-item>
            <ion-note slot="start">Name: </ion-note>
            <ion-label>{{ cardData.lastname }}, {{ cardData.firstname }} {{ cardData.middlename }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-note slot="start">Birthday: </ion-note>
            <ion-label>{{ cardData.birthdate }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-note slot="start">Gender: </ion-note>
            <ion-label>{{ gender }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-note slot="start">Contact #: </ion-note>
            <ion-label>{{ cardData.contact_num }}</ion-label>
          </ion-item>
        </ion-item-group>
      </ion-list>
      
      <MembershipsVue :member="cardData" />
    </ion-card-content>
  </ion-card>
</template>

<script>
  import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonChip } from '@ionic/vue'
  import { defineComponent } from 'vue';
  import { navigationStore } from '../stores/navigation';
  import moment from 'moment'
  import MembershipsVue from './Memberships.vue';

  export default defineComponent({
    name: 'CardItem',
    props: ['data'],
    components: {
      IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonChip, MembershipsVue
    },
    setup() {
      const navigation = navigationStore()
      return {
        navigation
      }
    },
    data() {
      return {
        cardData: {},
        membership: {
          text: '',
          color: 'primary',
          show: false,
          expiry: '',
          timein: ''
        },
        gender: ''
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
        this.gender = 'Male'
      else
        this.gender = 'Female'

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
        this.membership.text = this.cardData.active_membership.membership_category.membership_name+" membership"
        this.membership.expiry = "expires on " + this.cardData.active_membership.expiry_date
      }
    }
  });
  </script>

<style scoped>
ion-card {
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  border-radius: 5px;
}

ion-card img {
  width: 150px;
  padding: 5px;
  display: block;
  margin: 0 auto;
  border-radius: 50%;
}

ion-card-header {
  text-align: center;
}

ion-card-subtitle {
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

ion-card-title {
  font-size: 24px;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 0;
}

ion-card-content {
  padding: 15px;
}
</style>
