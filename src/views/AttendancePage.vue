<template>
    <ion-page>
        <div class="card-container">
            <ion-card @click="setFocus" v-if="isShown">
                    <ion-card-header>
                        <ion-card-subtitle>Press Tab</ion-card-subtitle>
                        <ion-card-title>Username</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                        <ion-input type="text" placeholder="Click Here" v-model="cardNum" @ion-input="captureCard" @ion-blur="setFocus" ref="child"></ion-input>
                    </ion-card-content>
                </ion-card>
        </div>
        <ion-content>
            <CardList />
                    <ion-fab slot="fixed" vertical="bottom" horizontal="end" class="ion-padding">
                        <ion-fab-button @click="showModal">
                            <ion-icon :icon="peopleIcon" />
                        </ion-fab-button>
                    </ion-fab>
                </ion-content>
    </ion-page>
  </template>
  
<script>
    import {IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonPage, IonInput, IonCard, IonFab, IonFabButton, IonIcon, IonContent } from '@ionic/vue'
    import { defineComponent } from 'vue';
    import { people as peopleIcon } from 'ionicons/icons';
    import CardList from '../components/CardList.vue';

    export default defineComponent({
        name: 'AttendancePage',
        components: {
            IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonPage, IonInput, IonCard, IonFab, IonFabButton, IonIcon, IonContent, CardList
        },
        data() {
            return {
                peopleIcon,
                isShown: false,
                cardNum: '',
                isClicked: false
            }
        },
        methods: {
            showModal() {
                this.isShown=true
                this.setFocus();
            },
            captureCard(event) {
                if(!this.isClicked) {
                    this.isClicked = true
                    setTimeout(() => {
                        const input = event.target.value;
                        this.isClicked = false
                        this.cardNum = ""
                        this.findMember(input)
                    }, 500)
                }
            },
            setFocus() {
                this.$refs.child.$el.focus();
            },
            findMember(cardNum) {
                console.log(cardNum)
            }
        }
    });
</script>
  
  <style>
    .card-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
  
    ion-card {
      max-width: 400px;
      width: 100%;
      padding: 20px;
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      transition: 0.3s;
      border-radius: 5px;
    }
  </style>