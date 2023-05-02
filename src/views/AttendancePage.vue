<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <ion-header :translucent="true">
                <ion-toolbar>
                    <ion-title style="text-align: right;">{{ timestamp }}</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content style="height: 90vh;" v-if="page==1">
                <ion-item-group v-for="attendanceItem in getAttendanceToday" :key="attendanceItem.id">
                    <ion-item v-if="!isShown" button detail="true" @click="viewMore(attendanceItem)">
                        <ion-icon v-if="isWalkin(attendanceItem.person.active_membership)" :icon="walk"></ion-icon>
                        <ion-icon v-else :icon="star"></ion-icon>
                        <ion-label v-if="isTimedOut(attendanceItem.timeout)" class="ion-padding">
                            <h3>{{ attendanceItem.person.lastname }}, {{ attendanceItem.person.firstname }}</h3>
                            <p><ion-icon :icon="time"></ion-icon> {{ attendanceItem.created_at }} to {{ attendanceItem.timeout }}</p>
                        </ion-label>
                        <ion-label color="success" v-else class="ion-padding">
                            <h3>{{ attendanceItem.person.lastname }}, {{ attendanceItem.person.firstname }}</h3>
                            <p><ion-icon :icon="time"></ion-icon> {{ attendanceItem.created_at }}</p>
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
                    <ion-fab slot="fixed" vertical="bottom" horizontal="end" class="ion-padding">
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
    import moment from 'moment'
    import WorkoutList from '../components/WorkoutList.vue'

    export default defineComponent({
        name: 'AttendancePage',
        components: {
            WorkoutList,
            IonPage, IonContent, IonFab, IonFabButton, IonHeader, IonToolbar, IonCard, IonCardContent, IonInput, IonCardHeader, IonCardSubtitle, IonTitle, IonItem, IonItemGroup, IonIcon, IonLabel
        },
        data() {
            return {
                page: 1,
                timestamp: "",
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
        created() {
                setInterval(this.getNow, 1000);
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
            getNow: function() {        
                this.timestamp = moment().format('ddd, MMMM D, YYYY h:mm:ss a');
            },
            isWalkin(membership) {
                
                if(membership!==null)
                    return false
                return true
            },
            isTimedOut(timeout) {
                if(timeout===null)
                    return false
                return true
            },
            viewMore(attendance) {
                // this.navigation.$patch({
                //     selectedAttendanceID: attendance.id
                // })
                this.selectedData = attendance
                this.page = 2
            }
        }
    });
</script>
  
  <style>
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
  </style>