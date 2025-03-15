import { defineStore } from 'pinia'

interface Service {
  id: number
  title: string
  description: string
  icon: string
  features: string[]
}

interface ProcessStep {
  id: number
  title: string
  description: string
}

interface Technology {
  id: number
  name: string
  icon: string
}

export const useServicesStore = defineStore('services', {
  state: () => ({
    services: [
      {
        id: 1,
        title: 'Web Development',
        description: 'Create modern, responsive websites and web applications tailored to your needs.',
        icon: 'fas fa-code',
        features: [
          'Custom Web Applications',
          'E-commerce Solutions',
          'Progressive Web Apps',
          'Website Maintenance',
        ],
      },
      // ... other services
    ] as Service[],

    process: [
      {
        id: 1,
        title: 'Discovery',
        description: 'We analyze your requirements and create a detailed project plan.',
      },
      // ... other process steps
    ] as ProcessStep[],

    technologies: [
      { id: 1, name: 'Vue.js', icon: 'https://api.iconify.design/logos:vue.svg' },
      // ... other technologies
    ] as Technology[],

    selectedService: null as Service | null,
  }),

  getters: {
    getServiceById: (state) => {
      return (id: number) => state.services.find(s => s.id === id)
    },
  },

  actions: {
    selectService(service: Service) {
      this.selectedService = service
    },

    async requestService(service: Service) {
      this.selectService(service)
      // Add actual service request logic here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      return true
    },
  },
})
