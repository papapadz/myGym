<template>
    <ion-page>
        <ion-loading v-if="isLoading"></ion-loading>
        <ion-content :fullscreen="true">
            <div class="container">
                <ion-card class="login-card">
                <ion-card-header>
                    <ion-card-title>Login</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <ion-item>
                        <ion-label>
                            <ion-icon slot="start" :icon="mail"></ion-icon>
                            Email:
                        </ion-label>
                        <ion-input labelPlacement="stacked" label="Email" type="email" v-model="email"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>
                            <ion-icon slot="start" :icon="text"></ion-icon>
                            Password:
                        </ion-label>
                        <ion-input labelPlacement="stacked" label="Password" type="password" v-model="password"></ion-input>
                    </ion-item>
                    <ion-button expand="block" @click="login">Sign in</ion-button>
                </ion-card-content>
                </ion-card>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonItem, IonInput, IonButton, IonCardContent, IonIcon, IonLabel, IonLoading } from '@ionic/vue'
import { defineComponent, ref, onMounted } from 'vue';
import { mail, text } from 'ionicons/icons'
import { adminStore } from '../stores/admin';
import { Preferences } from '@capacitor/preferences';
import router from '@/router'

export default defineComponent({
    name: 'LoginPage',
    components: {
        IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonItem, IonInput, IonButton, IonCardContent, IonIcon, IonLabel, IonLoading
    },
    setup() {
        const admin = adminStore()
        const isLoading = ref(false)

        // const autoLogin = (e,p) => {
        //     this.admin.login({
        //         email: e, password: p
        //     }).then(() => {
        //         this.isLoading = false
        //         this.$router.push('/home')
        //     })
        // }
        
        onMounted( async () => {
            let b = false
            await Preferences.get({key: 'session'}).then((e) => {
                b = e.value!=null
                if(b) {
                    const session = JSON.parse(e.value)
                    let dateOne = new Date(session.created_at);
                    let dateTwo = new Date();
                    let msDifference = dateTwo - dateOne;
                    const minutes = Math.floor(msDifference / 1000 / 60);
                    console.log(minutes)
                    if(minutes<=5) {
                        session.created = new Date().toISOString()
                        admin.$patch({
                            session: session
                        })
                        router.push('/home')
                    }
                }
            })
        })

        return {
            mail, text, admin, isLoading
        }
    },
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        login() {
            this.isLoading = true
            if(this.email.length>0 && this.password.length>0)
                this.admin.login({
                    email: this.email, password: this.password
                }).then(() => {
                    this.isLoading = false
                    if(this.admin.getSession.status==0)
                        alert('Email and password does not match!')
                    else
                        this.$router.push('/home')
                })
            else {
                this.isLoading = false
                alert('Email and password does are required!')
            }
        }
    }
})
</script>

<style scoped>
  .container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .login-card {
    max-width: 400px;
    width: 90%;
    text-align: center;
  }
  </style>