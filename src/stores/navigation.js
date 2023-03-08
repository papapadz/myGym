import { defineStore } from 'pinia'

export const navigationStore = defineStore('navigation', {
    state: () => ({ 
      page: ""
    }),
    getters: {
      getPage: (state) => state.page
    }
})