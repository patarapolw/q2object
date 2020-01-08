import deepfind from '@patarapolw/deepfind'

import { guid } from './guid'

export default class TreeParser {
  opReStr = '(?:=|:|>=?|<=?)'
  // eslint-disable-next-line quotes
  vReStr = `([^'" =<>]+|"[^"]+"|'[^']+')`

  exprRe = new RegExp(`(?<sign>-)?(?:(?<k>${this.vReStr})(?<op>${this.opReStr}))?(?<v>${this.vReStr})`, 'gi')

  topLevelOp = [
    'OR',
  ]

  bracketsMap = {
    '{': '}',
    '(': ')',
    '[': ']',
  }

  parse (q: string): Record<string, any> {
    q = q.trim()

    if (Object.keys(this.bracketsMap).some((a) => q.includes(a))) {
      const stack: string[] = []
      const contentStack: {
        id: string
        content: string
      }[] = []
      const closingBrackets = Object.values(this.bracketsMap)

      for (const c of q) {
        if ((this.bracketsMap as any)[c]) {
          stack.push(c)
          const id = guid()
          const last = contentStack[contentStack.length - 1]
          if (last) {
            last.content += id
          }

          contentStack.push({ id, content: '' })
        }

        const last = contentStack[stack.length - 1]
        if (last) {
          last.content += c
        }

        if (closingBrackets.includes(c)) {
          if (c !== (this.bracketsMap as any)[stack.pop() || '']) {
            throw new Error(`Bracket '${c}' is not found`)
          }
        }
      }

      for (const { id, content } of contentStack.map((_, idx) => contentStack[contentStack.length - 1 - idx])) {
        q = q.replace(content, id)
      }

      const cond = this._parseSimple(q)

      for (const { id, content: v } of contentStack) {
        for (const c0 of deepfind(cond, id)) {
          if (Array.isArray(c0)) {
            c0.forEach((c1, i) => {
              if (c1 === id) {
                c0[i] = this._parseSimple(v.substr(1, v.length - 2))
              }
            })
          } else {
            if (c0.v === id) {
              c0.v = this._parseSimple(v.substr(1, v.length - 2))
            }
          }
        }
      }

      return cond
    }

    return this._parseSimple(q)
  }

  private _parseSimple (q: string): Record<string, any> {
    q = q.trim()

    const exprMap: Record<string, string> = {}
    const newQ = q.replace(this.exprRe, (a, ...p) => {
      if (p.some((el) => this.topLevelOp.includes(el))) {
        return a
      }
      const id = guid()
      exprMap[id] = a
      return id
    })
    let qArray = [newQ]

    let cond: any = null;

    [...this.topLevelOp.map((t) => ` ${t} `), ' '].map((tOp) => {
      if (qArray.some((el) => el.includes(tOp))) {
        if (!cond) {
          qArray = newQ.split(tOp).map((el) => el.trim()).filter((el) => el)
          cond = {
            [tOp.trim()]: qArray,
          }
        } else {
          throw new Error('Only one top-level operator is allowed at a time')
        }
      }
    })

    if (!cond) {
      this.exprRe.lastIndex = 0
      return this.exprRe.exec(exprMap[newQ.trim()] || '')?.groups || {}
    }

    for (const [k, v] of Object.entries(exprMap)) {
      for (const c0 of deepfind(cond, k)) {
        if (Array.isArray(c0)) {
          c0.forEach((c1, i) => {
            if (c1 === k) {
              this.exprRe.lastIndex = 0
              const g = this.exprRe.exec(v)?.groups
              if (g) {
                c0[i] = g
              }
            }
          })
        }
      }
    }

    return cond
  }
}
