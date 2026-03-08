<template>
  <div class="min-h-screen flex flex-col bg-default">
    <div class="flex-1 flex flex-col">
      <slot />
    </div>
    <footer class="py-4 text-center">
      <p class="text-xs text-dimmed">
        <a
          href="https://openformation.io"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-muted transition-colors"
        >
          Open Formation GmbH
        </a>
      </p>
    </footer>
  </div>
</template>
