<template>
  <div class="welcome-container">
    <WelcomeHero />
    <div class="welcome-grid">
      <OnboardingChecklist />
      <ShortcutHints />
      <TipsSection />
      <VersionUpdates />
    </div>
  </div>
</template>

<script setup>
import WelcomeHero from './WelcomeHero.vue';
import OnboardingChecklist from './OnboardingChecklist.vue';
import ShortcutHints from './ShortcutHints.vue';
import TipsSection from './TipsSection.vue';
import VersionUpdates from './VersionUpdates.vue';
</script>

<style scoped lang="scss">
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  // height: 100%;
  overflow: auto;
  padding: 10vh 0;
}

.welcome-grid {
  width: 65%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 24px;
}

@media (max-width: 1024px) {
  .welcome-grid {
    width: 90%;
    grid-template-columns: 1fr;
  }
}
</style>
