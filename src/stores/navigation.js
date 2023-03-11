import { defineStore } from 'pinia'

export const navigationStore = defineStore('navigation', {
    state: () => ({ 
      page: "",
      members: {
        isNewFormShown: false
      }
    }),
    getters: {
      getPage: (state) => state.page,
      getMemberPageSettings: (state) => state.members
    }
})