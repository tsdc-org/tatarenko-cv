<script setup lang="ts">
    import Skeleton from '~/assets/svg/skeleton.svg'
    const { t } = useI18n()
    const props = defineProps<{ data: IndexQuery }>()
    const config = useRuntimeConfig().public.config
</script>

<template>
    <section class="print:p-0! flex max-lg:flex-col-reverse gap-4 relative min-h-[550px]">
        <div class="flex gap-2 flex-col absolute max-lg:static right-0 bottom-0 *:text-right max-lg:*:text-left print:hidden">
            <NuxtLink v-if="data.links.github?.to" :to="data.links.github.to" target="_blank">{{ t('labels.this_project_on_github') }}</NuxtLink>
            <NuxtLink v-if="data.links.hh?.to" :to="data.links.hh.to" target="_blank">{{ t('labels.this_cv_on_hh') }}</NuxtLink>
            <NuxtLink v-if="data.links.linkedin?.to" :to="data.links.linkedin.to" target="_blank">{{ t('labels.this_cv_on_linkedin') }}</NuxtLink>
        </div>
        <div class="gap-2 flex-col absolute top-0 right-0 *:text-right *:text-sm *:text-default/50 hidden print:flex">
            <span>{{ t('labels.more_about') }}: {{ config.head.url }}</span>
        </div>
        <div class="gap-2 flex-col absolute bottom-0 right-0 *:text-right *:text-sm *:text-default/50 hidden print:flex">
            <span v-for="link in data.allLinks.filter(v => v.to.startsWith('http') && v.to.length < 50)">{{ link.label }}: {{ link.to }}</span>
        </div>
        
        <div class="grow flex flex-col gap-4">
            <MDC :value="data.summary.content" class="md"/>
            <div class="flex flex-col gap-1">
                <div 
                    v-for="items, key in Object.fromEntries(data.skills.map((group: any) => [
                        group.type, 
                        group.items.sort((a: any, b: any) => b.priority - a.priority)
                    ]))"
                    :key
                    class="flex flex-wrap gap-1 items-center" 
                    :style="`order: -${items.map((v: any) => v.name).join('').length}`" >
                    <span class="text-default/50 text-xs w-full">{{ key }}</span>
                    <NuxtBadge 
                        v-for="item in items" 
                        :key="item.name"
                        variant="outline" color="neutral"
                        :style="`--badge-color: ${item.color}`"
                        :ui="{ base: 'hover:bg-(--badge-color)/50 hover:ring-(--badge-color)!'}"
                    >
                        {{ item.name }}
                    </NuxtBadge>
                </div>
            </div>
        </div>
        <div class="flex flex-col items-end max-lg:items-start gap-4">
            <div class="flex items-center justify-center h-fit w-100 min-lg:min-w-100 max-sm:w-full max-lg:w-70 overflow-hidden duration-700 relative rounded-lg!">
                <NuxtBadge class="absolute top-2 right-2" variant="solid">{{ data.summary.status }}</NuxtBadge>
                <NuxtImg 
                    :src="data.summary.image" 
                    :alt="'Photo'"
                    class="h-fit w-100 min-lg:min-w-100 max-sm:w-full max-lg:w-70 transition-all" 
                    :placeholder="Skeleton" 
                    placeholder-class="animate-pulse blur-lg scale-150"
                />
            </div>
            <OrganismsContactButton class="max-sm:w-full"/>
        </div>
    </section>
</template>