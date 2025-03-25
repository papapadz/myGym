<template>
    <ion-page>
        <ion-loading v-if="isLoading"></ion-loading>
        <ion-content :fullscreen="true" class="bg-black">
            <div class="container">
                <ion-card class="login-card bg-yellow">
                    <div class="logo-container">
                        <img src="/assets/icon/dmax-icon.ico" alt="DMax Logo" class="logo">
                    </div>
                    <ion-card-header>
                        <ion-card-title class="text-dark">D Maximum Fitness Gym</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                        <ion-item class="ion-margin-bottom">
                            <ion-label position="stacked" class="text-dark">
                                <ion-icon :icon="mailIcon" class="mr-2"></ion-icon>
                                Email
                            </ion-label>
                            <ion-input 
                                type="email" 
                                v-model="email" 
                                class="custom-input text-dark"
                                placeholder="Enter your email"
                            ></ion-input>
                        </ion-item>
                        <ion-item class="ion-margin-bottom">
                            <ion-label position="stacked" class="text-dark">
                                <ion-icon :icon="lockIcon" class="mr-2"></ion-icon>
                                Password
                            </ion-label>
                            <ion-input 
                                type="password" 
                                v-model="password" 
                                class="custom-input text-dark"
                                placeholder="Enter your password"
                            ></ion-input>
                        </ion-item>
                        <ion-button 
                            expand="block" 
                            @click="login" 
                            class="login-button"
                        >
                            Sign In
                        </ion-button>
                    </ion-card-content>
                </ion-card>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
    IonPage, 
    IonContent, 
    IonCard, 
    IonItem, 
    IonInput, 
    IonButton, 
    IonCardContent, 
    IonIcon, 
    IonLabel, 
    IonLoading,
    IonCardHeader, 
    IonCardTitle 
} from '@ionic/vue'
import { mail as mailIcon, lockClosed as lockIcon } from 'ionicons/icons'
import { adminStore } from '../stores/admin'

// Composition API setup
const useAdminStore = adminStore()
const router = useRouter()

// Reactive references
const email = ref('')
const password = ref('')
const isLoading = ref(false)

// Login method
const login = async () => {
    isLoading.value = true
    
    try {
        if (email.value.length > 0 && password.value.length > 0) {
            await useAdminStore.login({
                email: email.value, 
                password: password.value
            })
            
            if (useAdminStore.getSession.status === 0) {
                alert('Email and password do not match!')
            } else {
                router.push('/home')
            }
        } else {
            alert('Email and password are required!')
        }
    } catch (error) {
        console.error('Login error:', error)
        alert('An error occurred during login')
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.bg-black {
    background-color: #000;
}

.bg-yellow {
    background-color: #FFD700;
}

.text-dark {
    color: #333;
}

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
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.logo-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
}

.logo {
    width: 100px;
    height: 100px;
    object-fit: contain;
}

.custom-input {
    background-color: rgba(255,255,255,0.8);
    border-radius: 8px;
    padding: 10px;
}

.login-button {
    --background: #000;
    --background-activated: #333;
    margin-top: 20px;
    text-transform: uppercase;
    font-weight: bold;
}

.ion-margin-bottom {
    margin-bottom: 15px;
}

.mr-2 {
    margin-right: 8px;
}
</style>