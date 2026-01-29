async function _hash(input: string, algorithm: AlgorithmIdentifier = "SHA-256") {
    // 编码输入字符串为UTF-8字节数组
    const encoder = new TextEncoder()
    const data = encoder.encode(input)

    // 生成SHA-256哈希
    const hashBuffer = await crypto.subtle.digest(algorithm, data)

    // 将ArrayBuffer转换为十六进制字符串
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

    return hashHex
}
export async function hash(input: string, algorithm: AlgorithmIdentifier = "SHA-256", cost: number = 0): Promise<string> {
    const time = 2 ** cost

    let res: string = await _hash(input, algorithm)
    for (let i = 1; i < time; ++i)
        res = await _hash(res, algorithm)

    return res
}
