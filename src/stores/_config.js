import { defineStore } from 'pinia'

export const configStore = defineStore('config', {
    state: () => ({
        serverURL: 'http://localhost/simple-attendance-server/public',
    }),
    getters: {
        getServerURL: (state) => state.serverURL,
    },
})