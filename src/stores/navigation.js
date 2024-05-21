import { defineStore } from 'pinia'
import axios from 'axios'
import { configStore } from './_config'

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
        isExtendFormShown: false
      },
      attendanceNavigation: {
        page: 1
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
      getMembershipsNavigation: (state) => state.membershipsNavigation,
      getAttendanceNavigation: (state) => state.attendanceNavigation
    },
    actions: {
      setFlippedProfile(personID) {
        const self = this
        axios.get(`${configStore().getServerURL}/api/mobile`+'/person/profile/filter', {
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
        axios.get(`${configStore().getServerURL}/api/mobile`+'/person/attendance', {
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
          const response = axios.get(`${configStore().getServerURL}/api/mobile`+'/person/memberships',formData)
          this.flipMemberships = response.data
        } catch(error) {
          console.error(error)
        }
      },
      async setMemberAttendanceDetails(attendanceID) {
        const self = this
        this.isLoading = true
        try {
          await axios.get(`${configStore().getServerURL}/api/mobile`+'/attendance/details/'+attendanceID)
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
          await axios.get(`${configStore().getServerURL}/api/mobile`+'/attendance/timeout/'+attendanceID)
        } catch(error) {
          console.log(error)
        }
      },
      addFlipMembership(membership) {
        this.flipMemberships.push(membership)
      },
      setLoading(bool) {
        this.isLoading = bool
      }
    }
})