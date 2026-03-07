<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col" style="background: var(--color-bg);">
    <div class="flex-1 flex flex-col">
      <slot />
    </div>
    <footer class="py-4 text-center">
      <p class="text-xs" style="color: var(--color-text-tertiary);">
        Built by <a href="https://openformation.io" target="_blank" rel="noopener noreferrer" class="hover:underline" style="color: var(--color-text-secondary);">Open Formation GmbH</a>
      </p>
    </footer>
  </div>
</template>
