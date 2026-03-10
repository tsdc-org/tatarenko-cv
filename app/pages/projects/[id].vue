<script setup lang="ts">
    import Skeleton from '~/assets/svg/skeleton.svg'
    import useMarkdownRemoval from 'remove-markdown'

    const { t, locale } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const theme = useColorMode()

    const params = ref({ id: route.params.id?.toString() }); watch(() => route.params.id, () => params.value.id = route.params.id?.toString())
    const { data } = await useSanityDynamicQuery<any>(groq`*[_type == "project" && id == $id] {
        "seo": *[_type == "summary"][0] {
            "title": title[$locale], 
        },
        id, links, tags, repo,
        "name": name[$locale],
        "description": description[$locale],
        "thumbnail": thumbnail[$theme].asset->url,
        "logo": logo[$theme].asset->url,
        "images": images[].asset->url,
        "bg": bg.hex,
        "about": about[$locale],
        "stack": stack[]->{
            name, type, color, priority
        } | order(priority desc),
        "status": status[$locale],
        "copyright": copyright[$locale],
        "related": related[]->{
            id, tags, repo, priority,
            "name": name[$locale],
            "thumbnail": thumbnail[$theme].asset->url,
            "description": description[$locale]
        }
    }[0]`, params);

    if (!data.value) throw createError({ status: 404, message: `"${route.params.id?.toString()}" Project not found` })

    const repo = data.value?.repo ? await useGithubRepository<any>(data.value?.repo) : undefined

    useSeoMeta({
        title: data.value?.name,
        ogTitle: `${data.value?.seo.title} — ${data.value?.name}`,
        description: useMarkdownRemoval(data.value?.description),
        ogDescription: useMarkdownRemoval(data.value?.description),
        ogImage: data.value.thumbnail
    })
</script>

