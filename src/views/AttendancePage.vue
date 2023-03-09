<template>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-title></ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title style="text-align: right;">{{ timestamp }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <CardList :dataProp="attendance.getAttendance" v-if="!isShown"/>
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
    </ion-page>
  </template>
  
<script>
    import { IonPage, IonFab, IonFabButton, IonIcon, IonContent } from '@ionic/vue'
    import { defineComponent } from 'vue';
    import { people as peopleIcon, close as closeIcon } from 'ionicons/icons';
    import CardList from '../components/CardList.vue'
    import { attendanceStore } from '../stores/attendance';
    import { navigationStore } from '../stores/navigation';
    import moment from 'moment'

    export default defineComponent({
        name: 'AttendancePage',
        components: {
            IonPage, IonFab, IonFabButton, IonIcon, IonContent, CardList
        },
        data() {
            return {
                timestamp: "",
                peopleIcon,
                closeIcon,
                isShown: false,
                cardNum: '',
                isClicked: false,
                fabColor: 'primary',
                fabIcon: peopleIcon
            }
        },
        created() {
                setInterval(this.getNow, 1000);
            },
        setup() {
            const navigation = navigationStore()
            const attendance = attendanceStore()
            return {
                navigation,
                attendance
            }
        },
        beforeMount() {
            this.navigation.$patch({
                page: "attendance"
            })
        },
        mounted() {
            this.attendance.getAttendanceToday()
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
                        this.attendance.getAttendanceToday()
                        this.closeModal()
                    }, 500)
                }
            },
            setFocus() {
                //this.$refs.child.$el.focus();
            },
            findMember(cardNum) {
                console.log(cardNum)
                this.attendance.add(cardNum)
            },
            getNow: function() {
                    
                    this.timestamp = moment().format('ddd, MMMM D, YYYY h:mm:ss a');
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