<template>
    <AddOptionItems 
        :fields="[
            'name','description'
        ]"
        :object="{
            name: '',
            description: ''
        }"
        :list="list"
        @save="save"
    />
</template>

<script setup>
import { computed } from 'vue'
import { adminStore } from '../stores/admin'

import AddOptionItems from './AddOptionItems.vue'

const admin = adminStore()
const list = computed(() => admin.getStatData.departments)
const save = (data) => {
    admin.saveOptions('department',data)
}
</script>