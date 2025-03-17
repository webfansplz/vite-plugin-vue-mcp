<template>
  <div class="container">
    <UserInfo />
    <Count />
  </div>
</template>

<script setup lang="ts">
import UserInfo from '../components/UserInfo.vue'
import Count from '../components/Count.vue'
</script>

<style scoped>
.container {
  width: 98vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 50px;
}
</style>
