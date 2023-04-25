<template>
  <ion-content>
      <ion-list>
        <ion-item-group>
          <ion-item-divider>Memberships</ion-item-divider>
          <ion-item detail="true" lines="none" v-for="membershipItem in this.membershipData" :key="membershipItem.id">
            <ion-icon v-if="this.isActive(membershipItem.expiry_date)" color="primary" :icon="star" slot="start"></ion-icon>
            <ion-icon v-else color="disabled" :icon="star" slot="start"></ion-icon>
            
            <ion-label>
              <h3>{{ membershipItem.membership_category.membership_name }}</h3>
              <p>{{ membershipItem.created_at }} to {{ membershipItem.expiry_date }}</p>
            </ion-label>
          </ion-item>
        </ion-item-group>
    </ion-list>
    <ion-fab slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button color="success" id="open-modal" expand="block">
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <ion-modal ref="modal" trigger="open-modal" @willDismiss="onWillDismiss">
      <ion-content class="ion-padding">
       
          <ion-radio-group value="strawberries">
            <ion-radio value="grapes">Grapes</ion-radio><br/>
            <ion-radio value="strawberries">Strawberries</ion-radio><br />
            <ion-radio value="pineapple">Pineapple</ion-radio><br />
            <ion-radio value="cherries">Cherries</ion-radio>
          </ion-radio-group>
      </ion-content>
    </ion-modal>
  </ion-content>
</template>
  
  <script>
  import { star, add } from 'ionicons/icons';
  import { defineComponent } from 'vue';
  import moment from 'moment'

  export default defineComponent({
    props: ['membershipData'],
    data() {
      return {
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      }
    },
    setup() {
      return { star, add };
    },
    computed: {
        groups() {
            if (!this.membershipData || this.membershipData.length === 0) {
                return []
            }
            const arr = this.membershipData.map(obj => ({ id: obj.id, date: new Date(obj.created_at), object: obj }))
            console.log(arr)
            return arr.reduce((acc, curr) => {
            const year = curr.date.getFullYear()
            const month = curr.date.getMonth() + 1
            const exists = acc.find(a => a.year === year && a.month === month)
            if (exists) {
                exists.membershipData.push(curr)
            } else {
                acc.push({ year, month, membershipData: [curr] })
            }
            console.log(acc)
            return acc
            }, [])
        },
        getMembershipDetails(id) {
          return this.navigation.getFlipMembershipsById(id)
        }
    },
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = this.months[date.getMonth()]
        const day = date.getDate()
        const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        return `${month} ${day}, ${year}, ${time}`
      },
      isActive(expiry_date) {
          
          if(moment().isBefore(moment(expiry_date)))
            return true
          else
            return false
      },
      cancel() {
        this.$refs.modal.$el.dismiss(null, 'cancel');
      },
      confirm() {
        const name = this.$refs.input.$el.value;
        this.$refs.modal.$el.dismiss(name, 'confirm');
      },
      onWillDismiss(ev) {
        if (ev.detail.role === 'confirm') {
          this.message = `Hello, ${ev.detail.data}!`;
        }
      }
    }
  })
  </script>

  <style>
  .success {
    background-color: lime;
  }
  </style>
  