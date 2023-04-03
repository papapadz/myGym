<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>
            Profile Page
          </ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div class="profile">
          <div class="profile-banner" style="background-image: url('https://via.placeholder.com/600x200');">
            <img class="profile-image" src="https://via.placeholder.com/150" alt="Profile Image" />
            <h2 class="profile-name">{{ user.name }}</h2>
            <p class="profile-status">{{ user.status }}</p>
          </div>
          <div class="profile-info">
            <p><strong>Location:</strong> {{ user.location }}</p>
            <p><strong>Birthday:</strong> {{ user.birthday }}</p>
          </div>
          <div class="profile-timeline">
            <div class="timeline-post">
              <img class="timeline-image" src="https://via.placeholder.com/400x300" alt="Post Image" />
              <p class="timeline-text">{{ user.timeline[0].text }}</p>
            </div>
          </div>
        </div>
      </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
    data() {
        return {
            user: {
                name: '',
                location: '',
                birthday: '',
                timeline: [
                    {
                        text: ''
                    }
                ]
            }
        }
    }
})
</script>

<style>
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.profile-banner {
  position: relative;
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 5px solid white;
  position: absolute;
  bottom: -75px;
}

.profile-name {
  color: white;
  margin-top: 1rem;
  font-size: 2rem;
}

.profile-status {
  color: white;
  margin-top: 0.5rem;
  font-size: 1.2rem;
}

.profile-info {
  width: 100%;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.profile-timeline {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.timeline-post {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.timeline-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  margin-bottom: 1rem;
}

.timeline-text {
  width: 100%;
  text-align: center;
  font-size: 1.2rem;
}
</style>