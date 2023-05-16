import { defineStore } from 'pinia'
import axios from 'axios'
const BASE_URL = 'http://localhost/myGymServer/public/api/mobile'
export const navigationStore = defineStore('navigation', {
    state: () => ({ 
      page: "",
      user: {
        id: 1
      },
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
      selectedAttendanceID: null,
      membershipsNavigation: {
        page: 1,
        isAddShown: false,
        isPaymentHistoryShown: false,
        isPaymentFormShown: false,
        isClicked: false,
      }
    }),
    getters: {
      getUser: (state) => state.user,
      getPage: (state) => state.page,
      getMemberPageSettings: (state) => state.members,
      getFlipPage: (state) => state.flip,
      getFlipAttendance: (state) => state.flipAttendance,
      getFlipMemberships: (state) => state.flipMemberships,
      getFlipMembershipsById: (state) => (id) => {
        return state.flipMemberships.filter(d => d.id == id);
      },
      getIsLoading: (state) => state.isLoading,
      getMembershipsNavigation: (state) => state.membershipsNavigation
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
      async setMembership(personID) {
        try {
          const formData = new FormData()
          formData.append('personID', personID)
          const response = axios.get(BASE_URL+'/person/memberships',formData)
          this.flipMemberships = response.data
        } catch(error) {
          console.error(error)
        }
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
      },
      async timeOut(attendanceID) {
        try {
          await axios.get(BASE_URL+'/attendance/timeout/'+attendanceID)
        } catch(error) {
          console.log(error)
        }
      },
      addFlipMembership(membership) {
        this.flipMemberships.push(membership)
      }
    }
})