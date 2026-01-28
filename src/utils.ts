/**
 * 使用Web Crypto API生成字符串的SHA-256哈希
 * @param input 输入字符串
 * @returns SHA-256十六进制字符串
 * @throws 如果浏览器不支持Web Crypto API或生成失败
 */
export async function sha256(input: string): Promise<string> {
    // 编码输入字符串为UTF-8字节数组
    const encoder = new TextEncoder()
    const data = encoder.encode(input)

    // 生成SHA-256哈希
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)

    // 将ArrayBuffer转换为十六进制字符串
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

    return hashHex
}
