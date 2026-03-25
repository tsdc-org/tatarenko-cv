<script setup lang="ts">

    const props = withDefaults(defineProps<{
        theme?: 'dark' | 'light'
        photo?: string,
        status?: string
        title?: string
        description?: string
        experience?: string
        url?: string
    }>(), { theme: 'dark' })
    const config = useRuntimeConfig().public.config

    const style = computed(() => (props.theme === 'dark' ? {
        background: config.theme.background.dark,
        color: config.theme.font.dark,
        border: config.theme.border.dark + 80,
    }: {
        background: config.theme.background.light,
        color: config.theme.font.light,
        border: config.theme.border.light + 80,
    }))
    
</script>

<template>
    <div 
        class="w-full h-full p-8" 
        :style="{ 
            background: style.background, 
            color: style.color,
            fontFamily: `'Nunito', sans-serif` 
        }"
    >
        <div class="w-full h-full flex items-center justify-between gap-8" :style="{ borderColor: style.border }">
            <div class="flex flex-col items-start h-full gap-4">
                <h1 class="text-5xl font-black max-w-140" style="text-wrap: pretty">{{ title }}</h1>
                <div class="text-xl flex flex-col max-w-140" :style="{ borderColor: style.border }">
                    {{ description }}
                </div>
                <div class="h-full flex flex-col justify-end max-w-140">
                    <span class="opacity-50">{{ experience }}</span>
                </div>
            </div>
            <div class="relative h-full">
                <img :src="photo" class="h-full object-contain rounded-2xl"/>
                <div class="absolute top-4 right-4 text-black px-4 py-2" :style="{ background: config.theme.accent }">{{ props.status }}</div>
            </div>
        </div>

    </div>
</template>