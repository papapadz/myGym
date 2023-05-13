<template>
    <ion-page>
        <ion-content>
            asdasdasd
            {{ membershipItem }}
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue'
import { IonContent, IonPage } from '@ionic/vue'
export default defineComponent({
    name: 'MembershipItem',
    components: {
        IonContent, IonPage
    },
    props: ['membershipItem'],
})
</script>