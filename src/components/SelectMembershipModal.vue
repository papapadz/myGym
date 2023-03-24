<style>
.card-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

.card {
  width: 90%;
  height: 60%;
  background-color: #fff;
  background: linear-gradient(#f8f8f8, #fff);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin: 1.5rem;
}

.card .general {
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  box-sizing: border-box;
  padding: 1rem;
  padding-top: 0;
}

.card .general .more {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  font-size: 0.9em;
}
</style>
<template>
    <div class="card-container">
        <ion-grid>
            <ion-row>
                <ion-col>
                    <ion-button @click="flip">Back</ion-button>
                </ion-col>
            </ion-row>
                <ion-row>
                    <ion-col>
                        <Card :data="flipData.data" />
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <ion-card>
                            <ion-list>
                                <MembershipItemsVue v-for="mcategory in mmmm" :key="mcategory.id" :mcategory="mcategory" :data="flipData.data"/>
                            </ion-list>
                        </ion-card>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </div>
</template>
  
  <script>
    import { IonList } from '@ionic/vue';
    import { defineComponent, ref } from 'vue';
    import { membersStore } from '../stores/members';
    import { navigationStore } from '../stores/navigation';
    import axios from 'axios';
    import MembershipItemsVue from './MembershipItems.vue';
    import { closeOutline } from 'ionicons/icons';
    import Card from './Card.vue';

    export default defineComponent({
      components: { Card, MembershipItemsVue, IonList },
        setup() {
            const members = membersStore()
            const navigation = navigationStore()
            const BASE_URL = 'http://localhost/myGymServer/public/api/mobile'
            const flipData = ref(navigation.getFlipPage)

            return {
                BASE_URL,
                members,
                closeOutline,
                navigation,
                flipData
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
            flip() {
                this.navigation.$patch({
                    flip: {
                        data: {},
                        page: 1
                    }
                })
            }
        }
    });
  </script>