<template>
    <NuxtCarousel
        v-if="data?.images?.length && data?.images?.length > 1"
        :items="data?.images" v-slot="{ item: src, index }"
        loop autoplay arrows
        :prev="{ variant: 'outline' }" :next="{ variant: 'outline' }"        
        :ui="{
            item: 'basis-1/2 max-lg:basis-full relative overflow-hidden overflow-hidden',
            prev: 'sm:start-8 rounded-lg! hover:opacity-75! disabled:opacity-0! disabled:pointer-events-none!',
            next: 'sm:end-8 rounded-lg! hover:opacity-75! disabled:opacity-0! disabled:pointer-events-none!',
            container: 'ms-0 max-h-100',
            root: 'rounded-lg! overflow-hidden'
        }"
    >
        <AtomsPreview class="relative rounded-lg!" :style="{ background: data?.bg }">
            <NuxtImg 
                :src="(src as string)"
                :alt="data?.name + ` image ${index}`" 
                class="transition-all select-none h-100 w-full object-contain object-center!" 
                :placeholder="Skeleton" 
                placeholder-class="animate-pulse blur-lg scale-150"
            />
        </AtomsPreview>
    </NuxtCarousel>
    <AtomsPreview v-else class="relative" :style="{ background: data?.bg }">
        <NuxtImg 
            :src="(data?.images?.[0] as string)"
            :alt="data?.name + ` image ${0}`" 
            class="transition-all select-none h-100 w-full object-contain object-center!" 
            :placeholder="Skeleton" 
            placeholder-class="animate-pulse blur-lg scale-150"
        />
    </AtomsPreview>


    <MoleculesSectionHeader pattern="graph-paper">
        <div>{{ t('sections.about_project') }}</div>
    </MoleculesSectionHeader>
    <section class="flex max-lg:flex-col-reverse gap-8 max-lg:gap-4">

        <div class="flex flex-col gap-4 grow">
            <NuxtImg :src="data?.thumbnail" :alt="data?.description" v-if="data?.thumbnail" class="w-full rounded-lg"/>
            <div class="flex items-center gap-4">
                <h1>{{ data?.name }}</h1>
                <div class="flex items-center gap-1 *:text-yellow-500" v-if="repo?.stars">
                    <span>{{ repo?.stars }}</span>
                    <NuxtIcon name="mingcute:star-fill"/>
                </div>
            </div>
            <MDC :value="data?.about" class="md *:mt-0! *:last:mt-0!"/>
            <p class="text-sm text-default/50" v-if="data?.copyright">{{ data?.copyright }}</p>
        </div>

        <div class="flex flex-col items-end max-lg:items-start gap-2 min-w-[30%]!">

            <NuxtBadge v-if="data?.status" :class="data?.images?.length ? `absolute top-8 right-8 max-lg:top-4 max-lg:right-4 z-2` : ''" variant="solid">{{ data?.status }}</NuxtBadge>

            <h3 class="text-lg!" v-if="data?.description">{{ t('labels.about') }}:</h3>
            <MDC v-if="data?.description" :value="data?.description" class="md *:m-0! *:text-sm! *:leading-4! text-default/50 *:text-right max-lg:*:text-left!"/>

            <h3 class="text-lg!" v-if="repo?.topics || data?.tags">{{ t('labels.tags') }}:</h3>
            <div class="flex flex-wrap gap-1 justify-end items-center" v-if="data?.tags">  
                <NuxtBadge v-for="tag in data?.tags" :key="tag" variant="outline" color="neutral">{{ tag }}</NuxtBadge>
            </div>
            <div class="flex flex-wrap gap-1 justify-end items-center" v-if="repo?.topics">  
                <NuxtBadge v-for="topic in repo?.topics" :key="topic" variant="outline" color="neutral">{{ topic }}</NuxtBadge>
            </div>

            <h3 class="text-lg!" v-if="data?.stack">{{ t('labels.stack') }}:</h3>
            <div id="stack" class="flex flex-wrap gap-1 justify-end items-center" v-if="data?.stack">  
                <NuxtBadge 
                    v-for="item in data?.stack" 
                    :key="item.name"
                    variant="outline" color="neutral"
                    :style="`--badge-color: ${item.color}`"
                    :ui="{ base: 'hover:bg-(--badge-color)/50 hover:ring-(--badge-color)!'}"
                >
                    {{ item.name }}
                </NuxtBadge>
            </div>
            
            <h3 class="text-lg!" v-if="data?.links">{{ t('labels.links') }}:</h3>
            <NuxtLink v-for="link in data?.links" :key="link" :to="link" class="flex items-center gap-1" v-if="data?.links">
                {{ link }}
            </NuxtLink>
        </div>
    </section>
    <template v-if="data.related?.length">
        <MoleculesSectionHeader pattern="graph-paper" id="projects">
            <div>{{ t('sections.related_projects') }}</div>
        </MoleculesSectionHeader>
        <section class="flex flex-col relative">
            <NuxtBlogPosts :ui="{ base: 'gap-4! p-8!' }">
                <NuxtBlogPost
                    v-for="project in (data.related || []).sort((a: any, b: any) => b.priority - a.priority)"
                    :key="project.name"
                    variant="outline"
                    :image="project.thumbnail"
                    @click="() => { router.push(`/${locale}/projects/${project.id}`) }"
                    :ui="{
                        header: 'border-b group-hover/blog-post:border-primary!', 
                        image: 'grayscale group-hover/blog-post:grayscale-0 group-hover/blog-post:scale-105! transition-all',
                        root: 'hover:ring-primary!',
                        body: 'p-3! flex flex-col gap-1',
                        description: 'm-0! flex flex-col gap-4 grow',
                        title: 'text-sm!'
                    }"
                >
                    <template #title>
                        <div class="flex items-center justify-between w-full gap-2">
                            <span>{{ project.name }}</span>
                        </div>
                    </template>
                    <template #description>
                        <MDC :value="project.description" class="md *:m-0! *:text-xs! *:leading-4! grow"/>
                        <div class="flex flex-wrap gap-1">  
                            <NuxtBadge v-for="tag in project.tags" :key="tag" variant="outline" color="neutral" size="sm">{{ tag }}</NuxtBadge>
                        </div>
                    </template>
                </NuxtBlogPost>
            </NuxtBlogPosts>
        </section>
    </template>
</template>