/**
 * Ambiguous datestring prevention -- return safe string in ISO format if simple
 *
 * Otherwise, throw named error
 */
export function maybeDatestring (s: string): string {
  let m: RegExpExecArray | null = null

  if (typeof s !== 'string') {
    throw new Error(`Not a string: ${s} -- ${typeof s}`)
  }

  if (m = /(\d{4})(\d{2})(\d{2})?/.exec(s)) {
    return `${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}-${(m[3] || '1').padStart(2, '0')}`
  }

  if (/[-+]?(?:\d+(?:\.\d+)?|\.\d+)/.test(s)) {
    throw new Error(`Is an invalid Number string: ${s}`)
  }

  return s
}
