import { defineStore } from "pinia";
import axios from 'axios'

const BASE_URL = 'http://localhost/myGymServer/public/api/mobile'

export const membershipStore = defineStore('membership', {
    state: () => ({
        membershipList: [],
        newItem: null,
        isFetchingMemberships: false,
        isSavingMembership: false
    }),
    getters: {
        getmembershipList: (state) => state.membershipList,
        getNewItem() { return this.newItem },
        getIsFetchingMemberships() { return this.isFetchingMemberships },
        getIsSavingMembership() { return this.isSavingMembership }
    },
    actions: {
        async fetchMemberships() {
          try {
            this.isFetchingMemberships = true;
            const response = await axios.get(BASE_URL+'/membership/categories/all')
            this.membershipList = response.data
          } catch (error) {
            console.error(error)
          } finally {
            this.isFetchingMemberships = false
          }
        },
        async enroll(requestData) {
            try {
                this.isSavingMembership = true;
                let formData = new FormData()
                formData.append('personID', requestData.personID)
                formData.append('itemID', requestData.itemID)
                //const response = await axios.get(BASE_URL+'/person/membership/new',formData)
                //this.newItem = response.data
                await axios.post(BASE_URL+'/person/membership/new', formData)
              } catch (error) {
                console.error(error)
              } finally {
                this.isSavingMembership = false
              }
        }
    }
})