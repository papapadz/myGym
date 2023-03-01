<template>
    <ion-page>
        <div class="card-container">
                <ion-card @click="setFocus">
                    <ion-card-header>
                        <ion-card-subtitle>Full Name</ion-card-subtitle>
                        <ion-card-title>Username</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                        <p>Bio information goes here.</p>
                        <ion-input type="text" placeholder="Enter your name" v-model="cardNum" @ion-input="captureCard" @ion-blur="notifyFocus" v-bind:autofocus="isFocused" ref="child"></ion-input>
                    </ion-card-content>
                </ion-card>
        </div>
    </ion-page>
  </template>
  
<script>
    import {IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonPage, IonInput, IonCard } from '@ionic/vue'
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'AttendancePage',
        components: {
            IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonPage, IonInput, IonCard
        },
        mounted() {
            console.log(this.$refs.child.autofocus)
        },
        data() {
            return {
                isFocused: true,
                cardNum: '',
                isClicked: false
            }
        },
        methods: {
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
            notifyFocus() {
                console.log(this.$refs.child.focus())
            },
            setFocus() {
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