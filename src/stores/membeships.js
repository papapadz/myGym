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
            const response = await axios.get(BASE_URL+'/membership/categories/all')
            this.membershipList = response.data
          } catch (error) {
            console.error(error)
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
                formData.append('remarks', requestData.remarks)

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
            return response.data
          } catch (error) {
            console.error(error)
          }
        },
        async pay(requestData) {
          try {
            const formData = new FormData()
            formData.append('membershipID', requestData.membershipID)
            formData.append('payment', requestData.amount)
            formData.append('remarks', requestData.remarks)
            formData.append('isPayment', (requestData.isPayment ? 1 : 0))

            const response = await axios.post(BASE_URL+'/membership/pay',formData)

            console.log(response.data)
          } catch (error) {
            console.error(error)
          }
        },
        async cancel(membershipID) {
          try {
            const response = await axios.get(BASE_URL+'/membership/cancel/'+membershipID)
            return response.data
          } catch(error) {
            console.error(error)
          } 
        },
        async newMembershipCategory(membership) {
          console.log(membership)
          try {
            const formData = new FormData()
            formData.append('id', membership.id)
            formData.append('membership_name', membership.membership_name)
            formData.append('remarks', membership.remarks)
            formData.append('amount', membership.amount)
            formData.append('duration', membership.duration)
            formData.append('new', membership.isNew)

            const response = await axios.post(BASE_URL+'/membership/category/new', formData)
            console.log(response.data)
          } catch (error) {
            console.error(error)
          } finally {
            if(membership.isNew)
              this.membershipList.push(membership)
            else {
              const i = this.membershipList.findIndex(d => d.id === membership.id)
              this.membershipList[i] = membership
            }
          }
        },
        async extend(extensionObject) {
          try {
            const formData = new FormData()
            formData.append('id', extensionObject.membershipID)
            formData.append('value', extensionObject.value)
            formData.append('duration', extensionObject.duration)
            const response = await axios.post(BASE_URL+'/membership/extend',formData) 
            return response.data
          } catch(error) {
            console.error(error)
          }
        }
    }
})