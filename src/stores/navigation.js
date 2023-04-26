import { defineStore } from 'pinia'
import axios from 'axios'
const BASE_URL = 'http://localhost/myGymServer/public/api/mobile'
export const navigationStore = defineStore('navigation', {
    state: () => ({ 
      page: "",
      members: {
        isNewFormShown: false
      },
      flip: {
        data: null,
        page: 1,
      },
      flipAttendance: [],
      flipMemberships: [],
      isLoading: false,
      selectedAttendanceID: null
    }),
    getters: {
      getPage: (state) => state.page,
      getMemberPageSettings: (state) => state.members,
      getFlipPage: (state) => state.flip,
      getFlipAttendance: (state) => state.flipAttendance,
      getFlipMemberships: (state) => state.flipMemberships,
      getFlipMembershipsById: (state) => (id) => {
        return state.flipMemberships.filter(d => d.id == id);
      },
      getIsLoading: (state) => state.isLoading
    },
    actions: {
      setFlippedProfile(personID) {
        const self = this
        axios.get(BASE_URL+'/person/profile/filter', {
          params: {
            personID: personID
          }
        })
        .then(function(response) {
          
          self.flipAttendance = response.data.attendance
          self.flipMemberships = response.data.memberships
        })
      },
      setAttendance(personID) {
        const self = this
        axios.get(BASE_URL+'/person/attendance', {
          params: {
            personID: personID
          }
        })
        .then(function(response) {
          self.flipAttendance = response.data
        })
      },
      setMembership(personID) {
        const self = this
        axios.get(BASE_URL+'/person/memberships', {
          params: {
            personID: personID
          }
        })
        .then(function(response) {
          self.flipMemberships = response.data
        })
      },
      async setMemberAttendanceDetails(attendanceID) {
        const self = this
        this.isLoading = true
        try {
          await axios.get(BASE_URL+'/attendance/details/'+attendanceID)
          .then(function(response) {
            self.flipAttendance = response.data
          })
        } catch(error) {
          console.log(error)
        } finally {
          this.isLoading = false
        }
      }
    }
})