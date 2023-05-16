<template>
    <ion-grid :fixed="true">
      <ion-loading v-if="isLoading"></ion-loading>
      <ion-row v-else>
        <ion-col v-for="item in members" :key="item.id" size="12" size-md="6" size-lg="3">
          <Card :cardData="item" />
        </ion-col>
      </ion-row>
    </ion-grid>
</template>
  
  <script>
  import { IonGrid, IonRow, IonCol, IonLoading } from '@ionic/vue';
  import { defineComponent, ref, onBeforeMount, computed } from 'vue';  
  import { membersStore } from '../stores/members';
  import Card from '../components/Card.vue'

  export default defineComponent({
    name: 'CardList',
    components: {
      IonGrid, IonRow, IonCol, Card, IonLoading
    },
    setup() {
      const member = membersStore()
      const isLoading = ref(true)

      onBeforeMount(() => {
        isLoading.value = true
        member.getActiveMembers().then(() => {
          isLoading.value = false
        })
      })

      const members = computed(() => { return member.getMembers })

      return {
        members, isLoading
      }
    }
  })
  </script>

<style scoped>
.card-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
</style>