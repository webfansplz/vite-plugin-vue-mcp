<template>
  <div class="services">
    <h1>{{ pageTitle }}</h1>

    <div class="services-grid">
      <div v-for="service in services" :key="service.id" class="service-card">
        <div class="service-icon">
          <i :class="service.icon"></i>
        </div>
        <h3>{{ service.title }}</h3>
        <p>{{ service.description }}</p>
        <ul class="features-list">
          <li v-for="feature in service.features" :key="feature">{{ feature }}</li>
        </ul>
        <button class="btn-primary" @click="requestService(service)">Learn More</button>
      </div>
    </div>

    <div class="process-section">
      <h2>Our Development Process</h2>
      <div class="process-timeline">
        <div v-for="step in process" :key="step.id" class="process-step">
          <div class="step-number">{{ step.id }}</div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </div>
      </div>
    </div>

    <div class="technologies">
      <h2>Technologies We Use</h2>
      <div class="tech-grid">
        <div v-for="tech in technologies" :key="tech.id" class="tech-item">
          <img :src="tech.icon" :alt="tech.name">
          <span>{{ tech.name }}</span>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <h2>Ready to Start Your Project?</h2>
      <p>Get in touch with us to discuss your requirements</p>
      <button class="btn-primary" @click="contactUs">Contact Us Now</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useServicesStore } from '../stores/services'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()
const store = useServicesStore()

import { storeToRefs } from 'pinia'
const { services, process, technologies } = storeToRefs(store)

const pageTitle = ref('Our Services')

const requestService = async (service: any) => {
  await store.requestService(service)
  router.push('/contact')
}

const contactUs = () => {
  router.push('/contact')
}
</script>

<style scoped>
.services {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 3rem 0 2rem;
  text-align: center;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.service-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.service-card:hover {
  transform: translateY(-5px);
}

.service-icon {
  font-size: 2.5rem;
  color: #4CAF50;
  margin-bottom: 1rem;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  text-align: left;
}

.features-list li {
  padding: 0.5rem 0;
  color: #666;
}

.features-list li::before {
  content: "✓";
  color: #4CAF50;
  margin-right: 0.5rem;
}

.process-timeline {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 3rem 0;
  position: relative;
  flex-wrap: wrap;
  gap: 2rem;
}

.process-timeline::before {
  content: "";
  position: absolute;
  top: 2rem;
  left: 0;
  right: 0;
  height: 2px;
  background: #e9ecef;
  z-index: 0;
}

.process-step {
  flex: 1;
  min-width: 200px;
  text-align: center;
  position: relative;
  z-index: 1;
  background: white;
  padding: 1rem;
}

.step-number {
  width: 4rem;
  height: 4rem;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.tech-item img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.cta-section {
  text-align: center;
  background: #f8f9fa;
  padding: 3rem;
  border-radius: 12px;
  margin: 3rem 0;
}

.cta-section p {
  color: #666;
  margin-bottom: 2rem;
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
</style> 
