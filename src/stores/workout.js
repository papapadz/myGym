import { defineStore } from 'pinia'
import axios from 'axios'
import { navigationStore } from './navigation'

const BASE_URL = 'http://localhost/myGymServer/public/api/mobile'

export const workoutStore = defineStore('workout', {
    state: () => ({ 
      workoutItems: null,
      attendanceWorkouts: [],
      newWorkout: null
    }),
    getters: {
      getWorkoutItems: (state) => state.workoutItems,
      getAttendanceWorkOuts: (state) => state.attendanceWorkouts,
      getNewAttendanceWorkout: (state) => state.newWorkout
    },
    actions: {
        async getWorkoutItemsList() {
            try {
                const response = await axios.get(BASE_URL+'/workout/items/all')
                this.workoutItems = response.data
            } catch (error) {
                console.error(error)
            }
        },
        getAttendanceWorkOutToday(attendance_id) {
            axios.get(BASE_URL+'/workout/today',{ params: {
                attendance_id: attendance_id
            }}).then(function(response) {
                self.attendanceWorkouts = response.data.work_outs
            })
        },
        getAttendanceWorkoutsList(person_id) {
            axios.get(BASE_URL+'/workout/member/all',{ params: {
                person_id: person_id
            }}).then(function(response) {
                if(!Array.is(response.data.workouts,null))
                    self.attendanceWorkouts = response.data.workouts
                else
                    self.attendanceWorkouts = []
            })
          },
          async setNewAttendanceWorkout(requestData) {
            const navigation = navigationStore()
            try {
                let formData = new FormData()
                formData.append('attendanceID', requestData.attendanceID)
                formData.append('workoutID', requestData.workoutID)
                formData.append('note',requestData.note)
                formData.append('userID',navigation.getUser.id)
                const response = await axios.post(BASE_URL+'/person/workout/new',formData)
                this.newWorkout = response.data
            } catch (error) {
                console.error(error)
            }
        },
    }
})