/*
 * Wuif Design (https://github.com/wuifdesign).
 * Copyright (c) 2022 Wuif
 * MIT License
 */

export function filterObjectByKey(value: Record<string, any>, filterFunction: (key: string) => boolean) {
  return Object.fromEntries(Object.entries(value).filter(([key]) => filterFunction(key)));
}
