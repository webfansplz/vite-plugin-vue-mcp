<template>
  <div class="home">
    <h1>{{ title }}</h1>
    
    <div class="welcome-section">
      <div class="hero">
        <h2>Welcome to Our Platform</h2>
        <p>Discover amazing features and boost your productivity</p>
      </div>
      <div class="stats">
        <div class="stat-card">
          <h3>Visitors</h3>
          <p>{{ visitorCount }}</p>
          <button @click="incrementVisitors" class="btn-primary">Add Visitor</button>
        </div>
      </div>
    </div>

    <div class="user-info">
      <h2>Profile Information</h2>
      <div class="form-group">
        <label>Username</label>
        <input v-model="userInfo.name" placeholder="Enter username">
      </div>
      <div class="form-group">
        <label>Age</label>
        <input v-model.number="userInfo.age" type="number" placeholder="Enter age">
      </div>
      <div class="info-display">
        <p><strong>Username:</strong> {{ userInfo.name || 'Not set' }}</p>
        <p><strong>Age:</strong> {{ userInfo.age || 'Not set' }}</p>
        <p><strong>Status:</strong> {{ isAdult ? 'Adult' : 'Minor' }}</p>
      </div>
    </div>

    <div class="todo-section">
      <h2>Task Manager</h2>
      <div class="todo-input">
        <input 
          v-model="newTodo" 
          @keyup.enter="addTodo" 
          placeholder="Add new task"
          class="task-input"
        >
        <button @click="addTodo" class="btn-primary">Add Task</button>
      </div>
      <ul class="todo-list">
        <li v-for="todo in todos" :key="todo.id" class="todo-item">
          <label class="checkbox-container">
            <input type="checkbox" v-model="todo.completed">
            <span class="checkmark"></span>
          </label>
          <span :class="{ completed: todo.completed }">{{ todo.text }}</span>
        </li>
      </ul>
      <div class="todo-stats">
        <p>Completed Tasks: {{ completedTodosCount }} / {{ todos.length }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const title = ref('Dashboard')
const visitorCount = ref(0)
const newTodo = ref('')

const userInfo = reactive({
  name: '',
  age: 0
})

const todos = ref([
  { id: 1, text: 'Learn Vue 3 Composition API', completed: false },
  { id: 2, text: 'Master TypeScript', completed: false },
  { id: 3, text: 'Build a Project with Vite', completed: false }
])

const isAdult = computed(() => userInfo.age >= 18)
const completedTodosCount = computed(() => todos.value.filter(todo => todo.completed).length)

const incrementVisitors = () => {
  visitorCount.value++
}

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value,
      completed: false
    })
    newTodo.value = ''
  }
}
</script>

<style scoped>
.home {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.welcome-section, .user-info, .todo-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hero {
  text-align: center;
  margin-bottom: 2rem;
}

.hero h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.hero p {
  color: #666;
  font-size: 1.1rem;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-card h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.stat-card p {
  font-size: 2rem;
  font-weight: bold;
  color: #4CAF50;
  margin: 0.5rem 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
}

.info-display {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.todo-input {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.task-input {
  flex: 1;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.checkbox-container {
  display: inline-block;
  position: relative;
  padding-left: 25px;
  margin-right: 12px;
  cursor: pointer;
}

.completed {
  text-decoration: line-through;
  color: #888;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #45a049;
}

.todo-stats {
  margin-top: 1.5rem;
  text-align: right;
  color: #666;
}
</style> 
