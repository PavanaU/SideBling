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

    <!-- Rive Loader -->
    <div class="rive-loader">
      <canvas ref="riveCanvas" width="200" height="200"></canvas>
    </div>

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
import { computed, ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Rive } from '@rive-app/canvas'

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
const riveCanvas = ref<HTMLCanvasElement | null>(null)
const riveInstance = ref<any>(null)

async function generateIdeas() {
  if (!value.value.trim()) {
    alert('Please enter a hobby or interest first')
    return
  }

  // Animate hero content and footer cards out
  const tl = gsap.timeline()
  tl.to('.hero-content', {
    y: 500,
    duration: 0.6,
    ease: 'power2.inOut'
  })
  tl.to('.example-text', {
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out'
  }, '-=0.6') // Start at the same time as the previous animation
  tl.to('.footer-cards .card', {
    y: 300,
    duration: 0.5,
    ease: 'power2.inOut',
    stagger: 0.1
  }, '-=0.4') // Start slightly before the hero animation ends
  
  // Wait for animations to complete
  await tl
  
  // Small delay then fade in the loader
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Fade in the loader
  await gsap.to('.rive-loader', {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.out'
  })

  isLoading.value = true
  submittedHobby.value = value.value
  
  // Small delay to ensure loader is visible
  await new Promise(resolve => setTimeout(resolve, 300))
  
  try {
    const response = await $fetch('/api/generate-ideas', {
      method: 'POST',
      body: {
        hobby: value.value
      }
    })

    if (response.success) {
      // Fade out the loader before showing results
      await gsap.to('.rive-loader', {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
      generatedIdeas.value = response.ideas || ''
    }
  } catch (error: any) {
    console.error('Error generating ideas:', error)
    // Fade out the loader on error
    await gsap.to('.rive-loader', {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    })
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

onMounted(async () => {
  // Wait a tick to ensure canvas is in DOM
  await nextTick()
  
  // Initialize Rive animation
  if (riveCanvas.value) {
    try {
      riveInstance.value = new Rive({
        src: '/loader.riv',
        canvas: riveCanvas.value,
        autoplay: true,
        stateMachines: 'State Machine 1', // Use the default state machine if available
        onLoad: () => {
          console.log('Rive loader loaded successfully')
          riveInstance.value?.resizeDrawingSurfaceToCanvas()
        },
        onLoadError: (error) => {
          console.error('Failed to load Rive animation:', error)
        }
      })
    } catch (error) {
      console.error('Error initializing Rive:', error)
    }
  }
})
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
  max-width: 940px;
  overflow: hidden;
}

.hero-content {
  display: inline-block;
}

.cta-container {
  display: inline-flex;
  flex-direction: row;
  align-items: stretch;
  gap: 15px;
  background: #00A160;
  border-radius: 15px;
  padding: 15px;
  width: max-content;
}

.textfield {
  position: relative;
  background: transparent;
  border-radius: 6px;
  width: 620px;
  flex-shrink: 0;
}
.textfield-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #fff;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-weight: 600;
  font-size: 24px;
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
  padding: 32px 30px;
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
  flex-shrink: 0;
}
.cta-button img { width: 28px; height: 28px; }

.example-text {
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 15px;
}

/* Footer cards pinned bottom */
.footer-cards {
  position: sticky;
  bottom: 0;
  display: flex;
  gap: 30px;
  overflow-x: auto;
  overflow-y: hidden;
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

/* Rive Loader */
.rive-loader {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rive-loader canvas {
  display: block;
  width: 600px;
  height: 600px;
}

/* Fallback loader styles */
.fallback-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: #fff;
}

.fallback-loader p {
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-size: 18px;
  font-weight: 600;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

