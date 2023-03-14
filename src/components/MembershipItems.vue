<template>
    <ion-item-sliding>
        <ion-item >
          <ion-label>
              <h3>{{ mcategory.membership_name }}</h3>
              <p>{{ mcategory.remarks }}</p>
          </ion-label>
          <ion-icon :color="options.color" :icon="setIcon" slot="end"></ion-icon>
        </ion-item>
  
        <ion-item-options>
          <ion-item-option>Favorite</ion-item-option>
          <ion-item-option color="danger">Delete</ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
</template>

<script>
    import { defineComponent } from 'vue';
    import { IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel } from '@ionic/vue';
    import { ellipseOutline, checkbox, chevronForward } from 'ionicons/icons';
    export default defineComponent({
        props: ['data','mcategory'],
        components: {
            IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel,
        },
        setup() {
            return {
                ellipseOutline,
                checkbox,
                chevronForward
            }
        },
        mounted() {
            if(!Object.is(this.data.active_membership,null)) 
                if(this.data.active_membership.id==this.mcategory.id) 
                    this.options.color = 'success'
                    
        },
        computed: {
            setIcon() {
                if(!Object.is(this.data.active_membership,null))
                    return this.checkbox
                return this.chevronForward
            }
        },
        data() {
            return {
                options: {
                    color: 'default'
                }
            }
        }
    })
</script>