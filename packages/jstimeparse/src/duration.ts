import { floatRegexStr } from './util'

export type TimeUnit = 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds'
export type IDuration = Partial<Record<TimeUnit, number>>

/**
 * @internal
 */
class DurationRegexBuilder {
  unit: Record<TimeUnit, RegExp> = {
    years: new RegExp(`(?<years>${floatRegexStr})\\s*(?:ys?|yrs?|years?)\\.?`),
    months: new RegExp(`(?<months>${floatRegexStr})\\s*(?:mos?|mths?|months?)\\.?`),
    weeks: new RegExp(`(?<weeks>${floatRegexStr})\\s*(?:wk?s?|weeks?)\\.?`),
    days: new RegExp(`(?<days>${floatRegexStr})\\s*(?:dy?s?|days?)\\.?`),
    hours: new RegExp(`(?<hours>${floatRegexStr})\\s*(?:hr?s?|hours?)\\.?`),
    minutes: new RegExp(`(?<minutes>${floatRegexStr})\\s*(?:m|mins?|minutes?)\\.?`),
    seconds: new RegExp(`(?<seconds>${floatRegexStr})\\s*(?:s|secs?|seconds?)\\.?`),
    milliseconds: new RegExp(`(?<milliseconds>${floatRegexStr})\\s*(?:(?:m(?:illi)?)(?:(?:s(?:ec)?)(?:ond)?)s?)\\.?`),
  }

  secondsConverter: Record<TimeUnit, (n: number) => number> = {
    years: (n: number) => this.secondsConverter.days(n) * 365.25,
    months: (n: number) => this.secondsConverter.days(n) * 30,
    weeks: (n: number) => this.secondsConverter.days(n) * 7,
    days: (n: number) => this.secondsConverter.hours(n) * 24,
    hours: (n: number) => this.secondsConverter.minutes(n) * 60,
    minutes: (n: number) => this.secondsConverter.seconds(n) * 60,
    seconds: (n: number) => this.secondsConverter.milliseconds(n) * 1000,
    milliseconds: (n: number) => n / 1000,
  }

  formats = (() => {
    const secClock = ':(?<seconds>\\d{2}(?:\\.\\d+)?)'
    const minClock = `(?<minutes>\\d{1,2})${secClock}`
    const hourClock = `(?<hours>\\d+):${minClock}`
    const dayClock = `(?<days>\\d+):${hourClock}`

    return [dayClock, hourClock, minClock].map((f) => new RegExp(`(?<sign>[-+])?${f}`))
  })()

  parse (s: string): IDuration {
    const [_, sign, unsigned] = s.match(/^\s*([-+])?\s*(.+)/) || []

    if (unsigned.includes('-')) {
      throw new Error('Invalid string: in-between minus (-) not supported')
    }

    for (const f of this.formats) {
      const m = f.exec(s)
      if (m) {
        return this.numerifyDict(m.groups || {} as any, sign === '-')
      }
    }

    const d = {} as IDuration
    for (const f of Object.values(this.unit)) {
      const m = f.exec(s)
      if (m && m.groups) {
        Object.assign(d, this.numerifyDict(m.groups, sign === '-'))
      }
    }

    return d
  }

  private numerifyDict (g: Partial<Record<TimeUnit, string>>, neg: boolean): IDuration {
    const out = {} as IDuration
    for (const [k, v] of Object.entries(g)) {
      if (v) {
        (out as any)[k] = neg ? -parseFloat(v) : parseFloat(v)
      }
    }
    return out
  }
}

export const durationRegex = new DurationRegexBuilder()

export function parseDuration (s: string): IDuration {
  return durationRegex.parse(s)
}

export function parseDurationToSeconds (s: string): number {
  let ms = 0
  for (const [type, v] of Object.entries(parseDuration(s))) {
    if (v) {
      ms += durationRegex.secondsConverter[type as TimeUnit](v)
    }
  }

  return ms
}
