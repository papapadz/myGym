<template>
    <ion-content>
        <ion-loading v-if="isLoading"></ion-loading>
        <ion-content v-else>
            <ion-card v-if="page==1">
                <ion-card-header>Positions</ion-card-header>
                <ion-list>
                    <ion-item button detail="true" v-for="item in itemsList" :key="item.id" @click="select(item)">
                        <ion-label>
                            <h3>{{ item[fields[0]] }}</h3>
                            <p v-if="fields.length>1">
                                {{ item[fields[1]] }}
                            </p>
                        </ion-label>
                    </ion-item>
                </ion-list>
            </ion-card>
            <ion-card v-else>
                <ion-list lines="none">
                    <ion-item v-for="field, i in props.fields" :key="i">
                        <ion-icon :icon="pencil" color="primary" slot="end"></ion-icon>
                        <ion-label><b>{{ field.toUpperCase() }}</b></ion-label>
                        <ion-input :placeholder="'Enter '+field.toUpperCase()" v-model="selectedItem[field]" :value="selectedItem[field]"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-button color="success" @click="save">Save</ion-button>
                        <ion-button color="danger" @click="page--">Cancel</ion-button>
                    </ion-item>
                </ion-list>
            </ion-card>
            <ion-fab v-if="page==1" slot="fixed" vertical="top" horizontal="end">
                <ion-fab-button color="success" @click="addNew">
                  <ion-icon :icon="add"></ion-icon>
                </ion-fab-button>
              </ion-fab>
        </ion-content>
    </ion-content>
</template>

<script setup>
import { IonContent, IonLoading, IonList, IonItem, IonIcon, IonInput, IonLabel, IonFab, IonFabButton, IonButton, IonCard, IonCardHeader, alertController } from '@ionic/vue'
import { computed, reactive, ref } from 'vue'
import { pencil, add } from 'ionicons/icons'

const props = defineProps({
    fields: Array,
    list: Array,
    object: Object
})

const emits = defineEmits(['save'])

const isLoading = ref(false)
const page = ref(1)
const selectedItem = reactive(props.object)

const itemsList = computed(() => props.list)

function select(item) {
    page.value = 2
    selectedItem.value = item.value
    //selectedItem.value.isNew = false
}

function addNew() {
    page.value = 2
    selectedItem.value = props.object
    //selectedItem.value.isNew = true
}

async function save() {
    //isLoading.value = true
            // this.workout.addNewWorkout(this.selectedWorkout).then(() => {
            //     this.isLoading = false
            //     this.page = 1
            // })
    for(const i in props.fields) {
        if(selectedItem[props.fields[i]].length == 0) {
            alert('Please fill up all fields')
            return
        }
    }
    const presentAlert = await alertController.create({
        header: 'Save Changes?',
        message: 'Are you sure you want to save this data?',
        buttons: [
            {
                text: 'Yes',
                role: 'confirm',
                handler: () => {
                    emits('save',selectedItem)
                    page.value = 1
                }
            },
            {
                text: 'No',
                role: 'cancel'
            }
        ]
    })
    await presentAlert.present();
}
</script>