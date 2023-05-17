<template>
    <ion-page>
        <ion-header :translucent="true"><ion-toolbar><ion-title></ion-title></ion-toolbar></ion-header>
        <ion-loading v-if="isLoading"></ion-loading>
        <ion-content v-else>
            <ion-grid :fixed="true">
                <ion-row>
                    <ion-col>
                        <ion-card v-if="!showConfirmPassword">
                            <ion-card-header>
                                User Details
                            </ion-card-header>
                                <ion-item>
                                    <ion-icon color="primary" slot="end" :icon="pencil"></ion-icon>
                                    <ion-label>
                                        First Name: 
                                    </ion-label>
                                    <ion-input :value="person.firstname" v-model="person.firstname"></ion-input>
                                </ion-item>
                                <ion-item>
                                    <ion-icon color="primary" slot="end" :icon="pencil"></ion-icon>
                                    <ion-label>
                                        Last Name: 
                                    </ion-label>
                                    <ion-input :value="person.lastname" v-model="person.lastname"></ion-input>
                                </ion-item>
                                <ion-item>
                                    <ion-icon color="primary" slot="end" :icon="pencil"></ion-icon>
                                    <ion-label>
                                        Birthdate: 
                                    </ion-label>
                                    <ion-input type="date" :value="person.birthdate" v-model="person.birthdate"></ion-input>
                                </ion-item>
                                <ion-item>
                                    <ion-icon color="primary" slot="end" :icon="pencil"></ion-icon>
                                    <ion-label>
                                        Phone Number: 
                                    </ion-label>
                                    <ion-input  :value="person.phone" v-model="person.phone"></ion-input>
                                </ion-item>
                                <ion-item>
                                    <ion-icon color="primary" slot="end" :icon="pencil"></ion-icon>
                                    <ion-label>
                                        Gender: 
                                    </ion-label>
                                    <ion-select :value="person.gender" v-model="person.gender">
                                        <ion-select-option value="M">Male</ion-select-option>
                                        <ion-select-option value="F">Female</ion-select-option>
                                    </ion-select>
                                </ion-item>
                                <ion-item>
                                    <ion-icon color="primary" slot="end" :icon="pencil"></ion-icon>
                                    <ion-label>
                                        Email: 
                                    </ion-label>
                                    <ion-input  :value="person.email" v-model="person.email"></ion-input>
                                </ion-item>
                                <ion-item v-if="page==2">
                                    <ion-icon color="primary" slot="end" :icon="pencil"></ion-icon>
                                    <ion-label>
                                        Password: 
                                    </ion-label>
                                    <ion-input type="password" :value="person.password" v-model="person.password"></ion-input>
                                </ion-item>
                                <ion-button @click="save" :color="getBtnColor" expand="block">{{ getBtnLabel }}</ion-button>
                        </ion-card>
                        <ion-card v-else>
                            <ion-card-header>Update Password</ion-card-header>
                            <ion-item>
                                <ion-icon color="primary" slot="end" :icon="pencil"></ion-icon>
                                <ion-label>
                                    Old Password: 
                                </ion-label>
                                <ion-input type="password" v-model="passwordReset.old"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-icon color="primary" slot="end" :icon="pencil"></ion-icon>
                                <ion-label>
                                    New Password: 
                                </ion-label>
                                <ion-input type="password" v-model="passwordReset.new"></ion-input>
                            </ion-item>
                                <ion-button expand="block" color="success" @click="update">Save</ion-button>
                                <ion-button expand="block" color="danger" @click="reset">Cancel</ion-button>
                        </ion-card>
                    </ion-col>
                    <ion-col v-if="page==1">
                        <ion-list>
                            <ion-item-group>
                                <ion-item-divider>
                                    <ion-label>User List</ion-label>
                                </ion-item-divider>
                            </ion-item-group>
                            <ion-item v-for="item in userList" :key="item.id">
                                <ion-label>
                                    <h2>{{ item.person.firstname }} {{ item.person.lastname }}</h2>
                                    <p>Email: {{ item.email }}</p>
                                    <p>Contact Number: {{ item.person.contact_num }}</p>
                                </ion-label>
                                <ion-button @click="delUser(item)" color="danger" slot="end"><ion-icon :icon="trash"></ion-icon></ion-button>
                            </ion-item>
                        </ion-list>
                    </ion-col>
                </ion-row>
            </ion-grid>
            <ion-fab slot="fixed" vertical="top" horizontal="end" class="ion-padding">
                <ion-fab-button :color="setFabColor" @click="btnClick">
                    <ion-icon :icon="setFabIcon" />
                </ion-fab-button>
                </ion-fab>
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from 'vue';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonList, IonItemGroup, IonItemDivider, IonItem, IonInput, IonSelect } from '@ionic/vue'
import { adminStore } from '../stores/admin';
import { pencil, add, close, trash } from 'ionicons/icons';

