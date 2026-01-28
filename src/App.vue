<script setup lang="ts">
import { NButton, NH1, NInput, NInputGroup, NInputGroupLabel, NSpace, NText, NFlex } from 'naive-ui'
import { computed, ref, watch } from 'vue'
import { sha256 } from '@/utils'
import { skill, CERTIFICATION } from '@/store'

const nav = navigator

const placeholder_id = "身份 ID"
const placeholder_staff = "Staff 名"
const placeholder_password = "密钥"

const id = ref()
const staff = ref()
const password = ref()

const input_hash = ref<string>("")
const input_hash_cache_generate = ref()
const input_hash_cache_verification = ref()
watch([id, staff, password], async () => {
  input_hash.value = await sha256(id.value + staff.value + password.value)
})
</script>

<template>
  <n-space vertical justify="center">
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
          <n-input-group-label>{{ placeholder_password }}</n-input-group-label>
          <n-input v-model:value="password" type="password" show-password-on="click"
            :placeholder="placeholder_password" />
        </n-input-group>
      </n-space>

      <n-space justify="center">
        <n-button @click="() => {
          input_hash_cache_verification = input_hash
        }">验证</n-button>
        <n-button @click="() => {
          input_hash_cache_generate = input_hash
        }">生成</n-button>
      </n-space>

      <n-space v-if="input_hash && input_hash === input_hash_cache_generate" justify="center" align="center">
        <n-text>生成的 HASH:</n-text>
        <n-button @click="() => {
          nav.clipboard.writeText(input_hash)
        }">{{ input_hash }}</n-button>
      </n-space>

      <n-space vertical v-if="input_hash && input_hash === input_hash_cache_verification" justify="center"
        align="center">
        <n-text>验证:</n-text>
        <n-text v-if="CERTIFICATION.has(input_hash)">{{ CERTIFICATION.get(input_hash) }}</n-text>
        <n-text v-else>验证失败</n-text>
      </n-space>
    </n-space>
  </n-space>
</template>