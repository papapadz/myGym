<template>
    <ion-grid>
      <ion-row>
        <ion-col v-for="card in cardList" :key="card.id" :size="4">
          <Card />
        </ion-col>
      </ion-row>
    </ion-grid>
</template>
  
  <script>
  import { IonGrid, IonRow, IonCol } from '@ionic/vue';
  import Card from './Card.vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'CardList',
    components: {
      Card, IonGrid, IonRow, IonCol
    },
    data() {
    return {
      cardList: [
        { id: 1, title: 'Card 1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { id: 2, title: 'Card 2', content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.' },
        { id: 3, title: 'Card 3', content: 'At vero eos et accusamus et iusto odio dignissimos ducimus.' },
        { id: 4, title: 'Card 3', content: 'At vero eos et accusamus et iusto odio dignissimos ducimus.' },
        { id: 5, title: 'Card 3', content: 'At vero eos et accusamus et iusto odio dignissimos ducimus.' },

        // add more cards as needed
      ],
    };
  },
  });
  </script>