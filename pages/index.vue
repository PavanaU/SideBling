<template>
  <div class="app-root">
    <header class="navbar">
      <div class="logo" aria-label="SideBling Logo">
        <img :src="imgLogoSvg" alt="SideBling" />
      </div>
      <nav class="menu">
        <a href="#" class="nav-item">Home</a>
        <a href="#" class="nav-item">FAQ</a>
        <a href="#" class="nav-item">Login</a>
      </nav>
    </header>

    <main class="hero">
      <div class="hero-panel">
        <div class="hero-content">
          <div class="cta-container">
            <div class="textfield" :class="{ focused: isFocused || hasValue }">
              <label class="floating-label" :for="inputId">{{ placeholder }}</label>
              <input
                :id="inputId"
                v-model="value"
                type="text"
                class="textfield-input"
                @focus="onFocus"
                @blur="onBlur"
                :aria-label="placeholder"
              />
              <div class="textfield-stroke" aria-hidden="true" />
            </div>
            <button class="cta-button" @click="generateIdeas" :disabled="isLoading">
              <img :src="imgDollar" alt="" aria-hidden="true" />
              <span>{{ isLoading ? 'Generating...' : 'Show me the money' }}</span>
            </button>
          </div>
          <p class="example-text">"I like reading romance novels"</p>
        </div>
      </div>
    </main>

    <!-- Results Section -->
    <section v-if="generatedIdeas" class="results-section">
      <div class="results-container">
        <h2 class="results-title">Business Ideas for "{{ submittedHobby }}"</h2>
        <div class="ideas-content">{{ generatedIdeas }}</div>
        <button class="new-search-btn" @click="resetSearch">Try Another Hobby</button>
      </div>
    </section>

    <footer class="footer-cards">
      <div v-for="(hobby, index) in hobbies" :key="index" class="card">
        <div class="card-inner">
          <p class="card-title">{{ hobby }}</p>
          <div class="tag"><span>11 BUSINESS IDEAS</span></div>
        </div>
        <div class="card-stroke" aria-hidden="true" />
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const imgLogoSvg = '/assets/logo.svg'
const imgDollar = '/assets/dollar.svg'

const PRIMARY = '#009358'
const PANEL_BG = '#00A160'
const TEXTFIELD_STROKE = '#00d37e'

const placeholder = 'What is an interest or hobby that you enjoy?'
const value = ref('')
const isFocused = ref(false)
const inputId = 'interest-input'

const hasValue = computed(() => value.value.trim().length > 0)

const isLoading = ref(false)
const generatedIdeas = ref('')
const submittedHobby = ref('')

async function generateIdeas() {
  if (!value.value.trim()) {
    alert('Please enter a hobby or interest first')
    return
  }

  isLoading.value = true
  submittedHobby.value = value.value
  
  try {
    const response = await $fetch('/api/generate-ideas', {
      method: 'POST',
      body: {
        hobby: value.value
      }
    })

    if (response.success) {
      generatedIdeas.value = response.ideas || ''
    }
  } catch (error: any) {
    console.error('Error generating ideas:', error)
    alert(error.data?.statusMessage || 'Failed to generate ideas. Please check your API key setup.')
  } finally {
    isLoading.value = false
  }
}

function resetSearch() {
  generatedIdeas.value = ''
  submittedHobby.value = ''
  value.value = ''
}

const hobbies = [
  '"I like to collect old coins and learn their history."',
  '"I enjoy baking new recipes on weekends."',
  '"I love playing chess and solving puzzles."',
  '"I like to paint landscapes in watercolor."',
  '"I enjoy hiking and exploring new trails."',
  '"I like to build DIY electronics projects."',
  '"I enjoy writing short stories in my free time."',
  '"I like gardening and growing fresh herbs."',
  '"I love photographing street scenes."',
  '"I enjoy practicing yoga every morning."'
]

function onFocus() {
  isFocused.value = true
}
function onBlur() {
  isFocused.value = false
}
</script>

