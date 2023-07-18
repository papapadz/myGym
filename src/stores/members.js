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
      validateInput(field) {
        switch(field) {
          case 'lastname':
            return this.errors.lastname!='' ? false : true
        }
      },
      async getCategories() {
        const self = this
        axios.get(BASE_URL+'/person/categories')
          .then(function(response) {
            self.categories = response.data
        })
      },
      async add() {

        try {
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
            )
          } catch(error) { 
            console.log(error)
          } finally {
            this.getAllMembers()
          }
      },
      find(searchVal) {
        const query = searchVal.toLowerCase();
        this.searchResults = this.members.filter(d => d.lastname.toLowerCase().includes(query) || d.firstname.toLowerCase().includes(query) || d.card_number.toLowerCase().includes(query))
      },
      async delete(id) {
        try {
          await axios.get(BASE_URL+'/person/delete/'+id)
        } catch(error) {
          console.error(error)
        } finally {
          const index = this.searchResults.findIndex(member => { return member.id === id })
          this.searchResults.splice(index, 1)

          const ii = this.members.findIndex(member => { return member.id === id })
          this.members.splice(ii, 1)
        }
      },
      async update(personObj) {
        try {
          
        const formData = new FormData();
        formData.append('personID', personObj.id)
        formData.append('lastname', personObj.lastname)
        formData.append('firstname', personObj.firstname)
        formData.append('middlename', personObj.middlename)
        formData.append('birthdate', personObj.birthdate)
        formData.append('gender', personObj.gender)
        formData.append('address_id', personObj.address_id)
        formData.append('contact_num', personObj.contact_num)
        formData.append('category_id', personObj.category_id)
        formData.append('card_number', personObj.card_number)          
        //formData.append('img_file', person.img)
        
        const respone = await axios.post(BASE_URL+'/person/update/profile',formData)
        return respone.data
        } catch(error) {
          console.error(error)
        }
      },
      async findMember(id) {
        const respone = await axios.get(BASE_URL+'/person/find/'+id)
        return respone.data
      },
      async updateImage(id, img) {
        const formData = new FormData();
        formData.append('memberID', id)
        formData.append('img_file', img)

        const respone = await axios.post(BASE_URL+'/person/image/update',
          formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
        )
        
        const index = this.members.findIndex(e => e.id===id)
        this.members[index].img.url = respone.data
        return respone.data
      }
    }
})