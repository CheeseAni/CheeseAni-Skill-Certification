<script setup lang="ts">
import { type cert_type, type id_info_type } from '@/App.vue'
import type { cert_desc } from '@/certification'
import { NA, NCard, NDescriptions, NDescriptionsItem, NRate, NSpace, NText } from 'naive-ui'
import { computed, h, onMounted, ref, render, type VNode } from 'vue'

const props = defineProps<{
    info: id_info_type
    cert: cert_type | null
}>()

const vnode_备注 = ref<VNode>(h("div"))

const desc_items = ref<cert_desc[]>([])
const desc_items_name_minwidth = computed<number>(() => Math.max(...desc_items.value.map(cd => cd.name.length)))
onMounted(() => {
    desc_items.value = [props.cert?.时轴, props.cert?.后期].filter(cd => cd !== undefined)

    // 生成备注
    const 备注 = props.cert?.备注
    if (备注 !== undefined)
        if (typeof 备注 === "string")
            vnode_备注.value = h(NText, null, 备注)
        else
            vnode_备注.value = 备注
})

const auto_verify_url = computed(() => `${window.location.pathname}?do=verify&id=${props.info.id}&staff=${props.info.staff}&secret=${props.info.secret}`)
</script>

<template>
    <n-space vertical v-if="cert !== null">
        <n-card :title="info.staff">
            <template #header-extra>
                <span style="width: 2rem;"></span>
                <n-text>{{ info.id }}</n-text>
            </template>

            <n-descriptions label-placement="left" :bordered=true :column=1>
                <n-descriptions-item v-for="cd in desc_items" :label="cd.position">
                    <n-space justify="space-between">
                        <n-text :style="`display: inline-block;min-width: ${desc_items_name_minwidth}em;`">{{ cd.name
                        }}</n-text>
                        <n-rate readonly :default-value="cd.level" :count=3 />
                    </n-space>
                </n-descriptions-item>
            </n-descriptions>

            <template #footer>
                <component :is="vnode_备注"></component>
            </template>
        </n-card>

        <n-space justify="center">
            <n-a :href=auto_verify_url>自动查证链接</n-a>
        </n-space>
    </n-space>

    <n-text v-else type="error">代码逻辑错误</n-text>
</template>