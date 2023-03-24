import { defineStore } from 'pinia'

export const navigationStore = defineStore('navigation', {
    state: () => ({ 
      page: "",
      members: {
        isNewFormShown: false
      },
      flip: {
        data: null,
        page: 1
      }
    }),
    getters: {
      getPage: (state) => state.page,
      getMemberPageSettings: (state) => state.members,
      getFlipPage: (state) => state.flip
    }
})