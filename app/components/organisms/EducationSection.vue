<script setup lang="ts">
    const props = defineProps<{ data: IndexQuery }>()
</script>

<template>
    <section class="print:px-0! flex flex-col relative">
        <div class="flex flex-col relative pl-20 pb-6 last:pb-0 max-lg:pl-0! h-18 last:h-12 max-lg:h-fit!" v-for="education, i in data.education" :key="education.id">
            <div class="rounded-full overflow-hidden w-12 h-12 border hover:border-primary! transition-all select-none absolute! top-0 left-0 bg-default z-2 flex items-center justify-center text-default/50 text-sm! max-lg:hidden">{{ (data.education.length - Number(i)).toString() }}</div>
            <div class="h-full w-px bg-border absolute top-0 left-6 max-lg:hidden" v-if="data.education.length !== Number(i) + 1"></div>
            <div class="flex items-center justify-between gap-1 max-lg:items-start">
                <div class="flex items-center gap-2">
                    <span class="text-lg font-bold">{{ education.name }} <span class="text-default/50">/ {{ education.faculty }} / {{ education.year }}</span></span>
                </div>
                <NuxtLink :to="education.link" target="_blank">{{ education.link }}</NuxtLink>
            </div>
            <span class="text-default/50">{{ education.level }}, {{ education.specialization }}</span>
        </div>
    </section>
</template>