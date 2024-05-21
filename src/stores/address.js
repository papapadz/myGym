import { defineStore } from 'pinia'
import axios from 'axios'
import { configStore } from './_config'

export const addressStore = defineStore('address', {
    state: () => ({
      regions: [],
      provinces: [],
      cities: [],
      barangays: [],
      barangay_id: ''
    }),
    getters: {
      getRegionList: (state) => state.regions,
      getProvinceList: (state) => state.provinces,
      getCityList: (state) => state.cities,
      getBarangayList: (state) => state.barangays
    },
    actions: {
      async getRegions() {
        const self = this
        await axios.get(`${configStore().getServerURL}/api/address`+'/regions')
          .then(function(response) {
            self.regions = response.data
        })
      },
      async getProvinces(region_id) {
        const self = this
        console.log(region_id)
        await axios.get(`${configStore().getServerURL}/api/address`+'/provinces')
          .then(function(response) {
            self.provinces = response.data
        })
      },
      async getCities(province_id) {
        const self = this
        await axios.get(`${configStore().getServerURL}/api/address`+'/cities/'+province_id)
          .then(function(response) {
            self.cities = response.data
        })
      },
      async getBarangays(city_id) {
        const self = this
        await axios.get(`${configStore().getServerURL}/api/address`+'/barangays/'+city_id)
          .then(function(response) {
            self.barangays = response.data
        })
      },
    }
})