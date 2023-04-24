<template>
<ion-list lines="none">
    <ion-item-group v-for="item in list" :key="item.id">
        <ion-item-divider>
            <ion-label>

            </ion-label>
        </ion-item-divider>
        <ion-item>
            <ion-label>
                   
            </ion-label>
        </ion-item>
    </ion-item-group>
</ion-list>
</template>

<script>
import { defineComponent } from 'vue';
import { attendanceStore } from '../stores/attendance';
import { navigationStore } from '../stores/navigation';

export default defineComponent({
    props: [
        'data'
    ],
    setup() {
        const attendance = attendanceStore()
        const navigation = navigationStore()
        const list = attendance.getAttendanceByUserID(navigation.getFlipPage.data.id)
        return { attendance, list };
    }
})
</script>