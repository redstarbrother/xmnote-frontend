<template>
  <div class="welcome-container">
    <WelcomeHero />
    <div class="welcome-grid">
      <OnboardingChecklist />
      <ShortcutHints />
      <TipsSection />
    </div>
  </div>
</template>

<script setup>
import WelcomeHero from './WelcomeHero.vue';
import OnboardingChecklist from './OnboardingChecklist.vue';
import ShortcutHints from './ShortcutHints.vue';
import TipsSection from './TipsSection.vue';
</script>

<style scoped lang="scss">
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 2vh 2vw;
}

.welcome-grid {
  width: 60%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 16px;
}

@media (max-width: 1024px) {
  .welcome-grid {
    width: 90%;
    grid-template-columns: 1fr;
  }
}
</style>