import nanoid from 'nanoid/generate'

export function guid () {
  return nanoid([
    Array.from({ length: 26 }).map((_, i) => String.fromCharCode(i + 65)).join(''),
    Array.from({ length: 26 }).map((_, i) => String.fromCharCode(i + 97)).join(''),
  ].join(''), 10)
}
