<script setup lang="ts">
    import bytes from 'bytes'

    const props = defineProps<{ endpoint?: string }>()
    const container = useTemplateRef('container')
    const length = ref(0)

    let observer: MutationObserver

    onMounted(() => {
        if (!container.value) return
        const update = () => length.value = new TextEncoder().encode(container.value!.textContent).length; update()
        observer = new MutationObserver(update); 
        observer.observe(container.value, { childList: true, subtree: true, characterData: true })
        onBeforeUnmount(() => observer?.disconnect())
    })
</script>

<template>
    <div class="grow! *:m-0! p-3! text-sm backdrop-blur-lg border-text border rounded-lg" ref="container">
        <MDCSlot class=""/>
    </div>
</template>