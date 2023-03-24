<template>
    <ion-grid>
      <ion-row>
        <ion-col v-for="card in dataProp" :key="card.id" size="12" size-md="6" size-lg="4">
          <CardProfile :data="card" />
        </ion-col>
      </ion-row>
    </ion-grid>
</template>
  
  <script>
  import { IonGrid, IonRow, IonCol} from '@ionic/vue';
  import CardProfile from '@/components/CardProfile'
  import { defineComponent } from 'vue';  
  import { navigationStore } from '../stores/navigation';
  import { workoutStore } from '../stores/workout';
  import { membersStore } from '../stores/members';

  export default defineComponent({
    name: 'CardList',
    components: {
      CardProfile, IonGrid, IonRow, IonCol
    },
    props: [
      'dataProp'
    ],
    setup() {
      const navigation = navigationStore()
      const workout = workoutStore()
      const members = membersStore()
      const membersList = members.getMembers
      return {
        navigation,
        workout,
        membersList
      }
    },
    data() {
      return {
        dataList: [],
        isOpen: false,
        cardSelected: null
      };
    },
    methods: {
      viewCard(x) {
        console.log(x)
        this.cardSelected = this.dataProp.find(e => e.id == x)
        
        switch(this.navigation.getPage) {
          case 'members': 
          break
          case 'attendance':
            this.workout.getAttendanceWorkOutToday(x)
            this.dataList = this.workout.getAttendanceWorkOuts
          break
        }
        this.setOpen(true)
      },
      setOpen(val) {
        this.isOpen = val
      }
    }
  });
  </script>

<style>
.card-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
</style>