<template>
    <ion-content>
        <ion-loading v-if="isLoading"></ion-loading>
        <ion-content v-else>
            <ion-card v-if="page==1">
                <ion-card-header>Workouts</ion-card-header>
                <ion-list>
                    <ion-item button detail="true" v-for="item in workoutList" :key="item.id" @click="select(item)">
                        <ion-icon :color="getIntensity(item)" :icon="flame" slot="start"></ion-icon>
                        <ion-label>
                            <h3>{{ item.workout_name }}</h3>
                            <p>{{ item.remarks }}</p>
                        </ion-label>
                    </ion-item>
                </ion-list>
            </ion-card>
            <ion-card v-else>
                <ion-list lines="none">
                    <ion-item>
                        <ion-icon :icon="pencil" color="primary" slot="end"></ion-icon>
                        <ion-label><b>Workout:</b></ion-label>
                        <ion-input placeholder="Enter Workout Name" v-model="selectedWorkout.workout_name" :value="selectedWorkout.workout_name"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-icon :icon="pencil" color="primary" slot="end"></ion-icon>
                        <ion-label><b>Description:</b></ion-label>
                        <ion-input placeholder="Enter Description" v-model="selectedWorkout.remarks" :value="selectedWorkout.remarks"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-icon :icon="pencil" color="primary" slot="end"></ion-icon>
                        <ion-label><b>Intensity:</b></ion-label>
                        <ion-select placeholder="Set Duration" v-model="selectedWorkout.intensity">
                            <ion-select-option value="1">Light Workout</ion-select-option>
                            <ion-select-option value="2">Moderate Workout</ion-select-option>
                            <ion-select-option value="3">Heavy Workout</ion-select-option>
                          </ion-select>
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

<script>
import { IonContent, IonLoading, IonList, IonItem, IonIcon, IonInput, IonLabel, IonFab, IonFabButton, IonSelect } from '@ionic/vue'
import { defineComponent, onBeforeMount, computed, ref } from 'vue'
import { stopOutline, pencil, add, flame } from 'ionicons/icons'
import { workoutStore } from '../stores/workout'

export default defineComponent({
    components: {
        IonLoading, IonContent, IonList, IonItem, IonIcon, IonInput, IonLabel, IonFab, IonFabButton, IonSelect
    },
    setup() {
        const workout = workoutStore()
        const isLoading = ref(true)

        onBeforeMount(() => {
            isLoading.value = true
            workout.getWorkoutItemsList().then(() => {
                isLoading.value = false
            })
        })

        const workoutList = computed(() => {
            return workout.getWorkoutItems
        })

        return {
            workout, workoutList, isLoading, stopOutline, pencil, add, flame
        }
    },
    data() {
        return {
            page: 1,
            selectedWorkout: {
                id: '',
                workout_name: '',
                remarks: '',
                intensity: '',
                isNew: true
            }
        }
    },
    methods: {
        select(workout) {
            this.page = 2
            this.selectedWorkout=workout
            this.selectedWorkout.intensity = workout.intensity+""
            this.selectedWorkout.isNew = false
        },
        addNew() {
            this.page = 2
            this.selectedWorkout={
                id: '',
                workout_name: '',
                remarks: '',
                intensity: '',
                isNew: true
            }
        },
        save() {
            this.isLoading = true
            this.workout.addNewWorkout(this.selectedWorkout).then(() => {
                this.isLoading = false
                this.page = 1
            })
        },
        getIntensity(workout) {
            switch(workout.intensity) {
                case 1:
                    return 'success'
                case 2:
                    return 'warning'
                case 3:
                    return 'danger'
            }
        }
    }
})

</script>