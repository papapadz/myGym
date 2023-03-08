import { defineStore } from 'pinia'
import axios from 'axios'

export const membersStore = defineStore('members', {
    state: () => ({ 
      members: []
    }),
    getters: {
      getMembers: (state) => state.members
    },
    actions: {
      getAllMembers() {
        const self = this
        axios.get('http://localhost/myGymServer/public/api/mobile/person/all')
          .then(function(response) {
            self.members = response.data
        })
      }
    }
})