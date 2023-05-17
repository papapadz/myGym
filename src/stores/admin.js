import { defineStore } from 'pinia'
import axios from 'axios'
const BASE_URL = 'http://localhost/myGymServer/public/api/mobile'

export const adminStore = defineStore('admin', {
    state: () => ({
        stat: null,
        session: {
            status: 0,
            data: {
                person: {
                    firstname: 'Admin'
                }
            }
        },
        userList: [],
        hasError: false,
        responseObject: {
            status: 1
        },
        activeMembersList: []
    }),
    getters: {
        getStatData: (state) => state.stat,
        getSession: (state) => state.session,
        getUserList: (state) => state.userList,
        getHasError: (state) => state.hasError,
        getResponseObject: (state) => state.responseObject,
        getActiveMembersList: (state) => state.activeMembersList
    },
    actions: {
        async fetchStatData() {
            try {
                const response = await axios.get(BASE_URL+'/admin/get/statistics')
                this.stat = response.data
            } catch(error) {
                console.error(error)
            }
        },
        async login(credentials) {
            try {
                const formData = new FormData()
                formData.append('email',credentials.email)
                formData.append('password',credentials.password)

                const response = await axios.post(BASE_URL+'/admin/login',formData)
                this.session = response.data
            } catch(error) {
                console.error(error)
            }
        },
        async fetchUsers() {
            try {
                const response = await axios.get(BASE_URL+'/admin/get/users/'+this.session.data.id)
                this.userList = response.data
            } catch (error) {
                console.error(error)
            }
        },
        async saveUser(user) {
            try {
                const formData = new FormData()
                formData.append('lastname',user.lastname)
                formData.append('firstname',user.firstname)
                formData.append('birthdate',user.birthdate)
                formData.append('gender',user.gender)
                formData.append('phone',user.phone)
                formData.append('email',user.email)
                formData.append('password',user.password)

                const response = await axios.post(BASE_URL+'/admin/save/user',formData)
                this.userList.push(response.data)
                this.hasError = false
            } catch (error) {
                this.hasError = true
                console.error(error)
            }
        },
        async deleteUser(id) {
            try {
                await axios.delete(BASE_URL+'/admin/delete/user/'+id)
            } catch(error) {
                console.error(error)
            } finally {
                this.userList = this.userList.filter(user => user.id!== id)
            }
        },
         async updateUser(user, password) {
            try {
                const formData = new FormData()
                formData.append('id',user.id)
                formData.append('lastname',user.lastname)
                formData.append('firstname',user.firstname)
                formData.append('birthdate',user.birthdate)
                formData.append('gender',user.gender)
                formData.append('phone',user.phone)
                formData.append('email',user.email)
                formData.append('password',password.old)
                formData.append('newPassword',password.new)

                const response = await axios.post(BASE_URL+'/admin/update/user',formData)
                this.responseObject = response.data
                this.hasError = false
            } catch(error) {
                this.hasError = true
                console.error(error)
            }
         },
         async getActiveMembers() {
            try {
              const response = await axios.get(BASE_URL+'/person/active/all')
              this.activeMembersList = response.data
            } catch(error) {
              console.error(error)
            }
          },
    }
})