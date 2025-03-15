<template>
  <div>
    <Child />
    {{ age }}
    {{ message }}
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Child from './Child.vue'
const message = 'hello world'
const age = ref(20)
</script>

<style scoped>

</style>
