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
      flipMemberships: []
    }),
    getters: {
      getPage: (state) => state.page,
      getMemberPageSettings: (state) => state.members,
      getFlipPage: (state) => state.flip,
      getFlipAttendance: (state) => state.flipAttendance,
      getFlipMemberships: (state) => state.flipMemberships
    },
    actions: {
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
      }
    }
})