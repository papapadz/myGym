<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title style="text-align: right;"></ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-content style="height: 90vh;" v-if="page==1">
                <ion-item-group v-for="attendanceItem in getAttendanceToday" :key="attendanceItem.id">
                    <ion-item v-if="!isShown" button detail="true" @click="viewMore(attendanceItem)">
                        <ion-icon v-if="isWalkin(attendanceItem.person.active_membership)" :icon="walk"></ion-icon>
                        <ion-icon v-else :icon="star"></ion-icon>
                        <ion-label :class="isTimedOut(attendanceItem.timeout)">
                            <h2>{{ attendanceItem.person.lastname }}, {{ attendanceItem.person.firstname }}</h2>
                            <p><ion-icon :icon="time"></ion-icon> {{ displayDateFormat(attendanceItem) }}</p>
                        </ion-label>
                    </ion-item>
                </ion-item-group>
                <div class="card-container">
                    <ion-card @click="setFocus" v-if="isShown">
                            <ion-card-header>
                                <ion-card-subtitle>Scan RFID Card</ion-card-subtitle>
                            </ion-card-header>
                            <ion-card-content>
                                <ion-input type="text" placeholder="Click Here" v-model="cardNum" @ion-input="captureCard" @ion-blur="setFocus" ref="child"></ion-input>
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
    import { defineComponent, onMounted } from 'vue';
    import { people as peopleIcon, close as closeIcon, walk, star, time } from 'ionicons/icons';
    import { attendanceStore } from '../stores/attendance';
    import { navigationStore } from '../stores/navigation';
    import { membersStore } from '../stores/members'
    import { IonPage, IonContent, IonFab, IonFabButton, IonHeader, IonToolbar, IonCard, IonCardContent, IonInput, IonCardHeader, IonCardSubtitle, IonTitle, IonItem, IonItemGroup, IonIcon, IonLabel } from '@ionic/vue'
    import WorkoutList from '../components/WorkoutList.vue'
    import { format, isPast } from 'date-fns'

    export default defineComponent({
        name: 'AttendancePage',
        components: {
            WorkoutList,
            IonPage, IonContent, IonFab, IonFabButton, IonHeader, IonToolbar, IonCard, IonCardContent, IonInput, IonCardHeader, IonCardSubtitle, IonTitle, IonItem, IonItemGroup, IonIcon, IonLabel
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

            onMounted(() => {
                attendance.getAttendanceToday()
            })

            return {
                navigation,
                attendance,
                walk,
                star,
                time,
                attendanceToday: attendance.getAttendance,
                allMembers: members.getMembers
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
                }
                
                this.setFocus();
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
                        const input = event.target.value;
                        this.isClicked = false
                        this.cardNum = ""
                        this.findMember(input)
                        this.closeModal()
                    }, 500)
                }
            },
            setFocus() {
                //this.$refs.child.$el.focus();
            },
            findMember(cardNum) {
                console.log(cardNum)
                const newItem = this.attendance.add(cardNum)
                console.log(newItem)
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
                    return 'active ion-padding'
                return 'ion-padding'
            },
            viewMore(attendance) {
                // this.navigation.$patch({
                //     selectedAttendanceID: attendance.id
                // })
                this.selectedData = attendance
                this.page = 2
            },
            displayDateFormat(attendance) {
                console.log(attendance.timeout)
                if(attendance.timeout)
                    return format(new Date(attendance.created_at), 'LLL d, yyyy hh:mm a') + ' to ' + format(new Date(attendance.timeout), 'hh:mm a')
                
                return format(new Date(attendance.created_at), 'LLL d, yyyy hh:mm a')
                
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
  </style>