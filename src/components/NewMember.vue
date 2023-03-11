<template>
    <ion-content>
        <ion-content class="ion-padding">
              <ion-item>
                <ion-label position="stacked">Enter your Last Name</ion-label>
                <ion-input v-model="person.lastname" type="text" placeholder="Last Name"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Enter your First Name</ion-label>
                <ion-input v-model="person.firstname" type="text" placeholder="First Name"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Enter your Middlename</ion-label>
                <ion-input v-model="person.middlename" type="text" placeholder="Middlename (optional)"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Enter Birthday</ion-label>
                <ion-input v-model="person.birthdate" type="date" placeholder="Birthday"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Select Gender</ion-label>
                <ion-select placeholder="Select Gender" v-model="person.gender">
                  <ion-select-option value="M">Male</ion-select-option>
                  <ion-select-option value="F">Female</ion-select-option>
                </ion-select>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Select Region</ion-label>
                <ion-select placeholder="Select Region" v-model="selectedAddress.region" @ionChange="selectAddress(1)">
                  <ion-select-option v-for="item in address.getRegionList" :key="item.id" :value="item.region_id">{{ item.name }}</ion-select-option>
                </ion-select>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Select Province</ion-label>
                <ion-select placeholder="Select Province" v-model="selectedAddress.province" @ionChange="selectAddress(2)">
                  <ion-select-option v-for="item in address.getProvinceList" :key="item.id" :value="item.province_id">{{ item.name }}</ion-select-option>
                </ion-select>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Select City/Municipality</ion-label>
                <ion-select placeholder="Select City/Municipality" v-model="selectedAddress.city" @ionChange="selectAddress(3)">
                  <ion-select-option v-for="item in address.getCityList" :key="item.id" :value="item.city_id">{{ item.name }}</ion-select-option>
                </ion-select>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Select Barangay</ion-label>
                <ion-select placeholder="Select Barangay" v-model="selectedAddress.barangay" @ionChange="selectAddress(4)">
                  <ion-select-option v-for="item in address.getBarangayList" :key="item.id" :value="item.code">{{ item.name }}</ion-select-option>
                </ion-select>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Enter Contact Number</ion-label>
                <ion-input v-model="person.contact_num" type="text" placeholder="Cellphone Number"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Scan Card Number</ion-label>
                <ion-input v-model="person.card_number" type="text" placeholder="Card Number"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Upload Picture</ion-label>
                <br/>
                <input
                    @change="filesChange"
                    type="file" 
                    :name="uploadFieldName" 
                    accept="image/*"
                    >
            <br/>
              </ion-item>
            </ion-content>
          </ion-content>
</template>

<script>
import { IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption  } from '@ionic/vue'
import { defineComponent } from 'vue';
import { people as peopleIcon, close as closeIcon } from 'ionicons/icons';
import { addressStore } from '../stores/address'

export default defineComponent({
    name: 'NewMember',
    components: {
      IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonContent
    },
    setup() {
      const address = addressStore()
      return {
        address,
        peopleIcon,
        closeIcon
      }
    },
    data() {
      return {
        uploadFieldName: 'photos',
        person: {
                    lastname: '',
                    firstname: '',
                    middlename: '',
                    birthdate: '',
                    gender: '',
                    address_id: '',
                    contact_num: '',
                    card_number: '',
                    img: null
                },
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
    },
    methods: {
      cancel() {
        //this.$refs.modal.$el.dismiss(null, 'cancel');
      },
      confirm() {
        //const name = this.$refs.input.$el.value;
        //this.$refs.modal.$el.dismiss(name, 'confirm');
        console.log(this.person)
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
          case 4:
            this.selectAddress.barangay = flag
            this.person.address_id = flag
            break
        }
      },
      filesChange(event) {
        this.person.img = event.target.files[0];
      }
    }
});
</script>