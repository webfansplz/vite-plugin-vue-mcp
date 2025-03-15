<template>
  <div class="about">
    <h1>{{ pageTitle }}</h1>
    
    <div class="company-info">
      <h2>Company Overview</h2>
      <p>{{ companyInfo.description }}</p>
      <div class="stats">
        <div class="stat-item">
          <h3>Founded</h3>
          <p>{{ companyInfo.foundedYear }}</p>
        </div>
        <div class="stat-item">
          <h3>Employees</h3>
          <p>{{ companyInfo.employeeCount }}+</p>
        </div>
        <div class="stat-item">
          <h3>Global Offices</h3>
          <p>{{ companyInfo.officeCount }}</p>
        </div>
      </div>
    </div>

    <div class="mission-vision">
      <div class="mission">
        <h2>Our Mission</h2>
        <p>{{ mission }}</p>
      </div>
      <div class="vision">
        <h2>Our Vision</h2>
        <p>{{ vision }}</p>
      </div>
    </div>

    <div class="team-section" v-if="showTeam">
      <h2>Our Leadership Team</h2>
      <div class="team-grid">
        <div v-for="member in teamMembers" :key="member.id" class="team-member">
          <div class="member-avatar">
            <img :src="member.avatar" :alt="member.name">
          </div>
          <h3>{{ member.name }}</h3>
          <p class="position">{{ member.position }}</p>
          <p class="bio">{{ member.bio }}</p>
        </div>
      </div>
      <button class="btn-secondary" @click="toggleTeam">Hide Team</button>
    </div>
    <button v-else class="btn-secondary" @click="toggleTeam">Show Team</button>

    <div class="contact-form">
      <h2>Contact Us</h2>
      <form @submit.prevent="submitForm" class="form">
        <div class="form-group">
          <label>Name</label>
          <input v-model="contactForm.name" required placeholder="Enter your name">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="contactForm.email" type="email" required placeholder="Enter your email">
        </div>
        <div class="form-group">
          <label>Message</label>
          <textarea v-model="contactForm.message" required placeholder="How can we help you?"></textarea>
        </div>
        <button type="submit" class="btn-primary" :disabled="!isFormValid">Send Message</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const pageTitle = ref('About Us')
const showTeam = ref(false)

const companyInfo = reactive({
  description: 'We are a leading technology company dedicated to innovation and excellence in software development. Our commitment to quality and customer satisfaction drives everything we do.',
  foundedYear: 2020,
  employeeCount: 150,
  officeCount: 5
})

const mission = ref('To empower businesses and individuals through innovative technology solutions that drive growth and success.')
const vision = ref('To be the global leader in creating transformative digital experiences that shape the future of technology.')

const contactForm = reactive({
  name: '',
  email: '',
  message: ''
})

const teamMembers = ref([
  { 
    id: 1, 
    name: 'John Smith', 
    position: 'Chief Executive Officer',
    bio: 'Over 15 years of experience in tech leadership',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  { 
    id: 2, 
    name: 'Sarah Johnson', 
    position: 'Chief Technology Officer',
    bio: 'Former Silicon Valley tech lead',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  { 
    id: 3, 
    name: 'Michael Chen', 
    position: 'Product Director',
    bio: 'Product strategy and innovation expert',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
  },
  { 
    id: 4, 
    name: 'Emily Brown', 
    position: 'Marketing Director',
    bio: 'Digital marketing and growth specialist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
  }
])

const isFormValid = computed(() => {
  return contactForm.name.trim() !== '' && 
         contactForm.email.trim() !== '' && 
         contactForm.message.trim() !== ''
})

const toggleTeam = () => {
  showTeam.value = !showTeam.value
}

const submitForm = () => {
  if (isFormValid.value) {
    console.log('Form submitted:', contactForm)
    // Add actual form submission logic here
    alert('Thank you for your message! We will get back to you soon.')
    // Reset form
    contactForm.name = ''
    contactForm.email = ''
    contactForm.message = ''
  }
}
</script>

<style scoped>
.about {
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

.company-info, .mission-vision, .team-section, .contact-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stats {
  display: flex;
  justify-content: space-around;
  margin: 2rem 0;
  flex-wrap: wrap;
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  min-width: 200px;
}

.stat-item h3 {
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-item p {
  font-size: 2rem;
  font-weight: bold;
  color: #4CAF50;
  margin: 0;
}

.mission-vision {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.mission, .vision {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.team-member {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.3s;
}

.team-member:hover {
  transform: translateY(-5px);
}

.member-avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
  border-radius: 60px;
  overflow: hidden;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.position {
  color: #4CAF50;
  font-weight: 500;
  margin: 0.5rem 0;
}

.bio {
  color: #666;
  font-size: 0.9rem;
}

.form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

textarea {
  height: 150px;
  resize: vertical;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #4CAF50;
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
  width: 100%;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-primary:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style> 
