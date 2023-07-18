<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title style="text-align: right;"></ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-loading v-if="isLoading"></ion-loading>
        <ion-content v-else :fullscreen="true">
            <ion-content style="height: 90vh;" v-if="navPage.page==1">
                <ion-item-group v-for="attendanceItem in getAttendanceToday" :key="attendanceItem.id">
                    <ion-item :color="isTimedOut(attendanceItem.timeout)" v-if="!isShown" button detail="true" @click="viewMore(attendanceItem)">
                        <ion-icon v-if="isWalkin(attendanceItem.person.active_membership)" :icon="walk"></ion-icon>
                        <ion-icon v-else :icon="star"></ion-icon>
                        <ion-label class="ion-padding">
                            <h2>{{ attendanceItem.person.lastname }}, {{ attendanceItem.person.firstname }}</h2>
                            <p><ion-icon :icon="time"></ion-icon> {{ displayDateFormat(attendanceItem) }}</p>
                            <p>{{ displayExpiryDateFormat(attendanceItem.person.active_membership) }}</p>
                        </ion-label>
                    </ion-item>
                </ion-item-group>
                <div class="card-container">
                    <ion-card v-if="isShown">
                            <ion-card-header>
                                <ion-card-subtitle>Scan RFID Card</ion-card-subtitle>
                            </ion-card-header>
                            <ion-card-content>
                                <input class="ion-no-border" ref="inputCard" type="text" placeholder="Scan card now" v-model="cardNum" @input="captureCard" />
                            </ion-card-content>
                    </ion-card>
                    <ion-header collapse="condense">
                    <ion-toolbar>
                        <ion-title size="large">Blank</ion-title>
                    </ion-toolbar>
                    </ion-header>
                    <ion-fab slot="fixed" vertical="top" horizontal="end" class="ion-padding">
                                <ion-fab-button @click="showModal" :color="fabColor">
                                    <ion-icon :icon="fabIcon" />
                                </ion-fab-button>
                            </ion-fab>
                </div>
            </ion-content>
            <WorkoutList v-else :attendanceData="selectedData"/>
        </ion-content>
    </ion-page>
  </template>
  
<script>
    import { defineComponent, onMounted, ref, computed } from 'vue';
    import { people as peopleIcon, close as closeIcon, walk, star, time } from 'ionicons/icons';
    import { attendanceStore } from '../stores/attendance';
    import { navigationStore } from '../stores/navigation';
    import { membersStore } from '../stores/members'
    import { IonPage, IonContent, IonFab, IonFabButton, IonHeader, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonTitle, IonItem, IonItemGroup, IonIcon, IonLabel, IonLoading } from '@ionic/vue'
    import WorkoutList from '../components/WorkoutList.vue'
    import { format, isPast } from 'date-fns'

    export default defineComponent({
        name: 'AttendancePage',
        components: {
            WorkoutList,
            IonPage, IonContent, IonFab, IonFabButton, IonHeader, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonTitle, IonItem, IonItemGroup, IonIcon, IonLabel, IonLoading
        },
        data() {
            return {
                page: 1,
                peopleIcon,
                closeIcon,
                isShown: false,
                cardNum: '',
                isClicked: false,
                fabColor: 'primary',
                fabIcon: peopleIcon,
                selectedData: null
            }
        },
        computed: {
            getAttendanceToday() {
                return this.attendance.getAttendance
            }
        },
        setup() {
            const navigation = navigationStore()
            const attendance = attendanceStore()
            const members = membersStore()
            const isLoading = ref(true)

            const navPage = computed(() => {
                return navigation.getAttendanceNavigation
            })

            onMounted(() => {
                isLoading.value = true
                attendance.getAttendanceToday().then(() => {
                    isLoading.value = false
                })
            })

            return {
                navigation,
                attendance,
                walk,
                star,
                time,
                attendanceToday: attendance.getAttendance,
                allMembers: members.getMembers,
                navPage
            }
        },
        methods: {
            showModal() {
                if(this.isShown) {
                    this.closeModal()
                } else {
                        this.isShown=true
                        this.fabColor='danger',
                        this.fabIcon=closeIcon

                        setTimeout(() => 
                            this.$refs.inputCard.focus()
                        ,1)
                }
            },
            closeModal() {
                this.isShown=false
                this.fabColor='primary',
                this.fabIcon=peopleIcon
            },
            captureCard(event) {
                if(!this.isClicked) {
                    this.isClicked = true
                    setTimeout(() => {
                        try {
                            this.isLoading = true
                            const input = event.target.value;
                            this.isClicked = false
                            this.cardNum = ""
                            this.attendance.add(input).then((e) => {
                                console.log(e)
                                if(e.data.status=='DUPLICATE') {
                                    let conf = confirm('Member has an existing attendance today, are you sure you want to add another another attendance?')
                                    if(!conf) 
                                        this.attendance.deleteAttendance(e.data.object.id)
                                } else if(e.data.status=='ERROR') {
                                    alert('Card Number is invalid!')
                                }
                            }).finally(() => this.attendance.getAttendanceToday().then(() => this.closeModal()))
                        } catch(error) {
                            console.error(error)
                            alert('Card Number is invalid!')
                        } finally {
                            this.isLoading = false
                        }
                   }, 1000)
                }
            },
            isWalkin(membership) {
                
                if(membership!==null) {
                    if(!isPast(new Date(membership.expiry_date)))
                        return false
                }
                return true
            },
            isTimedOut(timeout) {
                if(!timeout)
                    return 'success'
            },
            viewMore(attendance) {
                this.selectedData = attendance
                this.navigation.$patch({
                    attendanceNavigation: {
                        page: 2
                    }
                })
                //this.page = 2
            },
            displayDateFormat(attendance) {
                if(attendance.timeout)
                    return format(new Date(attendance.created_at), 'LLL d, yyyy hh:mm a') + ' to ' + format(new Date(attendance.timeout), 'hh:mm a')
                
                return format(new Date(attendance.created_at), 'LLL d, yyyy hh:mm a')
            },
            displayExpiryDateFormat(membership) {
                if(!this.isWalkin(membership))
                    return 'Expiry Date: '+format(new Date(membership.expiry_date), 'LLL d, yyyy')
                
            }
        }
    });
</script>
  
  <style scoped>
    .card-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    ion-card {
      max-width: 400px;
      width: 100%;
      padding: 20px;
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      transition: 0.3s;
      border-radius: 5px;
    }

    .active {
        color: rgb(25, 155, 25)
    }

    input {
        border-radius: 10px !important; 
        font-size: 1em; 
        border: 1px solid #f1f1f1 !important; --background: rgb (219,219,219) !important;
    }
  </style>