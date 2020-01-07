declare module 'parse-duration' {
  export = parse

  /**
   * convert `str` to ms
   */
  function parse (str: string): number
}
