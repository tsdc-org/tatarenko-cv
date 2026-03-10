<script setup lang="ts">
    const { t } = useI18n()
    const props = defineProps<{ data: IndexQuery }>()
</script>

<template>
    <section class="print:px-0! flex flex-col relative">
        <div class="flex flex-col gap-8 relative pl-20 pb-6 last:pb-0 max-lg:pl-0!" :key="company.name" v-for="company, i in data.experience">
            <div class="h-full w-px bg-border absolute top-0 left-6 max-lg:hidden" v-if="data.experience.length !== Number(i) + 1"></div>
            <div class="rounded-full overflow-hidden hover:border-primary! transition-all select-none w-12 h-12 border absolute! top-0 left-0 bg-default z-2 flex items-center justify-center text-default/50 text-sm! max-lg:hidden">{{ (data.experience.length - Number(i)).toString() }}</div>

            <div class="flex flex-col gap-4 grow">
                <NuxtImg v-if="company.logo" :src="company.logo" class="h-12 max-lg:h-6 w-fit flex items-center text-2xl font-bold" loading="lazy" :alt="company.name"/>
                <span v-else class="h-12 w-fit flex items-center text-2xl font-bold">{{ company.name }}</span>

                <MDC v-if="company.about" :value="company.about" class="*:my-0! *:leading-4 *:text-xs! *:text-default/50"/>

                <div class="flex flex-col items-end gap-2 *:leading-4 *:text-sm! *:text-nowrap absolute top-0 right-0 max-lg:static max-lg:items-start">
                    <span v-if="company.positions.length > 1">{{ t('labels.total_positions_duration') }}: {{ useExperience(
                        company.positions.at(-1)?.duration.from!, 
                        company.positions.at(0)?.duration.to
                    ).duration() }}</span>
                    <NuxtLink v-if="company.link" :to="company.link" target="_blank" class="text-default/50">{{ company.link }}</NuxtLink>
                </div>

                <div class="flex flex-col relative gap-2" :key="position.name" v-for="position in company.positions">
                    <div class="w-10 h-px bg-border absolute top-3 -left-14" v-if="company.positions.length > 1"></div>
                    <span class="text-lg font-bold">{{ position.name }} <span class="text-default/50">/ {{ useExperience(position.duration.from, position.duration.to).period() }}</span></span>
                    
                    <div class="flex flex-wrap gap-1">
                        <NuxtBadge 
                            v-for="item in position.skills" 
                            :key="item.name"
                            variant="outline" color="neutral"
                            :style="`--badge-color: ${item.color}`"
                            :ui="{ base: 'hover:bg-(--badge-color)/50 hover:ring-(--badge-color)!'}"
                        >
                            {{ item.name }}
                        </NuxtBadge>
                    </div>

                    <span class="text-lg font-bold text-default/50">{{ t('labels.position_description') }}</span>
                    
                    <MDC v-if="position.description" :value="position.description" class="md *:my-0!"/>
                </div>

                <MDC v-if="company.footer" :value="company.footer" class="md *:my-0! *:text-sm *:text-default/50"/>
            
            </div>
        </div>
    </section>
</template>