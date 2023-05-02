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
      async getAttendanceToday() {
        try {
          const response = await axios.get(BASE_URL+'/attendance/today')
          this.attendance = response.data 
        } catch(error) {
          console.error(error)
        }
      },
      async add(cardNum) {
        try {
          await axios.get(BASE_URL+'/attendance/new',{params: {card_num: cardNum}}).then(() => {
            this.getAttendanceToday()
          })
        } catch(error) {
          console.log(error)
        }
      }
    }
})