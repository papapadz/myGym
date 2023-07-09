import { defineStore } from 'pinia'
import axios from 'axios'
const BASE_URL = 'http://localhost/myGymServer/public/api/mobile'

export const attendanceStore = defineStore('attendance', {
    state: () => ({ 
      attendance: [],
      chartData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: 'Year',
            backgroundColor: '#FFB81C',
            data: []
          }
        ]
      }
    }),
    getters: {
      getAttendance: (state) => state.attendance,
      getAttendanceByUserID: () => (id) => {
        return axios.get(BASE_URL+'/attendance/list/user',{ person_id:id }).then((response) => {
          return response.data
        })
      },
      getChartData: (state) => state.chartData
    },
    actions: {
      async getAttendanceToday() {
        try {
          const response = await axios.get(BASE_URL+'/attendance/today')
          this.attendance = response.data 
        } catch(error) {
          console.error(error)
        }
      },
      async deleteAttendance(id) {
        try {
          await axios.get(BASE_URL+'/attendance/delete/'+id).then((response) => {
            this.attendance = response.data 
          })
        } catch(error) {
          console.error(error)
        }
      },
      async add(cardNum) {
        try {
          return await axios.get(BASE_URL+'/attendance/new',{params: {card_num: cardNum}}).then(() => {
            this.getAttendanceToday()
          })
        } catch(error) {
          console.log(error)
        }
      },
      async fetchAttendanceDataByYear(year) {
        try {
          const response = await axios.get(BASE_URL+'/attendance/data/'+year)
          this.chartData.datasets[0].label = 'Attendance for CY '+year
          this.chartData.datasets[0].data = response.data
          console.log(this.chartData)
        } catch(error) {
          console.log(error)
        }
      }
    }
})