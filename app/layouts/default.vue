<script setup lang="ts">
    import Logo from '~/assets/svg/logo.svg?raw'
    import LogoMini from '~/assets/svg/logo-mini.svg?raw'
    import { useMouse, useRafFn, useScroll } from '@vueuse/core';  
    import { useSpring } from '@vueuse/motion'
    import * as locales from '@nuxt/ui/locale'

    const { locale, setLocale, locales: i18nLocales, t } = useI18n()
    const theme = useColorMode()
    const scroll = useScroll(document)
    const header = computed(() => window ? parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--ui-header-height')) : 0)
    const config = useRuntimeConfig().public.config

    const { data } = await useSanityDynamicQuery(groq`{
        "footer": {
            "legal": *[_type == "summary"][0].legal[$locale],
            "links": *[_type == "link"] {
                "label": short[$locale],
                "to": to
            }
        },
        "person": {
            "title": *[_type == "summary"][0].title[$locale],
            "description": *[_type == "summary"][0].description[$locale],
            "image": *[_type == "summary"][0].image.asset->url,
            "email": *[_type == "link" && id == "email"][0].label[$locale],
            "phone": *[_type == "link" && id == "phone"][0].label[$locale],
            "links": *[_type == "link"].to,
            "workplace": (*[_type == "experience"] | order(positions[0].duration.from desc) {
                link,
                "logo": logo[$theme].asset->url,
                "name": name[$locale],
                "d": positions[0].duration.from
            })[0],
            "skills": *[_type == "skill"]{
                name
            },
            "experience": *[_type == "experience"] {
                id, link,
                "name": name[$locale],
                "logo": logo[$theme].asset->url,
                "about": about[$locale],
                "positions": positions[]{
                    "name": name[$locale],
                    "description": description[$locale],
                    "skills": skills[]->{
                        name
                    } | order(priority desc),
                    duration,
                } | order(duration.from desc),
            } | order(positions[0].duration.from desc),
            "education": *[_type == "education"] {
                link,
                "name": name[$locale],
                "faculty": faculty[$locale],
            } | order(year desc)
        },
        "projects": *[_type == "project"] {
            id, priority,
            "name": name[$locale],
            "thumbnail": thumbnail[$theme].asset->url,
            "stack": stack[]->{
                name, type, color, priority
            } | order(priority desc),
            "description": description[$locale]
        } | order(priority desc),
    }`)

    if (data.value) useSeoMeta({
        titleTemplate: chunk => `${data.value?.person?.title}${chunk ? ` — ${chunk}` : ``}`,
        themeColor: config.theme.background[theme.value as 'dark' | 'light'],
    })

    if (data.value) useSchemaOrg([
        definePerson({
            name: config.schema.person.fullname,
            givenName: config.schema.person.firstname,
            familyName: config.schema.person.lastname,
            alternateName: config.schema.person.initials,
            image: data.value.person.image,
            description: data.value.person.description,
            jobTitle: config.schema.person.position,
            telephone: data.value.person.phone,
            email: data.value.person.email,
            url: config.head.url,
            sameAs: data.value.person.links,
            worksFor: defineOrganization({
                name: data.value.person.workplace.name,
                url: data.value.person.workplace.link,
                logo: data.value.person.workplace.logo
            }),
            knowsAbout: data.value.person.skills?.flatMap((skill: any) => ({
                "@type": 'Thing',
                name: skill.name
            })) || [],
            hasOccupation: data.value.person.experience.map((company: any) => company.positions.map((position: any) => ({
                "@type": 'Occupation',
                name: position.name,
                description: company.about,
                responsibilities: position.description,
                skills: position.skills.map((skill: any) => skill.name),
                startDate: position.duration.from,
                endDate: position.duration.to || undefined,
                organization: defineOrganization({
                    name: company.name,
                    url: company.link || undefined,
                    logo: company.logo || undefined
                })
            }))),
            "alumniOf": data.value.education?.map((education: any) => ({
                "@type": "EducationalOrganization",
                name: education.name,
                department: education.faculty,
                sameAs: education.link || undefined,
            })),
        }),
        defineItemList({
            name: 'Проекты',
            itemListElement: data.value.projects.sort((a: any, b: any) => b.priority - a.priority).map((project: any, index: number) => ({
                "@type": project.repo ? 'SoftwareSourceCode' : 'CreativeWork',
                position: index + 1,
                name: project.name,
                codeRepository: project.repo ? `https://github.com/${project.repo}` : undefined,
                url: `${config.head.url}/ru/projects/${project.id}`,
                thumbnailUrl: project.thumbnail,
                description: project.description
            }))
        }),
        defineOrganization({
            name: config.schema.organization.name,
            legalName: config.schema.organization.legalName,
            legalAddress: config.schema.organization.legalAddress,
            url: config.schema.organization.url,
            email: config.schema.organization.email,
            logo: config.schema.organization.logo,
            telephone: config.schema.organization.phone
        })
    ])

    const mouse = useMouse()
    const pos = reactive({ x: 0, y: 0 })

    useRafFn(() => {
        pos.x += (mouse.x.value - pos.x) * 0.15
        pos.y += (mouse.y.value - pos.y) * 0.15
    })
 
    
</script>

<template>
    <div class="w-dvw h-dvh fixed pointer-events-none *:pointer-events-none -z-3 isolate">
        <AtomsPattern
            name="topography"
            class="w-dvw h-dvh absolute top-0 left-0 opacity-20 max-lg:hidden"
            :style="{ '--x': `${pos.x}px`, '--y': `${pos.y - scroll.y.value}px` }"
            style="
                --pattern-color: var(--ui-primary);
                mask-image: radial-gradient(
                    circle 300px at var(--x) var(--y),
                    black 0%,
                    black 40%,
                    transparent 100%
                );
            "
        />
        
    </div>
    <NuxtHeader class="transition-colors duration-500" :ui="{ container: 'max-w-dvw', root: `${header >= scroll.y.value && 'border-bg!'} max-lg:border-default!` }">
        <template #left>
            <NuxtLink to="/" v-html="Logo" class="scale-150 origin-left"/>
        </template>
        <template #toggle>
            <NuxtColorModeButton variant="subtle" :ui="{ base: 'hover:opacity-75! transition-opacity' }"/>
            <NuxtLocaleSelect
                v-if="locales"
                :model-value="locale"
                :locales="Object.values(locales).filter((nuxtLocale) => i18nLocales.find((i18nLocale) => i18nLocale.code === nuxtLocale.code))"
                @update:model-value="setLocale($event as 'ru')"
                :ui="{
                    base: 'hover:opacity-75! transition-opacity',
                    item: 'hover:opacity-75! transition-opacity',
                    itemTrailingIcon: 'scale-50'
                }"
            />
        </template>
    </NuxtHeader>
    <NuxtContainer class="flex flex-col min-h-(--ui-viewport-height) p-8 max-lg:p-4">
        <div class="min-w-full min-h-full grow relative flex flex-col">
            <div class="w-full" id="container"/>
            <div class="w-full h-full grow flex flex-col gap-8">
                <slot/>
            </div>
        </div>
    </NuxtContainer>
    <NuxtFooter :ui="{ container: 'lg:items-start!', right: 'lg:h-full! grow!', left: 'items-start! justify-start!s' }" v-if="data?.footer">
        <template #left>
            <div class="flex flex-col gap-4 *:text-[10px]! *:text-default/50 *:leading-5 max-w-100">
                <div class="flex flex-col">
                    <span>
                        {{ config.schema.organization.legalName }} {{ t('labels.inn') }} {{ config.schema.organization.inn }} {{ t('labels.ogrn') }} {{ config.schema.organization.ogrn }}
                    </span>
                    <div class="flex w-full gap-1 flex-wrap opacity-50">
                        <div class="flex items-center gap-1 flex-wrap group *:text-[10px]!" v-for="link in data.footer.links">
                            <NuxtLink :to="link.to" target="_blank">{{ link.label }}</NuxtLink>
                            <span class="group-last:hidden">*</span>
                        </div>
                    </div>
                </div>

                <MDC :value="data.footer.legal" class="md *:m-0! *:leading-5" />
            </div>
        </template>
        <template #right>
            <div class="flex flex-col items-end h-full gap-2 max-lg:items-center">
                <NuxtLink to="/" v-html="LogoMini"/>
                <span class="text-[10px]! text-default/50">{{ config.head.author }} @ {{ new Date().getFullYear() }}</span>
            </div>
        </template>
    </NuxtFooter>
</template>
