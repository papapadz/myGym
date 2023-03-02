<template>
    <ion-grid>
      <ion-row>
        <ion-col v-for="card in cardList" :key="card.id" :size="4">
          <Card :data="card" @click="viewCard(card.id)"/>
        </ion-col>
        <ion-col>
          <div>
            asdasd
          </div>
        </ion-col>
      </ion-row>
      <ion-content>
        <ion-modal :is-open="isOpen">
          <ion-header>
            <ion-toolbar>
              <ion-title>Modal</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="setOpen(false)">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <Card :data="cardSelected" />
          </ion-content>
        </ion-modal>
      </ion-content>
    </ion-grid>
</template>
  
  <script>
  import { IonGrid, IonRow, IonCol, IonContent, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/vue';
  import Card from './Card.vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'CardList',
    components: {
      Card, IonGrid, IonRow, IonCol, IonContent, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton 
    },
    data() {
      return {
        isOpen: false,
        cardSelected: null,
        cardList: [
          { id: 1, title: 'Card 1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
          { id: 2, title: 'Card 2', content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.' },
          { id: 3, title: 'Card 3', content: 'At vero eos et accusamus et iusto odio dignissimos ducimus.' },
          { id: 4, title: 'Card 4', content: 'At vero eos et accusamus et iusto odio dignissimos ducimus.' },
          { id: 5, title: 'Card 5', content: 'At vero eos et accusamus et iusto odio dignissimos ducimus.' },
          { id: 6, title: 'Card 6', content: 'At vero eos et accusamus et iusto odio dignissimos ducimus.' },
          { id: 7, title: 'Card 7', content: 'At vero eos et accusamus et iusto odio dignissimos ducimus.' },
          { id: 8, title: 'Card 8', content: 'At vero eos et accusamus et iusto odio dignissimos ducimus.' },
        ],
      };
    },
    methods: {
      viewCard(x) {
        //console.log(this.cardList.find(e => e.id == 1))
        //this.cardList.splice(this.cardList.findIndex(e => e.id == x),this.cardList.length)
        this.setOpen(true)
        this.cardSelected = this.cardList.find(e => e.id == x)
        console.log(this.cardSelected)
      },
      setOpen(val) {
        this.isOpen = val
      }
    }
  });
  </script>