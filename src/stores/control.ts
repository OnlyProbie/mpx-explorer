import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useControlStore = defineStore('control', () => {
  const showGeneratedContent = ref(false)
  return { showGeneratedContent }
})
