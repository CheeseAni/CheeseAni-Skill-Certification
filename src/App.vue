<script setup lang="ts">
import Certificate from '@/Certificate.vue'
import { CERTIFICATION, generate_cert, get_cert_description, type cert_后期_desc, type cert_时轴_desc, type 备注 } from '@/certification'
import { NA, NButton, NH1, NInput, NInputGroup, NInputGroupLabel, NSpace, NSpin, NText } from 'naive-ui'
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'

const nav = navigator

const url_params: Map<string, string> = new Map()
onBeforeMount(() => {
  for (const [key, val] of (new URLSearchParams(window.location.search)).entries())
    url_params.set(key, val)
})

const placeholder_id = "ID"
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

const in_generate_cert = ref<boolean>(false)
async function verify() {
  in_generate_cert.value = true
  input_hash.value = await generate_cert(id.value, staff.value, secret.value)
  input_hash_cache_verification.value = input_hash.value[2]
  input_hash_cache_generate.value = ''
  in_generate_cert.value = false
}
async function generate_hash() {
  in_generate_cert.value = true
  input_hash.value = await generate_cert(id.value, staff.value, secret.value)
  input_hash_cache_generate.value = input_hash.value[2]
  input_hash_cache_verification.value = ''
  in_generate_cert.value = false
}

onMounted(() => {
  id.value = url_params.get("id") || ""
  staff.value = url_params.get("staff") || ""
  secret.value = url_params.get("secret") || ""
  switch (url_params.get("do")) {
    case "verify":
      verify()
      break
    case "generate":
      generate_hash()
      break
  }
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
  secret: string
}
const id_info = computed<id_info_type>(() => ({ id: id.value, staff: staff.value, secret: secret.value }))
const plaintext = computed<boolean>(() => secret.value === 'null')

const is_verify_pass = ref<boolean>(false)
watch(input_hash_cache_verification, async () => {
  is_verify_pass.value = (
    CERTIFICATION.has(input_hash_cache_verification.value)
    || (plaintext.value && CERTIFICATION.has((await generate_cert(id.value, staff.value, 'null'))[2]))
  )
})

const auto_fill_url = computed(() => `${window.location.pathname}?id=${id.value}&staff=${staff.value}&secret=${secret.value}`)
</script>

<template>
  <n-space vertical justify="center" style="margin: 0 1rem;">
    <n-h1 style="text-align: center;margin: 1rem;">CheeseAni 技能认证</n-h1>
    <n-space vertical align="center" size="large">
      <n-space>
        <n-input-group>
          <n-input-group-label>{{ placeholder_id }}</n-input-group-label>
          <n-input v-model:value=id :placeholder=placeholder_id clearable />
        </n-input-group>
        <n-input-group>
          <n-input-group-label>{{ placeholder_staff }}</n-input-group-label>
          <n-input v-model:value=staff :placeholder=placeholder_staff clearable />
        </n-input-group>
        <n-input-group>
          <n-input-group-label>{{ placeholder_secret }}</n-input-group-label>
          <n-input v-model:value=secret :type="plaintext ? 'text' : 'password'" show-password-on="click"
            :placeholder=placeholder_secret clearable :status="plaintext ? 'warning' : undefined" />
          <n-button :disabled=plaintext @click="secret = 'null'" :secondary=plaintext
            :type="plaintext ? 'primary' : 'default'">{{ plaintext ? '' :
              '设为'
            }}明文</n-button>
        </n-input-group>
      </n-space>

      <n-space justify="center">
        <n-button @click="verify">查证</n-button>
        <n-button @click="generate_hash">生成</n-button>
      </n-space>

      <n-spin size="large" v-if=in_generate_cert />

      <div v-else v-if="input_hash.join('')">
        <n-space v-if="input_hash[2] === input_hash_cache_generate" justify="center" align="center">
          <n-text>生成的 HASH:</n-text>
          <n-button v-for="h in input_hash" @click="nav.clipboard.writeText(h)"
            style="word-break: break-all;white-space: normal;height: fit-content;padding: 0.7em 0.9em;">{{ h
            }}</n-button>
          <n-a :href=auto_fill_url>自动填写链接</n-a>
        </n-space>

        <n-space vertical v-if="input_hash[2] === input_hash_cache_verification" justify="center" align="center">
          <n-text>验证:</n-text>
          <Certificate v-if="is_verify_pass" :info=id_info :cert=cert :cert_hash="input_hash_cache_verification" />
          <n-text v-else>无登记</n-text>
        </n-space>
      </div>
    </n-space>
  </n-space>
</template>