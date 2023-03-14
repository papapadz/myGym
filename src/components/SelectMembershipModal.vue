<template>
        <ion-content>
            <ion-list>
                <MembershipItemsVue v-for="mcategory in mmmm" :key="mcategory.id" :mcategory="mcategory" :data="data"/>
              </ion-list>
              <ion-fab slot="fixed" vertical="bottom" horizontal="end" >
                <ion-fab-button size="small" color="danger" @click="setFlip">
                    <ion-icon :icon="closeOutline" />
                </ion-fab-button>
              </ion-fab>
        </ion-content>
  </template>
  
  <script>
    import { IonList } from '@ionic/vue';
    import { defineComponent } from 'vue';
    import { membersStore } from '../stores/members';
    import { navigationStore } from '../stores/navigation';
    import axios from 'axios';
    import MembershipItemsVue from './MembershipItems.vue';
import { closeOutline } from 'ionicons/icons';
    export default defineComponent({
        props: ['data','isEnrolled'],
      components: { MembershipItemsVue, IonList },
        setup() {
            const members = membersStore()
            const navigation = navigationStore()
            const BASE_URL = 'http://localhost/myGymServer/public/api/mobile'
            return {
                BASE_URL,
                members,
                closeOutline,
                navigation
            }
        },
        mounted() {
            const self = this
            axios.get(this.BASE_URL+'/membership/categories/all')
            .then(function(response) {
                self.mmmm =  response.data
        })
        },
        data() {
            return {
                mmmm: ['asdsa']
            }
        },
        methods: {
            setFlip() {
                this.navigation.$patch({
                    flip: {
                        page: 1
                    }
                })
            }
        }
    });
  </script>