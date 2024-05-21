<template>
    <AddOptionItems 
        :fields="[
            'title'
        ]"
        :object="{
            title: ''
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
const list = computed(() => admin.getStatData.positions)
const save = (data) => {
    admin.saveOptions('position',data)
}
</script>