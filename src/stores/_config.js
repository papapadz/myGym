import { defineStore } from 'pinia'

export const configStore = defineStore('config', {
    state: () => ({
        serverURL: 'http://localhost/simple-attendance-server/public',
        positions: [],
        departments: []
    }),
    getters: {
        getServerURL: (state) => state.serverURL,
        getPositions: (state) => state.positions,
        getDepartments: (state) => state.departments
    }
})