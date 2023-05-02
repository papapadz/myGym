import { defineStore } from 'pinia'
import axios from 'axios'
const BASE_URL = 'http://localhost/myGymServer/public/api/mobile'

export const adminStore = defineStore('admin', {
    state: () => ({
        stat: null
    }),
    getters: {
        getStatData: (state) => state.stat
    },
    actions: {
        async fetchStatData() {
            try {
                const response = await axios.get(BASE_URL+'/admin/get/statistics')
                this.stat = response.data
            } catch(error) {
                console.error(error)
            }
        }
    }
})