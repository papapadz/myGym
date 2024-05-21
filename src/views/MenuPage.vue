<template>
  <ion-page>
      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Blank</ion-title>
          </ion-toolbar>
        </ion-header>
        <br><br>
        <ProfilePage v-if="flipPage.page==3"/>
        <div v-else>
          <ion-loading v-if="isLoading"></ion-loading>
        <ion-grid v-else class="ion-padding">
          <ion-row>
            <ion-col v-for="pageItem in pages" :key="pageItem.code" size-md="6" size-lg="3" size-xs="12">
              <ion-card @click="show(pageItem)" class="list-card">
                <ion-card-content>
                  <ion-badge color="primary"><h1>{{ getStatData(pageItem.code) }}</h1></ion-badge> <h1>{{ pageItem.title }}</h1>
                </ion-card-content>
              </ion-card>  
            </ion-col>
          </ion-row>
          <ion-row v-if="selected.code==1">
            <ion-col>
              <AttendanceChartVue class="chart-container" />
            </ion-col>
          </ion-row>
          <ion-row v-else-if="selected.code==2">
            <ion-col>
              <AddDepartment class="chart-container" />
            </ion-col>
          </ion-row>
          <ion-row v-else-if="selected.code==3">
            <ion-col>
              <AddPosition class="chart-container" />
            </ion-col>
          </ion-row>
        </ion-grid>
        </div>
    </ion-content>
  </ion-page>
</template>
  
  <script>
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonBadge, IonLoading } from '@ionic/vue';
  import { defineComponent, ref, onMounted } from 'vue';
  import { adminStore } from '../stores/admin'
  import AttendanceChartVue from '../components/AttendanceChart.vue'
  import ProfilePage from './ProfilePage.vue'
  import { navigationStore } from '../stores/navigation';
  import AddPosition from '../components/AddPosition.vue';
  import AddDepartment from '../components/AddDepartment.vue';

  export default defineComponent({
    name: 'MenuPage',
    components: {
      AddPosition, AddDepartment, 
        IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonBadge, AttendanceChartVue, IonLoading, ProfilePage
    },
    data() {
      return {
        selected: {
          code: 1,
          title: 'Members'
        },
        pages: [
          //{code: 1, title: 'Active Memberships'},
          {code: 1, title: 'Attendees Today'},
          //{code: 3, title: 'Memberships'},
          //{code: 4, title: 'Workouts'},
          {code: 2, title: 'Departments'},
          {code: 3, title: 'Positions'},
        ]
      }
    },
    setup() {
      const admin = adminStore()
      const isLoading = ref(false)
      const navigation = navigationStore()
      const flipPage = ref(navigation.getFlipPage)

      onMounted(() => {
        isLoading.value = true
        admin.fetchStatData().then(() => {
         isLoading.value = false
        })
      })

      return {
        isLoading, admin, flipPage
      }
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
            case 2: return this.callStatData.departments.length
            case 3: return this.callStatData.positions.length
          }
        }
        return null;
      },
      show(item) {
        this.selected = item
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
  height: 70vh;
}
</style>