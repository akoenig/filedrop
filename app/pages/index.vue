<script setup lang="ts">
useHead({ title: "filedrop" });
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center px-6 py-16">
    <div class="text-center max-w-md">
      <h1 class="text-2xl font-bold text-highlighted tracking-tight mb-3">
        filedrop
      </h1>
      <p class="text-sm text-muted leading-relaxed">
        Share files with a link. Upload via API, download from the browser.
        Files expire automatically after 7 days.
      </p>

      <div
        class="mt-10 rounded-xl bg-muted border border-default p-6 text-left"
      >
        <p class="text-xs font-medium text-toned mb-3 uppercase tracking-wider">
          Upload a file
        </p>
        <code class="text-sm text-highlighted leading-relaxed block whitespace-pre-wrap break-all">curl -X POST "{{ baseUrl }}/files?token=TOKEN" \
  -F "file=@yourfile.pdf"</code>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  computed: {
    baseUrl() {
      if (import.meta.server) return "https://your-domain.com";
      return window.location.origin;
    },
  },
};
</script>
