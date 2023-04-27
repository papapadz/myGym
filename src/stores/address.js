import { defineStore } from 'pinia'
import axios from 'axios'
const BASE_URL = 'http://localhost/myGymServer/public/api/address'
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
      getRegions() {
        const self = this
        axios.get(BASE_URL+'/regions')
          .then(function(response) {
            self.regions = response.data
        })
      },
      getProvinces(region_id) {
        const self = this
        axios.get(BASE_URL+'/provinces/'+region_id)
          .then(function(response) {
            self.provinces = response.data
        })
      },
      getCities(province_id) {
        const self = this
        axios.get(BASE_URL+'/cities/'+province_id)
          .then(function(response) {
            self.cities = response.data
        })
      },
      getBarangays(city_id) {
        const self = this
        axios.get(BASE_URL+'/barangays/'+city_id)
          .then(function(response) {
            self.barangays = response.data
        })
      },
    }
})