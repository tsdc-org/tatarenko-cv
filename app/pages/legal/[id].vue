<script setup lang="ts">
    import useMarkdownRemoval from 'remove-markdown'
    const route = useRoute()

    const params = ref({ id: route.params.id?.toString() }); watch(() => route.params.id, () => params.value.id = route.params.id?.toString())
    const { data } = await useSanityDynamicQuery<any>(groq`*[_type == "legal" && id == $id] {
        "seo": *[_type == "summary"][0] {
            "title": title[$locale], 
        },
        "title": title[$locale],
        "description": description[$locale],
        "content": content[$locale],
    }[0]`, params);

    if (!data.value) throw createError({ status: 404, message: `"${route.params.id?.toString()}" Document not found` })

    useSeoMeta({
        title: data.value?.title,
        ogTitle: `${data.value?.seo.title} — ${data.value?.title}`,
        description: useMarkdownRemoval(data.value?.description),
        ogDescription: useMarkdownRemoval(data.value?.description)
    })
</script>

<template>
    <MoleculesSectionHeader pattern="plus" no-contact>
        {{ data.title }}
    </MoleculesSectionHeader>
    <section class="flex flex-col gap-4">
        <p class="text-sm! text-default/50">{{ data.description }}</p>
        <MDC :value="data.content" class="md *:mt-0!"/>
    </section>
</template>