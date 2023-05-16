import { defineStore } from 'pinia'
import axios from 'axios'

const BASE_URL = 'http://localhost/myGymServer/public/api/mobile'

export const membersStore = defineStore('members', {
    state: () => ({ 
      members: [],
      searchResults: [],
      memberships: [],
      person: {
        lastname: '',
        firstname: '',
        middlename: '',
        birthdate: null,
        gender: '',
        address_id: null,
        contact_num: '',
        card_number: null,
        category: null,
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
      getSearchResult: (state) => state.searchResults,
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
      async getAllMembers() {
        try {
          const response = await axios.get(BASE_URL+'/person/all')
          this.members = response.data
          this.searchResults = response.data
        } catch(error) {
          console.error(error)
        }
      },
      async getActiveMembers() {
        try {
          const response = await axios.get(BASE_URL+'/person/active/all')
          this.members = response.data
        } catch(error) {
          console.error(error)
        }
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
      async add() {
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

        await axios.post(BASE_URL+'/person/new',
          formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
        ).then(function(){
          this.members.push(this.person)
          console.log('SUCCESS!!');
          self.person = {
            lastname: '',
            firstname: '',
            middlename: '',
            birthdate: null,
            gender: '',
            address_id: null,
            contact_num: '',
            card_number: null,
            category: null,
            img: null
          }
        })
        .catch(function(err){
          const errorReponse = err.response.data.errors
          console.log(errorReponse)
          if(Object.prototype.hasOwnProperty.call(errorReponse, 'lastname')) {
            self.errors.lastname = errorReponse.lastname
          }
        });
      },
      find(searchVal) {
        const query = searchVal.toLowerCase();
        this.searchResults = this.members.filter(d => d.lastname.toLowerCase().includes(query) || d.firstname.toLowerCase().includes(query))
      },
    }
})