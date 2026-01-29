<script setup lang="ts">
import { type cert_type, type id_info_type } from '@/App.vue'
import type { cert_desc } from '@/certification'
import { NCard, NDescriptions, NDescriptionsItem, NRate, NSpace, NText } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
    id_info: id_info_type
    cert: cert_type | null
}>()

const desc_items = ref<cert_desc[]>([])
const desc_items_name_minwidth = computed<number>(() => Math.max(...desc_items.value.map(cd => cd.name.length)))
onMounted(() => {
    desc_items.value = [props.cert?.时轴, props.cert?.后期].filter(cd => cd !== undefined)
})
</script>

<template>
    <n-card :title="id_info.staff" v-if="cert !== null">
        <template #header-extra>
            <span style="width: 2rem;"></span>
            <n-text>{{ id_info.id }}</n-text>
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
            <n-text>{{ cert.备注 }}</n-text>
        </template>
    </n-card>
    <n-text v-else type="error">代码逻辑错误</n-text>
</template>