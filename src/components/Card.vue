<template>
  <ion-card outline="success">
    <ion-card-header>
      <ion-card-subtitle>{{ cardData.person.card_number }}</ion-card-subtitle>
      <ion-card-title>{{ cardData.person.lastname }}, {{ cardData.person.firstname }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-chip color="primary">{{ getDaysLeft(cardData.person.active_membership.expiry_date) }}</ion-chip>
      <ion-chip color="warning">Balance: {{ balance(cardData) }}</ion-chip>
    </ion-card-content>
  </ion-card>
</template>

<script>
  import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCardContent } from '@ionic/vue'
  import { defineComponent } from 'vue';
  import { formatDistanceToNow } from 'date-fns'

  export default defineComponent({
    name: 'CardItem',
    props: ['cardData'],
    components: {
      IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCardContent
    },
    methods: {
        getDaysLeft(date) {
            const thisDate = new Date(date)
            const daysLeft = formatDistanceToNow(thisDate)
            console.log('asdasd')
            return 'Membership expires in ' + daysLeft
        },
        balance(item) {
            let total = parseFloat(item.person.active_membership.membership_category.amount)
            for(const k in item.payments) {
              total -= parseFloat(item.payments[k].payment)
            }
            return 'Php ' + total.toLocaleString('en-PH')
        }
    }
  });
  </script>

<style scoped>
ion-card {
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
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
