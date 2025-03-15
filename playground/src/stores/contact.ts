import { defineStore } from 'pinia'

interface ContactForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
}

interface ContactInfo {
  address: string
  phone: string
  email: string
  hours: string
}

interface SocialLink {
  name: string
  url: string
  icon: string
}

export const useContactStore = defineStore('contact', {
  state: () => ({
    contactInfo: {
      address: '123 Business Street, Tech City, TC 12345',
      phone: '+1 (555) 123-4567',
      email: 'contact@company.com',
      hours: 'Monday - Friday: 9:00 AM - 6:00 PM',
    } as ContactInfo,

    socialLinks: [
      { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'fab fa-linkedin' },
      { name: 'Twitter', url: 'https://twitter.com', icon: 'fab fa-twitter' },
      { name: 'Facebook', url: 'https://facebook.com', icon: 'fab fa-facebook' },
      { name: 'Instagram', url: 'https://instagram.com', icon: 'fab fa-instagram' },
    ] as SocialLink[],

    subjects: [
      { value: 'general', label: 'General Inquiry' },
      { value: 'support', label: 'Technical Support' },
      { value: 'sales', label: 'Sales Question' },
      { value: 'partnership', label: 'Partnership Opportunity' },
      { value: 'other', label: 'Other' },
    ],

    form: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    } as ContactForm,

    submissionHistory: [] as ContactForm[],
  }),

  getters: {
    isFormValid: (state) => {
      return state.form.firstName.trim() !== ''
        && state.form.lastName.trim() !== ''
        && state.form.email.trim() !== ''
        && state.form.subject !== ''
        && state.form.message.trim() !== ''
    },
  },

  actions: {
    async submitForm() {
      if (this.isFormValid) {
        // Add actual API call here
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

        // Save to submission history
        this.submissionHistory.push({ ...this.form })

        // Reset form
        this.resetForm()

        return true
      }
      return false
    },

    resetForm() {
      this.form = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      }
    },
  },
})
