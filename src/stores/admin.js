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
        userList: []
    }),
    getters: {
        getStatData: (state) => state.stat,
        getSession: (state) => state.session,
        getUserList: (state) => state.userList
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
                const response = await axios.post(BASE_URL+'/admin/get/users/'+this.session.data.id)
                this.userList = response.data
            } catch (error) {
                console.error(error)
            }
        }
    }
})