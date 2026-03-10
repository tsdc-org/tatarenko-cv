<script setup lang="ts">
    import type { HTMLAttributes } from 'vue';
    import SectionHeader from '../molecules/SectionHeader.vue';
    import Captcha from '@hcaptcha/vue3-hcaptcha';
    import countryCodes from '~/assets/json/phone-codes.json'
    import { vMaska } from 'maska/vue'

    const { t, locale } = useI18n()
    const toast = useToast()
    const config = useRuntimeConfig().public.config
    const theme = useColorMode()
    const props = defineProps<{ id?: string, class?: HTMLAttributes['class'] }>()
    const captcha = useTemplateRef('captcha')

    const open = ref<boolean>(false)

    const form = ref<{
        name?: string, 
        email?: string,
        phone?: string,
        telegram?: string
        description?: string
    }>({})

    const regexp = {
        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    }

    const phone = ref<{ code: typeof countryCodes[number], number?: string }>({
        code: countryCodes.find(v => v.code === 'RU')!,
        number: undefined
    }); watch(phone, () => {
        const concatenated = `${phone.value.code.dialCode} ${phone.value.number}`
        const expected = `${phone.value.code.dialCode} ${phone.value.code.mask}`
        form.value.phone = concatenated.length === expected.length ? `${phone.value.code.dialCode} ${phone.value.number}` : undefined
    }, { deep: true })
    const email = ref<string>(); watch(email, () => {
        form.value.email = regexp.email.test(email.value || '') ? email.value : undefined
    }, { deep: true })

    const errors = computed(() => {
        const stack = []
        if (!form.value.name) stack.push('form.errors.name_required')
        if (!form.value.email && !form.value.phone && !form.value.telegram) stack.push('form.errors.one_contact_required')
        return stack
    })

    const loading = ref<boolean>(false)
    const submit = async () => { loading.value = true; try {
        const token = (await captcha.value?.executeAsync())?.response
        if (!token) { 
            toast.add({ title: t('labels.error'), description: t('form.errors.invalid_captcha') })
            captcha.value?.reset()
            return
        } 
        $fetch('/api/request', { method: 'post', body: { ...form.value, token } })
        toast.add({ title: t('labels.success'), description: t('form.success') })
        form.value = {}; email.value = undefined; phone.value.number = undefined; open.value = false
    } catch (e) { toast.add({ title: t('labels.error'), description: String(e) }) } finally { loading.value = false }}

</script>

