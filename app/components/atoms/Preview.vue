<script setup lang="ts">
    const visible = ref(false)
    const pushed = ref<boolean>(false)

    const actions = {
        open: () => {
            visible.value = true
            if (!pushed.value) {
                history.pushState({ fullscreen: true }, '')
                pushed.value = true
            }
        },
        close:  () => {
            visible.value = false
            if (pushed.value) {
                history.back()
                pushed.value = false
            }
        },
        event: (e: PopStateEvent) => {
            if (visible.value) {
                visible.value = false
                pushed.value = false
            }
        }
    }

    onMounted(() => window.addEventListener('popstate', actions.event))
    onBeforeUnmount(() => window.removeEventListener('popstate', actions.event))
</script>

<template>
    <div>
        <div @click="actions.open" class="inline-block w-full h-full">
            <slot />
        </div>
        <Teleport to="body">
            <Transition name="zoom-fade">
                <div v-if="visible" @click="actions.close" class="transition-all duration-500 fixed inset-0 bg-default/25 backdrop-blur-lg flex items-center justify-center z-50">
                    <NuxtButton icon="mingcute:close-line" variant="outline" color="neutral" class="absolute top-4 right-4 w-8 h-8"/>
                    <div class="max-w-full max-h-full *:w-full *:h-full w-full h-full">
                        <slot />
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<style scoped>
    .zoom-fade-enter-active,
    .zoom-fade-leave-active {
        transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
    }
    .zoom-fade-enter-from,
    .zoom-fade-leave-to {
        opacity: 0;
        transform: scale(1.1);
    }
    .zoom-fade-enter-to,
    .zoom-fade-leave-from {
        opacity: 1;
        transform: scale(1);
    }
</style>