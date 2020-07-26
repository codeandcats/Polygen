interface Array<T> {
  filter(
    predicate: typeof Boolean
  ): Exclude<T, undefined | null | false | '' | 0>[];
}
