<template>
    <ion-page>
        <ion-header :translucent="true"><ion-toolbar><ion-title></ion-title></ion-toolbar></ion-header>
        <ion-loading v-if="isLoading"></ion-loading>
        <ion-content v-else>
            <ion-grid :fixed="true">
                <ion-row>
                    <ion-col size="4">
                        <ion-card>
                            <ion-card-header>
                                <h2>{{ loggedInUser.person.firstname }} {{ loggedInUser.person.lastname }}</h2>
                            </ion-card-header>
                                <ion-item>
                                    <ion-icon color="primary" slot="end" :icon="pencil"></ion-icon>
                                    <ion-label>
                                        First Name: 
                                    </ion-label>
                                    <ion-input :value="loggedInUser.person.firstname" v-model="lfirstname"></ion-input>
                                </ion-item>
                                <ion-item>
                                    <ion-icon color="primary" slot="end" :icon="pencil"></ion-icon>
                                    <ion-label>
                                        Last Name: 
                                    </ion-label>
                                    <ion-input :value="loggedInUser.person.lastname" v-model="lastname"></ion-input>
                                </ion-item>
                                <ion-item>
                                    <ion-icon color="primary" slot="end" :icon="pencil"></ion-icon>
                                    <ion-label>
                                        Email: 
                                    </ion-label>
                                    <ion-input  :value="loggedInUser.email" v-model="personEmail"></ion-input>
                                </ion-item>
                        </ion-card>
                    </ion-col>
                    <ion-col>
                        <ion-list>
                            <ion-item-group>
                                <ion-item-divider>
                                    <ion-label>User List</ion-label>
                                </ion-item-divider>
                            </ion-item-group>
                            <ion-item v-for="item in userList" :key="item.id">
                                {{ item }}
                            </ion-item>
                        </ion-list>
                    </ion-col>
                </ion-row>
            </ion-grid>
            <ion-fab slot="fixed" vertical="top" horizontal="end" class="ion-padding">
                <ion-fab-button color="success">
                    <ion-icon :icon="add" />
                </ion-fab-button>
                </ion-fab>
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from 'vue';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonList, IonItemGroup, IonItemDivider, IonItem } from '@ionic/vue'
import { adminStore } from '../stores/admin';
import { pencil, add } from 'ionicons/icons';

export default defineComponent({
    name: 'UserPage',
    components: {
        IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonList, IonItemGroup, IonItemDivider, IonItem
    },
    data() {
        return {
            firstname: '',
            lastname: '',
            personEmail: '',
            password: ''
        }
    },
    setup() {
        const admin = adminStore()
        const isLoading = ref(true)

        const loggedInUser = computed(() => {
            return admin.getSession.data
        })

        const userList = computed(() => {
            return admin.getUserList
        })

        onMounted(() => {
            isLoading.value = true
            admin.fetchUsers().then(() => {
                isLoading.value = false
            })
        })

        return {
            loggedInUser, isLoading, userList, pencil, add
        }
    }
})
</script>