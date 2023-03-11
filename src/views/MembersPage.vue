<template>
  <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-title>Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large"></ion-title>
          </ion-toolbar>
        </ion-header>
        <NewMember v-if="navigation.getMemberPageSettings.isNewFormShown"/>
        <div v-else>
          <ion-searchbar @ionChange="searchMember($event)"></ion-searchbar>
          <CardList :dataProp="results"/>
        </div>
        <ion-fab slot="fixed" vertical="bottom" horizontal="end" class="ion-padding">
          <ion-fab-button expand="block" @click="showAddForm">
              <ion-icon :icon="peopleIcon" />
          </ion-fab-button>
      </ion-fab>
      <ion-fab>
        <ion-fab-button size="small">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="end">
          <ion-fab-button>
            <ion-icon name="document"></ion-icon>
          </ion-fab-button>
          <ion-fab-button>
            <ion-icon name="color-palette"></ion-icon>
          </ion-fab-button>
          <ion-fab-button>
            <ion-icon name="globe"></ion-icon>
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
      </ion-content>
    
  </ion-page>
</template>

<script>
import { IonHeader, IonToolbar, IonContent, IonTitle, IonPage, IonSearchbar, IonFab, IonFabButton, IonIcon, IonFabList  } from '@ionic/vue'
import { defineComponent, ref } from 'vue';
import CardList from '../components/CardList.vue';
import NewMember from '../components/NewMember.vue'
import { membersStore } from '../stores/members';
import { navigationStore } from '../stores/navigation';
import { people as peopleIcon, close as closeIcon } from 'ionicons/icons';

//import { OverlayEventDetail } from '@ionic/core/components';

export default defineComponent({
    name: 'MembersPage',
    components: {
      CardList, NewMember, IonHeader, IonToolbar, IonContent, IonTitle, IonPage, IonSearchbar, IonFab, IonFabButton, IonIcon, IonFabList
    },
    setup() {
      const navigation = navigationStore()
      const members = membersStore()
      const memberList = members.getMembers
      const results = ref(memberList)
      return {
        navigation,
        members,
        memberList,
        results,
        peopleIcon,
        closeIcon
      }
    },
    beforeMount() {
      this.navigation.$patch({
        page: "members"
      })
    },
    mounted() {
      this.members.getAllMembers();
    },
    methods: {
      searchMember(event) {
        const query = event.target.value.toLowerCase();
        this.results = this.memberList.filter(d => d.lastname.toLowerCase().includes(query) || d.firstname.toLowerCase().includes(query));
      },
      cancel() {
        //this.$refs.modal.$el.dismiss(null, 'cancel');
        this.navigation.$patch({
          members: {
            isNewFormShown: false
          }
        })
      },
      confirm() {
        const name = this.$refs.input.$el.value;
        this.$refs.modal.$el.dismiss(name, 'confirm');
      },
      showAddForm() {
        this.navigation.$patch({
          members: {
            isNewFormShown: true
          }
        })
      }
    }
});
</script>