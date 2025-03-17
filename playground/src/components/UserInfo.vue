<template>
  <div class="user-card">
    <div class="avatar">
      <img :src="userInfo.avatarUrl" alt="User Avatar">
    </div>
    <div class="user-details">
      <h2 class="name">{{ userInfo.name }}</h2>
      <p class="position">{{ userInfo.position }}</p>
      <div class="email">
        <span class="label">Email:</span>
        <a :href="'mailto:' + userInfo.email">{{ userInfo.email }}</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const userInfo = ref({
  name: 'John Doe',
  position: 'Senior Frontend Developer',
  email: 'john.doe@example.com',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' 
})
</script>

<style scoped>
.user-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
}

.avatar {
  margin-bottom: 20px;
}

.avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #42b883;
  padding: 3px;
}

.user-details {
  color: #2c3e50;
}

.name {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.position {
  color: #42b883;
  font-size: 1.1rem;
  margin: 8px 0;
}

.email {
  margin-top: 16px;
  font-size: 0.9rem;
}

.label {
  color: #666;
  margin-right: 8px;
}

.email a {
  color: #42b883;
  text-decoration: none;
  transition: color 0.3s;
}

.email a:hover {
  color: #3aa876;
  text-decoration: underline;
}
</style>
