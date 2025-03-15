<template>
  <div class="contact">
    <h1>{{ pageTitle }}</h1>

    <div class="contact-container">
      <div class="contact-info">
        <h2>Get in Touch</h2>
        <p>We'd love to hear from you. Please fill out the form or contact us using the information below.</p>
        
        <div class="info-items">
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <h3>Address</h3>
              <p>{{ contactInfo.address }}</p>
            </div>
          </div>
          
          <div class="info-item">
            <i class="fas fa-phone"></i>
            <div>
              <h3>Phone</h3>
              <p>{{ contactInfo.phone }}</p>
            </div>
          </div>
          
          <div class="info-item">
            <i class="fas fa-envelope"></i>
            <div>
              <h3>Email</h3>
              <p>{{ contactInfo.email }}</p>
            </div>
          </div>

          <div class="info-item">
            <i class="fas fa-clock"></i>
            <div>
              <h3>Business Hours</h3>
              <p>{{ contactInfo.hours }}</p>
            </div>
          </div>
        </div>

        <div class="social-links">
          <a v-for="social in socialLinks" 
             :key="social.name" 
             :href="social.url" 
             target="_blank"
             :title="social.name"
             class="social-link"
          >
            <i :class="social.icon"></i>
          </a>
        </div>
      </div>

      <div class="contact-form">
        <h2>Send us a Message</h2>
        <form @submit.prevent="submitForm">
          <div class="form-row">
            <div class="form-group">
              <label>First Name</label>
              <input 
                v-model="form.firstName" 
                type="text" 
                required 
                placeholder="Enter your first name"
              >
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input 
                v-model="form.lastName" 
                type="text" 
                required 
                placeholder="Enter your last name"
              >
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input 
              v-model="form.email" 
              type="email" 
              required 
              placeholder="Enter your email"
            >
          </div>

          <div class="form-group">
            <label>Phone (Optional)</label>
            <input 
              v-model="form.phone" 
              type="tel" 
              placeholder="Enter your phone number"
            >
          </div>

          <div class="form-group">
            <label>Subject</label>
            <select v-model="form.subject" required>
              <option value="">Select a subject</option>
              <option v-for="subject in subjects" 
                      :key="subject.value" 
                      :value="subject.value"
              >
                {{ subject.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Message</label>
            <textarea 
              v-model="form.message" 
              required 
              placeholder="How can we help you?"
            ></textarea>
          </div>

          <button type="submit" class="btn-primary" :disabled="!isFormValid">
            Send Message
          </button>
        </form>
      </div>
    </div>

    <div class="map-section">
      <h2>Our Location</h2>
      <div class="map-container">
        <!-- Add your map implementation here -->
        <div class="map-placeholder">
          Map will be displayed here
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useContactStore } from '../stores/contact'
import { ref } from 'vue'
const store = useContactStore()

// Use storeToRefs to maintain reactivity
import { storeToRefs } from 'pinia'
const { contactInfo, socialLinks, subjects, form } = storeToRefs(store)
const { isFormValid } = storeToRefs(store)

const pageTitle = ref('Contact Us')

const submitForm = async () => {
  if (await store.submitForm()) {
    alert('Thank you for your message! We will get back to you soon.')
  }
}
</script>

<style scoped>
.contact {
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
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.contact-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.contact-info, .contact-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info-items {
  margin: 2rem 0;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item i {
  font-size: 1.5rem;
  color: #4CAF50;
  width: 2rem;
  text-align: center;
}

.info-item h3 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.info-item p {
  color: #666;
  margin: 0;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.social-link {
  width: 2.5rem;
  height: 2.5rem;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4CAF50;
  text-decoration: none;
  transition: all 0.3s;
}

.social-link:hover {
  background: #4CAF50;
  color: white;
  transform: translateY(-2px);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

input, select, textarea {
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

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.btn-primary {
  width: 100%;
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

.btn-primary:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.map-section {
  margin-top: 3rem;
  text-align: center;
}

.map-container {
  width: 100%;
  height: 400px;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-style: italic;
}

@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style> 
