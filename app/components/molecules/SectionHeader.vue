<script setup lang="ts">
    const props = defineProps<{ pattern: string, id?: string, noContact?: boolean }>()
</script>

<template>
    <div 
        :name="props.pattern" 
        :id 
        style="break-before: page;"
        class="w-full py-12 group/header print:border print:outline-0 transition-colors z-2 backdrop-blur-lg border-text border rounded-lg flex items-center px-8 max-lg:flex-col gap-4 max-lg:py-4 max-lg:px-0 print:p-0! print:items-center! print:justify-center!" 
        :class="[
            $slots.default ? 'min-h-32' : 'min-h-18',
            props.noContact ? 'justify-center' : 'justify-between!'
        ]"
    >
        <h2 class="max-lg:text-center text-2xl! font-bold z-3 pointer-events-none" v-if="$slots.default">
            <slot/>
        </h2>
        <OrganismsContactButton class="z-3" :id v-if="$slots.default && !props.noContact"/>
    </div>
</template>