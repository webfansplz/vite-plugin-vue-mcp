<template>
  <div>
    {{ count }}
    {{ doubleCount }}
    {{ info.name }}
    {{ info.age }}
    {{ info.address }}
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
const count = ref(10)
const doubleCount = computed(() => count.value * 2)
const info = reactive({
  name: 'John',
  age: 20,
  address: '123 Main St',
})
</script>

<style scoped>

</style>
