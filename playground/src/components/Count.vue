<template>
  <div class="count-card">
    <h2 class="title">Count Component</h2>
    <div class="count-display">{{ count }}</div>
    <div class="button-group">
      <button class="btn" @click="decrease">-</button>
      <button class="btn" @click="increase">+</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

const increase = () => {
  count.value++
}

const decrease = () => {
  count.value--
}
</script>

<style scoped>
.count-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
}

.title {
  color: #2c3e50;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
}

.count-display {
  font-size: 3rem;
  font-weight: bold;
  color: #42b883;
  margin: 20px 0;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn {
  background: #42b883;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 6px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn:hover {
  background: #3aa876;
}

.btn:active {
  transform: scale(0.98);
}
</style>
