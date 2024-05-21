<template>
    <ion-content>
        <ion-loading v-if="isLoading"></ion-loading>
        <Bar v-else :data="chartData" />
        <ion-fab horizontal="end" >
            <ion-fab-button @click="isModalOpen=true">
                <ion-icon :icon="calendar" />
            </ion-fab-button>
        </ion-fab>
        <ion-modal :is-open="isModalOpen" @willDismiss="isModalOpen=false" :initial-breakpoint="0.5" :breakpoints="[0, 0.5, 0.75]">
        <ion-header>
            <ion-toolbar>
                <ion-title>Filter By</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-item>
                <ion-label>Department: </ion-label>
                <ion-select v-model="deptInput">
                    <ion-select-option :value="0">All</ion-select-option>
                    <ion-select-option v-for="dept in departmentList" :key="dept.id" :value="dept.id">
                        {{ dept.name }}
                    </ion-select-option>
                </ion-select>
            </ion-item>
            <ion-item>
                <ion-label>Date: </ion-label>
                <ion-input type="date" v-model="dateInput" @click="change(1)"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label>Year: </ion-label>
                <ion-select @click="change(2)" v-model="yearInput">
                    <ion-select-option v-for="(yr, index) in yearList" :value="yr" :key="index">{{ yr }}</ion-select-option>
                </ion-select>
            </ion-item>
            <ion-button v-if="btnText!=''" expand="block" @click="fetchData">Filter by {{ btnText }}</ion-button>
        </ion-content>
        </ion-modal>
    </ion-content>
</template>

<script>
import { defineComponent, computed, onBeforeMount, ref } from 'vue'
import { IonContent, IonLoading, IonFab, IonFabButton, IonModal, IonHeader, IonToolbar, IonItem, IonIcon, IonInput, IonTitle, IonLabel, IonSelect, IonSelectOption, IonButton } from '@ionic/vue'
import { attendanceStore } from '../stores/attendance'
import { adminStore } from '../stores/admin'
import { calendar } from 'ionicons/icons'
import { format } from 'date-fns'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
export default defineComponent({
    components: {
        IonContent, Bar, IonLoading, IonFab, IonFabButton, IonModal, IonHeader, IonToolbar, IonItem, IonIcon, IonInput, IonTitle, IonLabel, IonSelect, IonSelectOption, IonButton
    },
    setup() {
        const isModalOpen = ref(false)
        const attendance = attendanceStore()
        const isLoading = ref(false)
        const yearList = []
        const yearInput = ref('2023')
        const dateInput = ref(new Date())
        const isDateClicked = ref(false)
        const btnText = ref('')
        const deptInput = ref(0)
        const departmentList = computed(() => adminStore().getStatData.departments)

        onBeforeMount(() => {
            
            let year = 2023
            let ctr = 0
            
            do {
                yearList.push(year)
                year++
                ctr++
            } while(ctr<=10)

            fetchData()
        })

        const chartData = computed(() => {
            return attendance.getChartData
        })

        function change(val) {
            if(val==1) {
                btnText.value = 'Day'
                isDateClicked.value = true
                yearInput.value = null
            } else {
                btnText.value = 'Year'
                isDateClicked.value = false
                dateInput.value = null
            }
        }

        async function fetchData() {
            isModalOpen.value = false
            isLoading.value = true
            let filterBy = 'year'
            let ddate = '01/01/'+yearInput.value
            if(isDateClicked.value) {
                filterBy = 'day'
                ddate = format(new Date(dateInput.value), 'MM/dd/yyyy')
            }

            let deptParamObj = null
            if(deptInput.value>0) {
                const deptInputIndex = departmentList.value.findIndex(e => e.id === deptInput.value)
                deptParamObj = departmentList.value[deptInputIndex]
            }
                
            await attendance.fetchAttendanceDataByYear(ddate.toString(),filterBy,deptParamObj).then(() => {
                isLoading.value = false
            })
        }

        return { deptInput, departmentList, chartData, isLoading, calendar, isModalOpen, yearList, yearInput, dateInput, change, btnText, fetchData }
    },
})
</script>
