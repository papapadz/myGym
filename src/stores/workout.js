import { defineStore } from 'pinia'
import axios from 'axios'
import { navigationStore } from './navigation'
import { configStore } from './_config'

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
                const response = await axios.get(`${configStore().getServerURL}/api/mobile`+'/workout/items/all')
                this.workoutItems = response.data
            } catch (error) {
                console.error(error)
            }
        },
        getAttendanceWorkOutToday(attendance_id) {
            axios.get(`${configStore().getServerURL}/api/mobile`+'/workout/today',{ params: {
                attendance_id: attendance_id
            }}).then(function(response) {
                self.attendanceWorkouts = response.data.work_outs
            })
        },
        getAttendanceWorkoutsList(person_id) {
            axios.get(`${configStore().getServerURL}/api/mobile`+'/workout/member/all',{ params: {
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
                const response = await axios.post(`${configStore().getServerURL}/api/mobile`+'/person/workout/new',formData)
                this.newWorkout = response.data
            } catch (error) {
                console.error(error)
            }
        },
        async addNewWorkout(workout) {
            try {
              const formData = new FormData()
              formData.append('id', workout.id)
              formData.append('workout_name', workout.workout_name)
              formData.append('remarks', workout.remarks)
              formData.append('intensity', workout.intensity)
              formData.append('new', workout.isNew)
  
              const response = await axios.post(`${configStore().getServerURL}/api/mobile`+'/workout/new', formData)
              console.log(response.data)
            } catch (error) {
              console.error(error)
            } finally {
              if(workout.isNew)
                this.workoutItems.push(workout)
              else {
                const i = this.workoutItems.findIndex(d => d.id === workout.id)
                this.workoutItems[i] = workout
              }
            }
          }
    }
})