import { hash } from "@/utils"
import { NA } from "naive-ui"
import { h, type VNode } from "vue"

declare const brand: unique symbol

export const enum cert_时轴 {
    未评级 = 10,
    初级 = 11,
    中级 = 12,
    高级 = 13,
}

export const enum cert_后期 {
    未评级 = 20,
    初级 = 21,
    中级 = 22,
    高级 = 23,
}

export interface cert_desc {
    position: '时轴' | '后期'
    name: string
    level: number
}
export type cert_时轴_desc = cert_desc & { readonly [brand]: 'cert_时轴' }
export type cert_后期_desc = cert_desc & { readonly [brand]: 'cert_后期' }
function create_时轴Desc(input: cert_desc): cert_时轴_desc {
    return input as cert_时轴_desc
}
function create_后期Desc(input: cert_desc): cert_后期_desc {
    return input as cert_后期_desc
}

export function get_cert_description(cert: cert_时轴): cert_时轴_desc
export function get_cert_description(cert: cert_后期): cert_后期_desc
export function get_cert_description(cert: cert_时轴 | cert_后期): cert_时轴_desc | cert_后期_desc {
    switch (cert) {
        // 时轴
        case cert_时轴.未评级: return create_时轴Desc({ position: '时轴', name: '未评级', level: 0 })
        case cert_时轴.初级: return create_时轴Desc({ position: '时轴', name: '初级', level: 1 })
        case cert_时轴.中级: return create_时轴Desc({ position: '时轴', name: '中级', level: 2 })
        case cert_时轴.高级: return create_时轴Desc({ position: '时轴', name: '高级', level: 3 })
        // 后期
        case cert_后期.未评级: return create_后期Desc({ position: '后期', name: '未评级', level: 0 })
        case cert_后期.初级: return create_后期Desc({ position: '后期', name: '初级', level: 1 })
        case cert_后期.中级: return create_后期Desc({ position: '后期', name: '中级', level: 2 })
        case cert_后期.高级: return create_时轴Desc({ position: '后期', name: '高级', level: 3 })
    }
}

export type 备注 = (string | VNode) & { readonly [brand]: '备注' }
function create_备注(str: string | VNode): 备注 {
    return str as 备注
}

/**
 * @returns [id_hash, others_hash, cert]
 */
export async function generate_cert(id: string, staff: string, secret: string): Promise<[string, string, string]> {
    if (secret === "null")
        return [id, staff, staff === id ? staff : `${staff}@${id}`]

    const id_hash = await hash(await hash(id, "SHA-256", 8), "SHA-1")
    const staff_hash = await hash(staff, "SHA-512", 8)
    const secret_hash = await hash(secret, "SHA-512", Boolean(secret) ? 20 : 0)

    const others_hash = await hash(staff_hash + secret_hash, "SHA-1")

    return [id_hash, others_hash, await hash(id_hash + others_hash, 'SHA-1')]
}

namespace remark_entry {
    let url
    url = "https://github.com/op200"
    export const op200 = create_备注(h(NA, { href: url }, url))
}

export const CERTIFICATION = new Map<string, [cert_时轴, cert_后期, 备注?]>([
    ['01aca5c1dfc95e074ca5e816cdb9adc4666458de', [cert_时轴.中级, cert_后期.未评级, create_备注("这是测试登记")]],
    ['op200', [cert_时轴.高级, cert_后期.高级, remark_entry.op200]], // 明文
    ['da401055198422578498dbbd878187318d308a27', [cert_时轴.高级, cert_后期.高级, remark_entry.op200]], // 无密钥
])