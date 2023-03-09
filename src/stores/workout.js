import { defineStore } from 'pinia'
import axios from 'axios'

export const workoutStore = defineStore('workout', {
    state: () => ({ 
      workoutItems: [],
      attendanceWorkouts: []
    }),
    getters: {
      getWorkoutItems: (state) => state.workout,
      getAttendanceWorkOuts: (state) => state.attendanceWorkouts,
    },
    actions: {
        getWorkoutItemsList() {
            const self = this
            axios.get('http://localhost/myGymServer/public/api/mobile/workout/items/all')
            .then(function(response) {
                self.workoutItems = response.data
            })
        },
        getAttendanceWorkOutToday(attendance_id) {
            axios.get('http://localhost/myGymServer/public/api/mobile/workout/today',{ params: {
                attendance_id: attendance_id
            }}).then(function(response) {
                self.attendanceWorkouts = response.data.work_outs
            })
        },
        getAttendanceWorkoutsList(person_id) {
            axios.get('http://localhost/myGymServer/public/api/mobile/workout/member/all',{ params: {
                person_id: person_id
            }}).then(function(response) {
                if(!Array.is(response.data.workouts,null))
                    self.attendanceWorkouts = response.data.workouts
                else
                    self.attendanceWorkouts = []
            })
          },
    }
})