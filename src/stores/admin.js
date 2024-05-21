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
                    affiliations: [
                        {
                            area: {},
                            position: {}
                        }
                    ]
                }
            },
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
        getCategories: (state) => state.categories,
        getCompanyProfile() {
            return this.session.data.person.affiliations.sort((a,b) => {
                return new Date(b.start_date) - new Date(a.start_date)
            })
        }
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
        },
        async saveOptions(table,data) {
            try {
                const formData = new FormData()
                switch(table) {
                    case 'position':
                        formData.append('title',data.title)
                    break
                    case 'department':
                        formData.append('name', data.name)
                        formData.append('description', data.description)
                        formData.append('company_id', this.session.data.person.affiliations[0].area.company_id)
                    break
                }
                const response = await axios.post(`${configStore().getServerURL}/api/mobile/${table}/new`,formData)
                this.hasError = false
                this.stat[table+'s'].push(data)
                alert(response.data.message)
            } catch (error) {
                this.hasError = true
                console.error(error)
                alert(error.response.data.message)
            }
        },
    }
})