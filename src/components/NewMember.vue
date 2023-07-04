<template>
  <ion-content class="ion-padding">
    <ion-loading v-if="loading" message="Saving please wait"> </ion-loading>
    <div v-else>
      <ion-card v-if="page==1">
        <ion-item>
          <ion-label class="large">Personal Information</ion-label>
        </ion-item>
        <ion-item ref="item">
          <ion-label position="floating">Enter Last Name</ion-label>
          <ion-input @ionBlur="validate" name="lastname" v-model="members.person.lastname" type="text" placeholder="Last Name"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Enter First Name</ion-label>
          <ion-input v-model="members.person.firstname" type="text" placeholder="First Name"></ion-input>
          <ion-note :v-slot="error">{{ members.getInputErrors.firstname }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Enter Middlename</ion-label>
          <ion-input v-model="members.person.middlename" type="text" placeholder="Middlename (optional)"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Enter Birthday</ion-label>
          <ion-input v-model="members.person.birthdate" type="date" placeholder="Birthday"></ion-input>
          <ion-note :v-slot="error">{{ members.getInputErrors.birthdate }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Select Gender</ion-label>
          <ion-select placeholder="Select Gender" v-model="members.person.gender">
            <ion-select-option value="M">Male</ion-select-option>
            <ion-select-option value="F">Female</ion-select-option>
          </ion-select>
          <ion-note :v-slot="error">{{ members.getInputErrors.gender }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Enter Contact Number</ion-label>
          <ion-input maxlength="11" v-model="members.person.contact_num" type="text" placeholder="Cellphone Number"></ion-input>
          <ion-note :v-slot="error">{{ members.getInputErrors.contact_num }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Select Category</ion-label>
          <ion-select placeholder="Select Category" v-model="members.person.category">
            <ion-select-option v-for="item in members.getMemberCategories" :key="item.id" :value="item.id">{{ item.category }}</ion-select-option>
          </ion-select>
          <ion-note :v-slot="error">{{ members.getInputErrors.category }}</ion-note>
        </ion-item>
      </ion-card>
      <ion-card v-if="page==2">
        <ion-item>
          <ion-label class="large">Address</ion-label>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Select Region</ion-label>
          <ion-select placeholder="Select Region" v-model="selectedAddress.region" @ionChange="selectAddress(1)">
            <ion-select-option v-for="item in address.getRegionList" :key="item.id" :value="item.region_id">{{ item.name }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Select Province</ion-label>
          <ion-select placeholder="Select Province" v-model="selectedAddress.province" @ionChange="selectAddress(2)">
            <ion-select-option v-for="item in address.getProvinceList" :key="item.id" :value="item.province_id">{{ item.name }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Select City/Municipality</ion-label>
          <ion-select placeholder="Select City/Municipality" v-model="selectedAddress.city" @ionChange="selectAddress(3)">
            <ion-select-option v-for="item in address.getCityList" :key="item.id" :value="item.city_id">{{ item.name }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Select Barangay</ion-label>
          <ion-select placeholder="Select Barangay" v-model="members.person.address_id" @ionChange="selectAddress(4)">
            <ion-select-option v-for="item in address.getBarangayList" :key="item.id" :value="item.code">{{ item.name }}</ion-select-option>
          </ion-select>
          <ion-note :v-slot="error">{{ members.getInputErrors.address_id }}</ion-note>
        </ion-item>
      </ion-card>
      <ion-card v-if="page==3">
        <ion-item>
          <ion-label class="large">Card Details</ion-label>
        </ion-item>
        <ion-card-content>
          <ion-label position="floating">Scan Card Number</ion-label>
          <ion-input class="large" v-model="members.person.card_number" type="text" placeholder="Card Number"></ion-input>
          <ion-note :v-slot="error">{{ members.getInputErrors.card_number }}</ion-note>
        </ion-card-content>
      </ion-card>
      <ion-card v-if="page==4" lines="none">
        <ion-item>
          <ion-label class="large">Member's Picture</ion-label>
        </ion-item>
            <ion-item>
              <input
              @change="filesChange"
              type="file" 
              :name="uploadFieldName" 
              accept="image/*"
              >
            <ion-note :v-slot="error">{{ members.getInputErrors.picture }}</ion-note>
            </ion-item>
      </ion-card>
      <ion-button v-if="page>1" color="warning" @click="page--"><ion-icon :icon="arrowBack"></ion-icon> Back</ion-button>
      <ion-button v-if="page<4" color="primary" @click="next">Next <ion-icon :icon="arrowForward"></ion-icon></ion-button>
      <ion-button v-if="page==4" color="success" @click="confirm">Save</ion-button>
      <ion-button color="danger" @click="cancel">Cancel</ion-button>
    </div>        
  </ion-content>
</template>

<script>
import { IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonNote, IonButton, IonIcon, IonCard, IonCardContent, IonLoading } from '@ionic/vue'
import { defineComponent, ref } from 'vue';
import { people as peopleIcon, close as closeIcon, arrowBack, arrowForward } from 'ionicons/icons';
import { addressStore } from '../stores/address'
import { membersStore } from '../stores/members';
import { navigationStore } from '../stores/navigation';

export default defineComponent({
    name: 'NewMember',
    components: {
      IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonContent, IonNote, IonButton, IonIcon, IonCard, IonCardContent, IonLoading
    },
    setup() {
      const address = addressStore()
      const members = membersStore()
      const navigation = navigationStore()
      const loading = ref(false)
      
      return {
        address,
        members,
        peopleIcon,
        closeIcon,
        navigation,
        loading,
        arrowBack,
        arrowForward
      }
    },
    data() {
      return {
        page: 1,
        uploadFieldName: 'photos',
        selectedAddress: {
          region: '',
          province: '',
          city: '',
          barangay: ''
        }
      }
    },
    mounted() {
      this.address.getRegions()
      this.members.getCategories()
    },
    methods: {
      cancel() {
        this.members.$patch({
          person: {
            lastname: '',
            firstname: '',
            middlename: '',
            birthdate: null,
            gender: '',
            address_id: null,
            contact_num: '',
            card_number: null,
            category: null,
            img: null
          }
        })
        this.navigation.$patch({
            members: {
              isNewFormShown: false
            }
          })
      },
      async confirm() {
        if(this.members.person.img==null)
              alert('Please upload an image')
        else {
            this.loading = true
            await this.members.add().then(() => {
              alert('Member has successfully been added!')
              this.loading = false
              this.cancel()
            })
        }
      },
      selectAddress(flag) {
        switch(flag) {
          case 1:
            this.address.getProvinces(this.selectedAddress.region)
            this.selectAddress.province = ''
            this.selectAddress.city = ''
            this.selectAddress.barangay = ''
            break
          case 2:
            this.address.getCities(this.selectedAddress.province)
            this.selectAddress.city = ''
            this.selectAddress.barangay = ''
            break
          case 3:
            this.address.getBarangays(this.selectedAddress.city)
            break
        }
      },
      filesChange(event) {
        this.members.person.img = event.target.files[0];
      },
      validate(event) {
        console.log(event.target.name)
        if(this.members.validateInput(event.target.name))
          this.$refs.item.$el.classList.add('ion-valid')
        else
          this.$refs.item.$el.classList.add('ion-invalid')
      },
      next() {
        switch(this.page) {
          case 1: 
            if(!this.members.person.lastname.length>0)
              alert('Last Name is required')
            else if(!this.members.person.firstname.length>0)
              alert('First Name is required')
            else if(this.members.person.birthdate==null)
              alert('Birthdate is required')
            else if(!this.members.person.gender.length>0)
              alert('Gender is required')
            else if(this.members.person.contact_num.length<11)
              alert('Contact Number is required')
            else if(this.members.person.category==null)
              alert('Please select a category')
            else
              this.page++
            break
          case 2: 
            if(this.members.person.address_id==null)
              alert('Address is required')
            else
              this.page++
            break
          case 3: 
            if(this.members.person.card_number==null)
              alert('Please Scan Card on the reader')
            else
              this.page++
            break
        }
      }
    }
});
</script>

<style scoped>
.large {
  font-size: 32px;
}
</style>