<script setup lang="ts">
    const { t, locale } = useI18n()
    const props = defineProps<{ data: IndexQuery, noTags?: boolean }>()
    const router = useRouter()

    const projectsFilters = ref<{ tags: string[] }>({ tags: [] })
    const { data: projects } = await useSanityDynamicQuery<ProjectsQuery>(groq`*[_type == "project" && (length($tags) == 0 || count(tags[@ in $tags]) > 0)] {
        id, tags, repo, priority,
        "name": name[$locale],
        "thumbnail": thumbnail[$theme].asset->url,
        "description": description[$locale]
    } | order(priority desc)`, projectsFilters)
        
    const projectsStars = projects.value ? Object.fromEntries(await Promise.all(projects.value.filter((project: any) => !!project.repo).map(async (project: any) => {
        const response = await useGithubRepository<any>(project.repo)
        return [project.repo, response?.stars]
    }))) : {}

    defineExpose({
        projectsCount: projects.value?.length
    })

</script>

<template>
    <section class="flex flex-col gap-8 relative" v-if="projects?.length">
        <div class="w-full flex items-center justify-between" v-if="data.projectTags?.length && !props.noTags">
            <span class="text-default/50 text-sm">{{ t('labels.tags') }}:</span>
            <div class="flex flex-wrap gap-1 justify-center items-center sm:justify-end">
                <NuxtButton 
                    v-for="tag in data.projectTags || []" 
                    :key="tag"
                    variant="outline" 
                    color="neutral" 
                    size="sm"
                    @click="() => { 
                        if (!projectsFilters.tags.includes(tag) && (projectsFilters.tags.length + 1) === data?.projectTags.length) { projectsFilters.tags = []; return }
                        if (projectsFilters.tags.includes(tag)) projectsFilters.tags.splice(projectsFilters.tags.findIndex(v => v === tag), 1)
                        else projectsFilters.tags.push(tag)
                    }"
                    :ui="{
                        base: projectsFilters.tags.includes(tag) && 'ring-primary!'
                    }"
                >
                    {{ tag }}
                </NuxtButton>
            </div>
        </div>
        <NuxtBlogPosts class="" :ui="{ base: 'gap-4!' }">
            <NuxtBlogPost
                v-for="project in (projects || []).sort((a: any, b: any) => b.priority - a.priority)"
                :key="project.name"
                variant="outline"
                :image="project.thumbnail"
                @click="() => { router.push(`/${locale}/projects/${project.id}`) }"
                :ui="{
                    header: 'border-b group-hover/blog-post:border-primary!', 
                    image: 'sepia group-hover/blog-post:sepia-0 group-hover/blog-post:scale-105! transition-all',
                    root: 'hover:ring-primary!',
                    body: 'p-3! flex flex-col gap-1',
                    description: 'm-0! flex flex-col gap-4 grow',
                    title: 'text-sm!'
                }"
            >
                <template #title>
                    <div class="flex items-center justify-between w-full gap-2">
                        <span>{{ project.name }}</span>
                        <div class="flex items-center gap-1 *:text-yellow-500" v-if="projectsStars[project.repo]">
                            <NuxtIcon name="mingcute:star-fill"/>
                            <span>{{ projectsStars[project.repo] }}</span>
                        </div>
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