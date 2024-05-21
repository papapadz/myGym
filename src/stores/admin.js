import { defineStore } from 'pinia'
import axios from 'axios'
import { configStore } from './_config'
import { Preferences } from '@capacitor/preferences';

export const adminStore = defineStore('admin', {
    state: () => ({
        stat: null,
        session: {
            status: 0,
            data: {
                person: {
                    firstname: 'Admin'
                }
            },
            created_at: ''
        },
        userList: [],
        hasError: false,
        responseObject: {
            status: 1
        },
        activeMembersList: [],
        categories: [],
    }),
    getters: {
        getStatData: (state) => state.stat,
        getSession: (state) => state.session,
        getUserList: (state) => state.userList,
        getHasError: (state) => state.hasError,
        getResponseObject: (state) => state.responseObject,
        getActiveMembersList: (state) => state.activeMembersList,
        getCategories: (state) => state.categories
    },
    actions: {
        async fetchStatData() {
            try {
                const response = await axios.get(`${configStore().getServerURL}/api/mobile`+'/admin/get/statistics')
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

                const response = await axios.post(`${configStore().getServerURL}/api/mobile`+'/admin/login',formData)
                this.session = response.data
                await Preferences.set({
                    key: 'session',
                    value: JSON.stringify(this.session)
                })
            } catch(error) {
                console.error(error)
            }
        },
        async fetchUsers() {
            try {
                const response = await axios.get(`${configStore().getServerURL}/api/mobile`+'/admin/get/users/'+this.session.data.id)
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

                const response = await axios.post(`${configStore().getServerURL}/api/mobile`+'/admin/save/user',formData)
                this.userList.push(response.data)
                this.hasError = false
            } catch (error) {
                this.hasError = true
                console.error(error)
            }
        },
        async deleteUser(id) {
            try {
                await axios.delete(`${configStore().getServerURL}/api/mobile`+'/admin/delete/user/'+id)
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

                const response = await axios.post(`${configStore().getServerURL}/api/mobile`+'/admin/update/user',formData)
                this.responseObject = response.data
                this.hasError = false
            } catch(error) {
                this.hasError = true
                console.error(error)
            }
         },
         async getActiveMembers() {
            try {
              const response = await axios.get(`${configStore().getServerURL}/api/mobile`+'/person/active/all')
              this.activeMembersList = response.data
            } catch(error) {
              console.error(error)
            }
        },
        async fetchCategories() {
            const response = await axios.get(`${configStore().getServerURL}/api/mobile`+'/admin/get/user/categories')
            this.categories = response.data
        }
    }
})