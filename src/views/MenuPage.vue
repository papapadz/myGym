<template>
  <ion-page>
      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Blank</ion-title>
          </ion-toolbar>
        </ion-header>
        <br><br>
        <ion-grid class="ion-padding">
          <ion-row>
            <ion-col v-for="pageItem in pages" :key="pageItem.code">
              <ion-card @click="show(pageItem)" class="list-card">
                <ion-card-content>
                  <ion-badge color="primary"><h1>{{ getStatData(pageItem.code) }}</h1></ion-badge> {{ pageItem.title }}
                </ion-card-content>
              </ion-card>  
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-card>
                <ion-card-header>{{ title }}</ion-card-header>
                <ion-card-content>
                  <div class="chart-container">
                    <canvas ref="myChart"></canvas>
                  </div>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
    </ion-content>
  </ion-page>
</template>
  
  <script>
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent, IonBadge } from '@ionic/vue';
  import { defineComponent, ref, onMounted } from 'vue';
  import { adminStore } from '../stores/admin'
  import Chart from 'chart.js/auto';

  export default defineComponent({
    name: 'MenuPage',
    components: {
        IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent, IonBadge
    },
    data() {
      return {
        title: null,
        pages: [
          {code: 1, title: 'Members'},
          {code: 2, title: 'Active Memberships'},
          {code: 3, title: 'Memberships'},
          {code: 4, title: 'Workouts'}
        ]
      }
    },
    setup() {
      const admin = adminStore()
      const isLoading = ref(false)
      
      onMounted(() => {
        isLoading.value = true
        admin.fetchStatData().then(() => isLoading.value = false)
      })

      return {
        isLoading, admin
      }
    },
    mounted() {
      this.admin.fetchStatData()

      const ctx = this.$refs.myChart.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Sales',
            data: [12, 19, 3, 5, 2, 3, 5, 2, 4, 12, 2, 15],
            borderColor: 'blue',
            fill: false,
          }]
        },
        options: {
          responsive: true
        }
      });
    },
    computed: {
      callStatData() {
        return this.admin.getStatData
      }
    },
    methods: {
      getStatData(item) {
        if(this.callStatData!==null) {
          switch(item) {
            case 1: return this.callStatData.members.length
            case 2: return this.callStatData.activeMembership.length
            case 3: return this.callStatData.memberships.length
            case 4: return this.callStatData.workouts.length
          }
        }
        return null;
      },
      show(item) {
        this.title = item.title
      }
    }
  });
  </script>

<style scoped>
.list-card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transform: scale(1.05);
  transition: all 0.3s ease-in-out;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 50vh;
}
</style>