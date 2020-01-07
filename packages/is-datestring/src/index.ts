/**
 * Ambiguous datestring prevention -- return Date if simple
 *
 * Otherwise, throw named error
 */
export function maybeDatestring (s: string): string | Date {
  let m: RegExpExecArray | null = null

  if (typeof s !== 'string') {
    throw new Error(`Not a string: ${s} -- ${typeof s}`)
  }

  if (m = /(\d{4})(\d{2})(\d{2})?/.exec(s)) {
    return new Date(parseInt(m[1]), parseInt(m[2]), m[3] ? parseInt(m[3]) : 1)
  }

  if (/[-+]?(?:\d+(?:\.\d+)?|\.\d+)/.test(s)) {
    throw new Error(`Is an invalid Number string: ${s}`)
  }

  return s
}
