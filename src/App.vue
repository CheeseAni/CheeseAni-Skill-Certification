<script setup lang="ts">
import Certificate from '@/Certificate.vue'
import { CERTIFICATION, generate_cert, get_cert_description, type cert_后期_desc, type cert_时轴_desc, type 备注 } from '@/certification'
import { NButton, NH1, NInput, NInputGroup, NInputGroupLabel, NSpace, NText } from 'naive-ui'
import { computed, ref, watch } from 'vue'

const nav = navigator

const placeholder_id = "身份 ID"
const placeholder_staff = "Staff 名"
const placeholder_secret = "密钥"

const id = ref<string>("")
const staff = ref<string>("")
const secret = ref<string>("")

const input_hash = ref<[string, string, string]>(["", "", ""])
const input_hash_cache_generate = ref<string>("")
const input_hash_cache_verification = ref<string>("")
watch([id, staff, secret], async () => {
  input_hash_cache_generate.value = input_hash_cache_verification.value = ""
}, {
  immediate: true
})

export interface cert_type {
  时轴: cert_时轴_desc
  后期: cert_后期_desc
  备注: 备注 | undefined
}
const cert = computed<cert_type | null>(() => {
  const c = CERTIFICATION.get(input_hash.value[2])
  if (c === undefined) return null
  return {
    时轴: get_cert_description(c[0]),
    后期: get_cert_description(c[1]),
    备注: c[2],
  }
})


export interface id_info_type {
  id: string
  staff: string
  hash: string
}
const id_info = computed<id_info_type>(() => ({ id: id.value, staff: staff.value, hash: input_hash.value[2] }))
</script>

<template>
  <n-space vertical justify="center" style="padding: 1rem;">
    <n-h1 style="text-align: center;">CheeseAni 技能认证</n-h1>
    <n-space vertical align="center">
      <n-space>
        <n-input-group>
          <n-input-group-label>{{ placeholder_id }}</n-input-group-label>
          <n-input v-model:value="id" :placeholder="placeholder_id" />
        </n-input-group>
        <n-input-group>
          <n-input-group-label>{{ placeholder_staff }}</n-input-group-label>
          <n-input v-model:value="staff" :placeholder="placeholder_staff" />
        </n-input-group>
        <n-input-group>
          <n-input-group-label>{{ placeholder_secret }}</n-input-group-label>
          <n-input v-model:value="secret" type="password" show-password-on="click" :placeholder="placeholder_secret" />
        </n-input-group>
      </n-space>

      <n-space justify="center">
        <n-button @click="async () => {
          input_hash = await generate_cert(id, staff, secret)
          input_hash_cache_verification = input_hash[2]
          input_hash_cache_generate = ''
        }">查证</n-button>
        <n-button @click="async () => {
          input_hash = await generate_cert(id, staff, secret)
          input_hash_cache_generate = input_hash[2]
          input_hash_cache_verification = ''
        }">生成</n-button>
      </n-space>

      <div v-if="input_hash.join('')">
        <n-space v-if="input_hash[2] === input_hash_cache_generate" justify="center" align="center">
          <n-text>生成的 HASH:</n-text>
          <n-button v-for="h in input_hash" @click="() => {
            nav.clipboard.writeText(h)
          }" style="word-break: break-all;white-space: normal;height: fit-content;padding: 10px 14px;">{{ h
          }}</n-button>
        </n-space>

        <n-space vertical v-if="input_hash[2] === input_hash_cache_verification" justify="center" align="center">
          <n-text>验证:</n-text>
          <Certificate v-if="CERTIFICATION.has(input_hash[2])" :id_info=id_info :cert=cert></Certificate>
          <n-text v-else>无登记</n-text>
        </n-space>
      </div>
    </n-space>
  </n-space>
</template>