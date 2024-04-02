import { popKey } from "./utils.ts";
import { CHILDREN_KEY } from "./constants.ts";

/**
 * 树转行
 *
 * @param data        - 树结构数据
 * @param childrenKey - children 属性名
 *
 * @example
 *
 * ```ts
 * import { toRows } from '@zhengxs/js.tree'
 *
 * const data = [
 *   { title: '财务', children: [{ title: '收入流失' }, { title: '财务设置' }] },
 *   { title: '站点设置', children: [{ title: '收入流失' }, { title: '财务设置' }] },
 * ]
 *
 * toRows(data)
 * // ->
 * // [
 * //   { title: '财务' },
 * //   { title: '收入流失' },
 * //   { title: '财务设置' },
 * //   { title: '站点设置' },
 * //   { title: '收入流失' },
 * //   { title: '财务设置' }
 * // ]
 * ```
 */
export function toRows<T extends object = object, U extends object = T>(
  data: T[],
  childrenKey: string = CHILDREN_KEY,
): U[] {
  const result: U[] = [];

  function callback(source: T) {
    const target = { ...source } as unknown as U;

    // @ts-expect-error ignore type error
    const children = popKey(target, childrenKey, [] as T[]);

    result.push(target);

    children.forEach(callback);
  }

  data.forEach(callback);

  return result;
}
