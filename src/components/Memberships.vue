<template>
    <ion-content>
        <button v-if="!hasActiveMembership" class="ion-button">Enroll</button>
    </ion-content>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'NewMember',
    props: ['member'],
    computed: {
        hasActiveMembership() {
            if(Object.is(this.member.active_membership,null))
                return false
            return true
        }
    }
})
</script>