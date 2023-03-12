import { defineStore } from 'pinia'
import axios from 'axios'
import { navigationStore } from './navigation'

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
        category: '',
        img: null
      },
      errors: {
        lastname: [],
        firstname: '',
        middlename: '',
        birthdate: '',
        gender: '',
        address_id: '',
        contact_num: '',
        card_number: '',
        category: '',
        img: ''
      },
      categories: []
    }),
    getters: {
      getMembers: (state) => state.members,
      getNewMember: (state) => state.getNewMember,
      getMemberCategories: (state) => state.categories,
      getInputErrors: (state) => state.errors,
      getErrorMessage() {
        if(this.getInputErrors.lastname.size>0)
          return this.getInputErrors.lastname[0]
        else
          return ''
      }
    },
    actions: {
      getAllMembers() {
        const self = this
        axios.get(BASE_URL+'/person/all')
          .then(function(response) {
            self.members = response.data
        })
      },
      validateInput(field) {
        switch(field) {
          case 'lastname':
            return this.errors.lastname!='' ? false : true
        }
      },
      getCategories() {
        const self = this
        axios.get(BASE_URL+'/person/categories')
          .then(function(response) {
            self.categories = response.data
        })
      },
      add() {
        const self = this
        let formData = new FormData();
        formData.append('lastname', this.person.lastname)
        formData.append('firstname', this.person.firstname)
        formData.append('middlename', this.person.middlename)
        formData.append('birthdate', this.person.birthdate)
        formData.append('gender', this.person.gender)
        formData.append('address_id', this.person.address_id)
        formData.append('contact_num', this.person.contact_num)
        formData.append('category_id', this.person.category)
        formData.append('card_number', this.person.card_number)
        formData.append('img_file', this.person.img)

        axios.post(BASE_URL+'/person/new',
          formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
        ).then(function(){
          const navigation = navigationStore()
        
          console.log('SUCCESS!!');
          self.person = {
            lastname: '',
            firstname: '',
            middlename: '',
            birthdate: '',
            gender: '',
            address_id: '',
            contact_num: '',
            card_number: '',
            category: '',
            img: null
          }
          navigation.$patch({
            members: {
              isNewFormShown: false
            }
          })
        })
        .catch(function(err){
          const errorReponse = err.response.data.errors
          console.log(errorReponse)
          if(Object.prototype.hasOwnProperty.call(errorReponse, 'lastname')) {
            self.errors.lastname = errorReponse.lastname
          }
        });
      }
    }
})