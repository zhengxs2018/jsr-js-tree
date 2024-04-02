/**
 * 判断书叫是否为 null 或 undefined
 *
 * like lodash/isNil
 *
 * @param value - 未知数据
 */
export function isNil(value: unknown): value is undefined | null {
  return value == null;
}

/**
 * 和 isNil 结果相反
 *
 * @param value - 需要检查的值
 */
export function isNotNil(value: unknown): boolean {
  return isNil(value) === false;
}

/**
 * 断言，模拟 node api
 *
 * @param value    - 断言结果
 * @param message  - 断言失败提示
 */
/* istanbul ignore next */
export function assert(value: boolean, message: string | Error): never | void {
  if (value) return;
  if (message instanceof Error) {
    throw message;
  }
  throw new Error(message);
}

/**
 * 如果值为 null 或 undefined，则使用默认值
 *
 * like lodash/defaultTo
 *
 * @param value - 未知数据
 * @param defaultValue - 默认值
 */
export function defaultTo<T>(value: T | undefined | null, defaultValue: T): T {
  return isNil(value) ? defaultValue : value;
}

export function get<T extends object>(
  object: T,
  path: string | symbol | number,
  defaultValue?: unknown,
): unknown | undefined;

export function get<T extends object, K extends keyof T, D = T[K]>(
  object: T,
  path: K,
): D | undefined;

export function get<T extends object, K extends keyof T, D = T[K]>(
  object: T,
  path: K,
  defaultValue: D,
): D;

/**
 * 获取值
 *
 * like lodash/get
 *
 * @param object - 对象
 * @param value - 未知数据
 * @param defaultValue - 默认值
 */
export function get<T extends object, K extends keyof T, D = T[K]>(
  object: T,
  path: K,
  defaultValue?: D,
): D | undefined {
  return defaultTo(object[path] as D, defaultValue);
}

/**
 * 删除对象的 key，并返回它的值
 *
 * @param object       - 普通对象
 * @param key          - 属性名
 * @param defaultValue - 默认值
 */
export function popKey<T extends object, K extends keyof T, U>(
  object: T,
  key: K,
  defaultValue: U,
): U;

/**
 * 删除对象的 key，并返回它的值
 *
 * @param object       - 普通对象
 * @param key          - 属性名
 */
export function popKey<T extends object, K extends keyof T, U>(
  object: T,
  key: K,
): U;

/**
 * 删除对象的 key，并返回它的值
 *
 * @param source       - 普通对象
 * @param key          - 属性名
 * @param defaultValue - 默认值
 */
export function popKey<T extends object, K extends keyof T, U>(
  object: T,
  key: K,
  defaultValue?: U,
): U | undefined {
  const value = object[key] as U;
  delete object[key];
  return defaultTo(value, defaultValue);
}
