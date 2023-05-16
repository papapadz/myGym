<template>
    <ion-content>
        <ion-loading v-if="isLoading"></ion-loading>
        <Bar v-else :data="chartData" />
    </ion-content>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from 'vue'
import { IonContent, IonLoading } from '@ionic/vue'
import { attendanceStore } from '../stores/attendance'
import { format } from 'date-fns'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
export default defineComponent({
    components: {
        IonContent, Bar, IonLoading
    },
    setup() {
        const attendance = attendanceStore()
        const isLoading = ref(false)
        onMounted(() => {
            isLoading.value = true
            attendance.fetchAttendanceDataByYear(format(new Date(),'yyyy')).then(() => {
                isLoading.value = false
            })
        })

        const chartData = computed(() => {
            return attendance.getChartData
        })

        return { chartData, isLoading }
    },
})
</script>