export default defineComponent({
    name: 'UserPage',
    components: {
        IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonList, IonItemGroup, IonItemDivider, IonItem, IonInput, IonSelect 
    },
    data() {
        return {
            page: 1,
            showConfirmPassword: false,
            passwordReset: {
                old: '',
                new: ''
            },
            person: {
                id: this.loggedInUser.id,
                firstname: this.loggedInUser.person.firstname,
                lastname: this.loggedInUser.person.lastname,
                phone: this.loggedInUser.person.contact_num,
                email: this.loggedInUser.email,
                password: this.loggedInUser.password,
                birthdate: this.loggedInUser.person.birthdate,
                gender: this.loggedInUser.person.gender,
                isNew: false
            }
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

        const hasError = computed(() => {
            return admin.hasError
        })

        const responseObject = computed(() => {
            return admin.responseObject
        })

        onMounted(() => {
            isLoading.value = true
            admin.fetchUsers().then(() => {
                isLoading.value = false
            })
        })

        return {
            admin, loggedInUser, isLoading, userList, pencil, add, close, hasError, trash, responseObject
        }
    },
    methods: {
        reset() {
            this.showConfirmPassword = false
            this.page = 1
            this.person.id = this.loggedInUser.id,
            this.person.firstname = this.loggedInUser.person.firstname
            this.person.lastname = this.loggedInUser.person.lastname
            this.person.phone = this.loggedInUser.person.contact_num
            this.person.email = this.loggedInUser.email
            this.person.password = this.loggedInUser.password
            this.person.birthdate = this.loggedInUser.person.birthdate
            this.person.gender = this.loggedInUser.person.gender
            this.person.isNew = false
        },
        btnClick() {
            if (this.page == 1) {
                this.page = 2
                this.person.firstname = ''
                this.person.lastname = ''
                this.person.phone = ''
                this.person.email = ''
                this.person.password = '',
                this.person.birthdate = ''
                this.person.gender = ''
                this.person.isNew = true
            } else {
                this.reset()
            }
        },
        save() {
            if(this.person.firstname != '' && this.person.lastname != '' && this.person.phone != '' && this.person.email != '' && this.person.password != '' && this.person.birthdate != '' && this.person.gender != '') {

                if(this.page==1)
                    this.showConfirmPassword = true
                else {
                    const x = confirm("Are you sure you want to save this record?")
                    if(x) {
                        this.isLoading = true
                        this.admin.saveUser(this.person).then(() => {
                            this.isLoading = false
                            if(this.hasError)
                                alert("An error has occurred, please try again.")
                            else
                                this.reset()
                        })
                    }
                }
                
            } else 
                    alert("Please fill up all fields")
        },
        delUser(user) {
            const x = confirm("Are you sure you want to delete this record?")
            if(x) {
                this.isLoading = true
                this.admin.deleteUser(user.id).then(() => {
                    this.isLoading = false
                })
            }
        },
        update() {
            this.isLoading = true
            this.admin.updateUser(this.person,this.passwordReset).then(() => {
                this.isLoading = false
                if(this.hasError)
                    alert("An error has occurred, please try again.")
                else if(this.responseObject.status == 0)
                    alert(this.responseObject.message)
                else {
                    alert(this.responseObject.message)
                    this.reset()
                    this.passwordReset = {
                        old: '',
                        new: ''
                    }
                }
                
            })
        }
    },
    computed: {
        setFabColor() {
            if (this.page == 1)
                return 'success'
            return 'danger'
        },
        setFabIcon() {
            if (this.page == 1)
                return this.add
            return this.close
        },
        getBtnLabel() {
            if (this.page == 1)
                return 'Update'
            return 'Save'
        },
        getBtnColor() {
            if (this.page == 1)
                return 'primary'
            return 'success'
        }
    }
})
</script>