<template>
    <NuxtButton size="xl" class="print:hidden w-fit" :class @click="open = !open">{{ t('labels.contact_me') }}</NuxtButton>
    <NuxtModal v-model:open="open" class="max-w-[50dvw] max-lg:max-w-dvw! max-lg:max-h-dvh! max-lg:w-dvw! max-lg:h-dvh! max-lg:ring-0!" :title="t('sections.lets_talk')" :ui="{ title: 'text-lg!' }">
        <template #body>
            
            <section class="grid grid-cols-2 max-lg:grid-cols-1 gap-4 max-h-[70dvh] max-lg:max-h-full overflow-y-auto max-lg:auto-rows-min grow h-full">
                <NuxtFormField :label="t('form.name.label')" required class="w-full">
                    <NuxtInput :placeholder="t('form.name.placeholder')" class="w-full" v-model="form.name"/>
                </NuxtFormField>
                <NuxtFormField :label="t('form.email.label')" class="w-full">
                    <NuxtInput 
                        type="email" 
                        placeholder="example@mail.com" 
                        class="w-full" 
                        :highlight="!!email && regexp.email.test(email)" :color="!email || regexp.email.test(email) ? 'primary' : 'error'"
                        v-model="email"
                    />
                </NuxtFormField>
                <NuxtFormField :label="t('form.phone.label')" class="w-full">
                    <NuxtFieldGroup class="w-full">
                        <NuxtSelectMenu 
                            :items="countryCodes" 
                            v-model="phone.code" 
                            :search-input="{ ui: { root: 'hidden' } }"
                            :content="{ align: 'start' }"
                            :ui="{ base: 'pe-8', content: 'w-48', placeholder: 'hidden', trailingIcon: 'size-4', item: 'flex items-center hover:opacity-75', itemTrailingIcon: 'scale-50' }"
                            trailing-icon="mingcute:selector-vertical-line"
                        >
                            <span class="flex items-center">
                                {{ phone.code?.emoji || '\u{1F1FA}\u{1F1F8}' }}
                            </span>

                            <template #item-leading="{ item }">
                                <span class="size-4 flex items-center">
                                    {{ item.emoji }}
                                </span>
                            </template>

                            <template #item-label="{ item }">
                                <span class="text-sm">{{ item.name }} <span class="text-default/50">({{ item.dialCode }})</span></span>
                            </template>
                        </NuxtSelectMenu>
                        <NuxtInput 
                            :placeholder="phone.code.mask.replaceAll('#', '_')" 
                            class="w-full" 
                            :style="{ '--dial-code-length': `${phone.code.dialCode.length + 2.5}ch` }"
                            :ui="{
                                base: 'ps-(--dial-code-length)',
                                leading: 'pointer-events-none text-base md:text-sm text-muted'
                            }"
                            v-maska="phone.code.mask" 
                            v-model="phone.number"
                        >
                            <template #leading>
                                <span class="text-default/50">{{ phone.code.dialCode }}</span>
                            </template>
                        </NuxtInput>
                    </NuxtFieldGroup>
                    
                </NuxtFormField>
                <NuxtFormField :label="t('form.telegram.label')" class="w-full">
                    <NuxtInput placeholder="nickname" class="w-full"  v-model="form.telegram" :ui="{ base: 'ps-[3ch]'}">
                        <template #leading>
                            <span class="text-default/50">@</span>
                        </template>
                    </NuxtInput>
                </NuxtFormField>
                <NuxtFormField :label="t('form.description.label')" class="w-full min-lg:col-span-2">
                    <NuxtTextarea autoresize class="w-full" :placeholder="t('form.description.placeholder')" :maxlength="1000" v-model="form.description" :ui="{ trailing: 'items-end!', base: 'pr-2! pb-6' }">
                        <template #trailing>
                            <span class="text-xs!" :class="form.description?.length === 1024 ? 'text-error' : 'text-default/50'">{{ form.description?.length || 0 }} / {{ 1024 }}</span>
                        </template>
                    </NuxtTextarea>
                </NuxtFormField>

                <p class="min-lg:col-span-2 text-xs *:text-xs! text-default/50 flex-inline gap-1">
                    {{ t('form.legal.leading') }} 
                    <NuxtLink target="_blank" :to="`/${locale}/legal/privacy`">{{ t('form.legal.privacy') }}</NuxtLink>
                    {{ t('form.legal.and') }} 
                    <NuxtLink target="_blank" :to="`/${locale}/legal/processing`">{{ t('form.legal.processing') }}</NuxtLink>
                </p>
                <div class="flex flex-col gap-1 *:text-xs! text-error min-lg:col-span-2" v-if="errors?.length">
                    <span v-for="error in errors" class="flex items-center gap-2">
                        <NuxtIcon name="mingcute:close-circle-line" class="size-3"/>
                        {{ t(error) }}
                    </span>
                </div>
            </section>
        </template>
        <template #footer>
            <NuxtButton :loading :disabled="!!errors?.length" @click="submit">{{ t('form.button.submit') }}</NuxtButton>
            <NuxtButton @click="open = false" variant="outline" color="neutral" class="z-5 sm:hidden">{{ t('form.button.cancel') }}</NuxtButton>
        </template>
    </NuxtModal>
    <Teleport to="body">
        <Captcha
            ref="captcha"
            :sitekey="config.captcha.key"
            size="invisible"
            :language="locale"
            :theme="theme.value"
        />
    </Teleport>
</template>
