import { defineStore } from "pinia";
import axios from 'axios'
import { navigationStore } from '../stores/navigation'

const BASE_URL = 'http://localhost/myGymServer/public/api/mobile'

export const membershipStore = defineStore('membership', {
    state: () => ({
        membershipList: [],
        newItem: null,
        isFetchingMemberships: false,
        isSavingMembership: false,
        selectedMembership: {},
    }),
    getters: {
        getmembershipList: (state) => state.membershipList,
        getNewItem() { return this.newItem },
        getIsFetchingMemberships() { return this.isFetchingMemberships },
        getIsSavingMembership() { return this.isSavingMembership },
        getSelectedMembership: (state) => state.selectedMembership
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
                const navigation = navigationStore()
                this.isSavingMembership = true;
                let formData = new FormData()
                formData.append('personID', requestData.personID)
                formData.append('itemID', requestData.itemID)
                formData.append('startDate', requestData.startDate)
                formData.append('payment', requestData.payment)
                //const response = await axios.get(BASE_URL+'/person/membership/new',formData)
                //this.newItem = response.data
                const response = await axios.post(BASE_URL+'/person/membership/new', formData)
                navigation.addFlipMembership(response.data)
              } catch (error) {
                console.error(error)
              }
        },
        async findMembership(membershipID) {
          try {
            const response = await axios.get(BASE_URL+'/membership/find/'+membershipID)
            this.selectedMembership = response.data
          } catch (error) {
            console.error(error)
          }
        }
    }
})