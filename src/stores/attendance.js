import { defineStore } from 'pinia'
import axios from 'axios'
const BASE_URL = 'http://localhost/myGymServer/public/api/mobile'

export const attendanceStore = defineStore('attendance', {
    state: () => ({ 
      attendance: [],
    }),
    getters: {
      getAttendance: (state) => state.attendance,
      getAttendanceByUserID: () => (id) => {
        return axios.get(BASE_URL+'/attendance/list/user',{ person_id:id }).then((response) => {
          return response.data
        })
      }
    },
    actions: {
      getAttendanceToday() {
        const self = this
        axios.get(BASE_URL+'/attendance/today')
          .then(function(response) {
            self.attendance = response.data
        })
      },
      async add(cardNum) {
        const self = this
        try {
          await axios.get(BASE_URL+'/attendance/new',{ params: {
              card_num: cardNum
          }}).then(function(response) {
              self.attendance.push(response.data)
          })
        } catch(error) {
          console.log(error)
        }
      }
    }
})