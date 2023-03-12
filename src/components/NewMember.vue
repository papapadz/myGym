<template>
    <ion-content>
        <ion-content class="ion-padding">
              <ion-item ref="item">
                <ion-label position="floating">Enter Last Name</ion-label>
                <ion-input @ionBlur="validate" name="lastname" v-model="members.person.lastname" type="text" placeholder="Last Name"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Enter First Name</ion-label>
                <ion-input v-model="members.person.firstname" type="text" placeholder="First Name"></ion-input>
                <ion-note slot="error">{{ members.getInputErrors.firstname }}</ion-note>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Enter Middlename</ion-label>
                <ion-input v-model="members.person.middlename" type="text" placeholder="Middlename (optional)"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Enter Birthday</ion-label>
                <ion-input v-model="members.person.birthdate" type="date" placeholder="Birthday"></ion-input>
                <ion-note slot="error">{{ members.getInputErrors.birthdate }}</ion-note>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Select Gender</ion-label>
                <ion-select placeholder="Select Gender" v-model="members.person.gender">
                  <ion-select-option value="M">Male</ion-select-option>
                  <ion-select-option value="F">Female</ion-select-option>
                </ion-select>
                <ion-note slot="error">{{ members.getInputErrors.gender }}</ion-note>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Select Category</ion-label>
                <ion-select placeholder="Select Category" v-model="members.person.category">
                  <ion-select-option v-for="item in members.getMemberCategories" :key="item.id" :value="item.id">{{ item.category }}</ion-select-option>
                </ion-select>
                <ion-note slot="error">{{ members.getInputErrors.category }}</ion-note>
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
                <ion-note slot="error">{{ members.getInputErrors.address_id }}</ion-note>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Enter Contact Number</ion-label>
                <ion-input v-model="members.person.contact_num" type="text" placeholder="Cellphone Number"></ion-input>
                <ion-note slot="error">{{ members.getInputErrors.contact_num }}</ion-note>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Scan Card Number</ion-label>
                <ion-input v-model="members.person.card_number" type="text" placeholder="Card Number"></ion-input>
                <ion-note slot="error">{{ members.getInputErrors.card_number }}</ion-note>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Upload Picture</ion-label>
                <br/>
                <input
                    @change="filesChange"
                    type="file" 
                    :name="uploadFieldName" 
                    accept="image/*"
                    >
                <br/>
                <ion-note slot="error">{{ members.getInputErrors.lastname }}</ion-note>
              </ion-item>
              <ion-button color="success" expand="block" @click="confirm">Save</ion-button>
            </ion-content>
          </ion-content>
</template>

<script>
import { IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonNote  } from '@ionic/vue'
import { defineComponent } from 'vue';
import { people as peopleIcon, close as closeIcon } from 'ionicons/icons';
import { addressStore } from '../stores/address'
import { membersStore } from '../stores/members';

export default defineComponent({
    name: 'NewMember',
    components: {
      IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonContent, IonNote
    },
    setup() {
      const address = addressStore()
      const members = membersStore()
      return {
        address,
        members,
        peopleIcon,
        closeIcon
      }
    },
    data() {
      return {
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
        //this.$refs.modal.$el.dismiss(null, 'cancel');
      },
      confirm() {
        //const name = this.$refs.input.$el.value;
        //this.$refs.modal.$el.dismiss(name, 'confirm');
        console.log(this.person)
        this.members.add()
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
      }
    }
});
</script>