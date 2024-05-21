import { defineStore } from 'pinia'
import axios from 'axios'
import { format } from 'date-fns'
import { configStore } from './_config'

export const attendanceStore = defineStore('attendance', {
    state: () => ({ 
      attendance: [],
      chartData: {
        labels: [],
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
        return axios.get(`${configStore().getServerURL}/api/mobile`+'/attendance/list/user',{ person_id:id }).then((response) => {
          return response.data
        })
      },
      getChartData: (state) => state.chartData
    },
    actions: {
      async getAttendanceToday() {
        try {
          const response = await axios.get(`${configStore().getServerURL}/api/mobile`+'/attendance/today')
          this.attendance = response.data 
        } catch(error) {
          console.error(error)
        }
      },
      async deleteAttendance(id) {
        try {
          await axios.get(`${configStore().getServerURL}/api/mobile`+'/attendance/delete/'+id).then((response) => {
            this.attendance = response.data 
          })
        } catch(error) {
          console.error(error)
        }
      },
      async add(cardNum) {
        try {
          return await axios.get(`${configStore().getServerURL}/api/mobile`+'/attendance/new',{params: {card_num: cardNum}})
        } catch(error) {
          return {
            data: {
              status: 'ERROR'
            }
          }
        }
      },
      async fetchAttendanceDataByYear(ddate,filterBy) {
        console.log(ddate)
        try {
          const response = await axios.get(`${configStore().getServerURL}/api/mobile`+'/attendance/data', {
            params: {
              date: ddate,
              flag: filterBy
            }
          })
          if(filterBy=='year') {
            this.chartData.datasets[0].label = 'Data for CY ' + format(new Date(ddate),'yyyy')
            this.chartData.labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          } else {
            this.chartData.datasets[0].label = 'Data for ' + format(new Date(ddate),'PPPP')
            this.chartData.labels = ["1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "21AM", "12NN", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM", "12MN"]
          }
          
          this.chartData.datasets[0].data = response.data
          console.log(this.chartData)
        } catch(error) {
          console.log(error)
        }
      }
    }
})