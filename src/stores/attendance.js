import { defineStore } from 'pinia'
import axios from 'axios'

export const attendanceStore = defineStore('attendance', {
    state: () => ({ 
      attendance: [],
    }),
    getters: {
      getAttendance: (state) => state.attendance
    },
    actions: {
      getAttendanceToday() {
        const self = this
        axios.get('http://localhost/myGymServer/public/api/mobile/attendance/today')
          .then(function(response) {
            self.attendance = response.data
        })
      },
      add(cardNum) {
        const self = this
        axios.get('http://localhost/myGymServer/public/api/mobile/attendance/new',{ params: {
            card_num: cardNum
        }}).then(function(response) {
            self.attendance.push(response.data)
        })
      }
    }
})