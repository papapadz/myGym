<template>
  <ion-card>
    <img src="https://d3nn873nee648n.cloudfront.net/HomeImages/Concept-and-Ideas.jpg" alt="Profile Image">
    <ion-card-header>
      <ion-card-subtitle>{{ data.title }}</ion-card-subtitle>
      <ion-card-title>Username</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <p>Bio information goes here.</p>
    </ion-card-content>
  </ion-card>
</template>

<script>
  import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from '@ionic/vue'
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'CardItem',
    props: ['data'],
    components: {
      IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent
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