<style scoped>
.app-root {
  background: #009358;
  min-height: 100vh;
  color: #fff;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.navbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1650px;
  margin: 51px auto 0;
  padding: 0 127px;
}
.logo {
  height: 85px;
  width: 221.401px;
}
.logo img { height: 100%; width: 100%; display: block; }
.menu { display: flex; gap: 38px; }
.nav-item {
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-weight: 600;
  font-size: 22px;
  line-height: 20px;
  color: #fff;
  text-decoration: none;
}

.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 80px 20px;
}

.hero-panel {
  width: 100%;
  max-width: 900px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: fit-content;
}

.cta-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  background: #00A160;
  border-radius: 15px;
  padding: 15px;
}

.textfield {
  position: relative;
  background: transparent;
  border-radius: 6px;
  min-width: 680px;
}
.textfield-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #fff;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-weight: 600;
  font-size: 26px;
  line-height: 20px;
  padding: 53px 21px 13px 21px;
}
.floating-label {
  position: absolute;
  left: 21px;
  top: 33px;
  color: #fff;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-weight: 600;
  line-height: 20px;
  pointer-events: none;
  transform-origin: left top;
  transition: transform 160ms ease, opacity 160ms ease;
  font-size: 26px;
}
.textfield.focused .floating-label {
  transform: translateY(-20px) scale(0.77);
  opacity: 0.95;
}
.textfield-stroke {
  position: absolute;
  inset: 0;
  border: 1px solid #00d37e;
  border-radius: 6px;
  pointer-events: none;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 33px 21px;
  border-radius: 6px;
  background: #fff;
  color: #009358;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}
.cta-button img { width: 28px; height: 28px; }

.example-text {
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 15px;
  align-self: flex-start;
}

/* Footer cards pinned bottom */
.footer-cards {
  position: sticky;
  bottom: 0;
  display: flex;
  gap: 30px;
  overflow-x: auto;
  padding: 20px 30px;
}
.card {
  position: relative;
  width: 280px;
  height: 229px;
  border-radius: 6px;
}
.card-inner {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 280px;
  height: 229px;
  padding: 21px;
  background: #00A160;
  border-radius: 6px;
}
.card-title {
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-weight: 600;
  font-size: 22px;
  line-height: 30px;
  color: #fff;
}
.tag {
  background: #00A160;
  border-radius: 4px;
  padding: 6px 10px;
  border: 1px solid rgba(255,255,255,0.12);
  width: max-content;
}
.tag span {
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 100%;
  color: #fff;
}
.card-stroke {
  position: absolute;
  inset: 0;
  border: 1px solid #00d37e;
  border-radius: 6px;
  pointer-events: none;
}

@media (max-width: 768px) {
  .navbar { padding: 0 20px; }
  .hero { padding: 40px 20px; }
  .hero-content { width: 100%; }
  .cta-container { 
    flex-direction: column; 
    align-items: stretch;
    width: 100%;
  }
  .textfield { 
    min-width: 0;
    width: 100%; 
  }
  .cta-button { 
    width: 100%; 
    justify-content: center; 
  }
  .example-text {
    margin-top: 15px;
  }
}

/* Results Section */
.results-section {
  background: #007a46;
  padding: 60px 20px;
  min-height: 400px;
}

.results-container {
  max-width: 1200px;
  margin: 0 auto;
  background: #00A160;
  border-radius: 15px;
  padding: 40px;
}

.results-title {
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: #fff;
  margin-bottom: 30px;
}

.ideas-content {
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-size: 18px;
  line-height: 1.8;
  color: #fff;
  white-space: pre-wrap;
  background: rgba(0, 0, 0, 0.1);
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.new-search-btn {
  padding: 15px 30px;
  background: #fff;
  color: #009358;
  border: none;
  border-radius: 6px;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.new-search-btn:hover {
  transform: translateY(-2px);
}

.cta-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>

