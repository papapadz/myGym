<template>
    <ion-page>
      <ion-content>
        <ion-list v-if="page==1">
          <ion-item-group>
            <ion-item-divider>Attendance</ion-item-divider>
          </ion-item-group>
          <ion-item-group v-for="group in groups" :key="group.year + group.month">
            <ion-item-divider>{{ group.year }} - {{ months[group.month - 1] }}</ion-item-divider>
            <ion-item v-for="date in group.dates" :key="date.id" button detail="false" @click="viewMore(getObject(date.id))">
              <ion-icon :icon="time"></ion-icon>
              <ion-label class="ion-padding">
                  <h2>{{ getObject(date.id).person.lastname }}, {{ getObject(date.id).person.firstname }}</h2>
                  <p><ion-icon :icon="time"></ion-icon> {{ displayDateFormat(getObject(date.id)) }}</p>
              </ion-label>
            </ion-item>
          </ion-item-group>
        </ion-list>
        <ion-grid v-else :fixed="true">
          <ion-row>
            <ion-button class="ion-text-end" color="warning" @click="page=1">
              <ion-icon :icon="arrowBack"></ion-icon> Go Back
            </ion-button>
          </ion-row>
          <ion-row v-if="page==2" class="ion-justify-content-start">
              <ion-col v-for="workoutItem in getWorkoutList" :key="workoutItem.id">            
                <ion-card :color="getIntensity(workoutItem.work_out_item)">
                  <ion-card-header>
                    <ion-card-title>{{ workoutItem.work_out_item.workout_name }}</ion-card-title>
                    <ion-card-subtitle>{{ workoutItem.created_at }}</ion-card-subtitle>
                  </ion-card-header>
                  <ion-card-content>
                    {{ workoutItem.notes }}
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>
        </ion-grid>
      </ion-content>
    </ion-page>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import { IonList, IonItemGroup, IonItemDivider, IonItem, IonIcon, IonPage, IonLabel, IonContent, IonGrid, IonRow, IonCol, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue'
  import { star, walk, time, arrowBack } from 'ionicons/icons'
  import { format } from 'date-fns'

  export default defineComponent({
    props: ['attendanceData'],
    components: {
      IonList, IonItemGroup, IonItemDivider, IonItem, IonIcon, IonPage, IonLabel, IonContent, IonGrid, IonRow, IonCol, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent
    },
    data() {
      return {
        workOutList: null,
        selectedData: null,
        page: 1,
        dates: this.attendanceData,
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      }
    },
    setup() {
      return {
        star, walk, time, arrowBack
      }
    },
    computed: {
        groups() {
            if (!this.dates || this.dates.length === 0) {
                return []
            }
            const arr = this.dates.map(date => ({ id: date.id, date: new Date(date.created_at) }))
            return arr.reduce((acc, curr) => {
            const year = curr.date.getFullYear()
            const month = curr.date.getMonth() + 1
            const exists = acc.find(a => a.year === year && a.month === month)
            if (exists) {
                exists.dates.push(curr)
            } else {
                acc.push({ year, month, dates: [curr] })
            }
            return acc
            }, [])
        },
        getWorkoutList() {
          return this.workOutList
        }
    },
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = this.months[date.getMonth()]
        const day = date.getDate()
        const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        return `${month} ${day}, ${year}, ${time}`
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
        console.log(attendance)
        // this.page = 2
        // this.workOutList = attendance.work_outs
      },
      getObject(id) {
          return this.attendanceData.filter(d => d.id == id)[0]
      },
      getIntensity(workout) {
        console.log(workout)
        switch(workout.intensity) {
          case 1: return 'success'
          case 2: return 'warning'
          case 3: return 'danger'
        }
      },
      displayDateFormat(attendance) {
          if(attendance.timeout)
              return format(new Date(attendance.created_at), 'LLL d, yyyy hh:mm a') + ' to ' + format(new Date(attendance.timeout), 'hh:mm a')

          return format(new Date(attendance.created_at), 'LLL d, yyyy hh:mm a')
      }
    }
  })
  </script>
  