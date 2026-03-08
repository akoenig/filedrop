<script setup lang="ts">
const route = useRoute();
const id = route.params.id as string;

const { data: file, error } = await useFetch(`/api/files/${id}`);

useHead({
  title: file.value ? file.value.filename : "File Not Found",
});

useSeoMeta({
  description: file.value
    ? `Download ${file.value.filename} (${formatFileSize(file.value.size)})`
    : "This file does not exist or has expired.",
});

const fileIcon = computed(() => {
  if (!file.value) return "i-lucide-file";
  const type = file.value.contentType;
  if (type.startsWith("image/")) return "i-lucide-file-image";
  if (type.startsWith("video/")) return "i-lucide-file-video";
  if (type.startsWith("audio/")) return "i-lucide-file-audio";
  if (type.includes("pdf")) return "i-lucide-file-text";
  if (
    type.includes("zip") ||
    type.includes("tar") ||
    type.includes("gzip") ||
    type.includes("compressed") ||
    type.includes("archive")
  )
    return "i-lucide-file-archive";
  if (
    type.includes("json") ||
    type.includes("javascript") ||
    type.includes("xml") ||
    type.includes("html") ||
    type.includes("css")
  )
    return "i-lucide-file-code";
  if (type.startsWith("text/")) return "i-lucide-file-text";
  return "i-lucide-file";
});

const formattedSize = computed(() => {
  if (!file.value) return "";
  return formatFileSize(file.value.size);
});

const fileType = computed(() => {
  if (!file.value) return "";
  return getFileTypeLabel(file.value.contentType);
});

const expiryText = computed(() => {
  if (!file.value) return "";
  return formatTimeUntilExpiry(new Date(file.value.expiresAt));
});
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center px-6 py-16">
    <!-- Not found -->
    <div v-if="error" class="filedrop-fade-in text-center max-w-sm">
      <div
        class="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800"
      >
        <UIcon name="i-lucide-file-x" class="h-10 w-10 text-neutral-400 dark:text-neutral-500" />
      </div>
      <h1 class="text-xl font-semibold text-highlighted mb-2">File not found</h1>
      <p class="text-sm text-muted leading-relaxed">
        This file doesn't exist or may have been removed.
      </p>
    </div>

    <!-- Expired -->
    <div v-else-if="file?.expired" class="filedrop-fade-in text-center max-w-sm">
      <div
        class="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/30"
      >
        <UIcon name="i-lucide-clock" class="h-10 w-10 text-amber-500" />
      </div>
      <h1 class="text-xl font-semibold text-highlighted mb-2">File expired</h1>
      <p class="text-sm text-muted leading-relaxed">
        This file is no longer available.<br />
        Files are automatically removed after 7 days.
      </p>
    </div>

    <!-- File ready for download -->
    <div v-else-if="file" class="filedrop-fade-in w-full max-w-sm">
      <div
        class="rounded-2xl bg-elevated border border-default shadow-xl shadow-neutral-950/[0.03] dark:shadow-neutral-950/30 p-10"
      >
        <div class="text-center">
          <!-- File type icon -->
          <div
            class="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100/80 dark:from-amber-950/30 dark:to-orange-900/20 ring-1 ring-orange-200/60 dark:ring-orange-800/30"
          >
            <UIcon :name="fileIcon" class="h-10 w-10 text-orange-600 dark:text-orange-400" />
          </div>

          <!-- Filename -->
          <h1
            class="text-lg font-semibold text-highlighted leading-snug break-words mb-2"
          >
            {{ file.filename }}
          </h1>

          <!-- Metadata -->
          <div class="flex items-center justify-center gap-2 text-sm text-muted mb-10">
            <span>{{ formattedSize }}</span>
            <span class="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600" aria-hidden="true" />
            <span>{{ fileType }}</span>
          </div>

          <!-- Download button -->
          <a
            :href="`/${id}?download=true`"
            class="filedrop-button group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-neutral-900 dark:bg-white px-6 py-4 font-medium text-white dark:text-neutral-900 transition-all duration-150 hover:bg-neutral-800 dark:hover:bg-neutral-100 active:scale-[0.98]"
          >
            <UIcon
              name="i-lucide-download"
              class="h-5 w-5 transition-transform duration-150 group-hover:translate-y-0.5"
            />
            Download
          </a>
        </div>
      </div>

      <!-- Expiry info -->
      <p class="mt-6 text-center text-xs text-dimmed">
        {{ expiryText }}
      </p>
    </div>
  </div>
</template>
