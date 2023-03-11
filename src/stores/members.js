import { defineStore } from 'pinia'
import axios from 'axios'

const BASE_URL = 'http://localhost/myGymServer/public/api/mobile'

export const membersStore = defineStore('members', {
    state: () => ({ 
      members: [],
      person: {
        lastname: '',
        firstname: '',
        middlename: '',
        birthdate: '',
        gender: '',
        address_id: '',
        contact_num: '',
        card_number: '',
        img: null
      }
    }),
    getters: {
      getMembers: (state) => state.members,
      getNewMember: (state) => state.getNewMember
    },
    actions: {
      getAllMembers() {
        const self = this
        axios.get(BASE_URL+'/person/all')
          .then(function(response) {
            self.members = response.data
        })
      },
      add() {
        let formData = new FormData();

        axios.post(BASE_URL+'/person/new',
          formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
        ).then(function(){
          console.log('SUCCESS!!');
          this.person = {
            lastname: '',
            firstname: '',
            middlename: '',
            birthdate: '',
            gender: '',
            address_id: '',
            contact_num: '',
            card_number: '',
            img: null
          }
        })
        .catch(function(){
          console.log('FAILURE!!');
        });
      }
    }
})