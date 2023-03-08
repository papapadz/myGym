import { defineStore } from 'pinia'
import axios from 'axios'

export const attendanceStore = defineStore('attendance', {
    state: () => ({ 
      attendance: [],
      attendanceWorkouts: [],
    }),
    getters: {
      getAttendance: (state) => state.attendance,
      getAttendanceWorkOuts: (state) => state.attendanceWorkouts
    },
    actions: {
      getAttendanceToday() {
        const self = this
        axios.get('http://localhost/myGymServer/public/api/mobile/attendance/today')
          .then(function(response) {
            self.attendance = response.data
        })
      },
      getAttendanceWorkOutToday(attendance_id) {
        axios.get('http://localhost/myGymServer/public/api/mobile/attendance/workouts/today',{ params: {
            attendance_id: attendance_id
        }}).then(function(response) {
            self.attendanceWorkouts.push(response.data)
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