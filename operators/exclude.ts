/**
 * 树节点排除
 *
 * @module
 */
import { CHILDREN_KEY } from "../src/constants.ts";
import { get } from "../src/utils.ts";

/**
 * 排除某些数据，和 `filter` 方法的区别：
 *
 * - 回调函数返回 `true` 的数据将被过滤
 * - 如果子级都被过滤掉了，那父级也会被排除
 *
 * @param data         - 数结构数据
 * @param callback     - 处理回调，返回 true 的数据将被过滤掉
 * @param childrenKey  - 自定义子节点属性名称
 * @returns 过滤后的数据
 */
export function exclude<T extends object = object>(
  data: T[],
  callback: (data: T, index: number, parents: T[]) => boolean,
  childrenKey: string = CHILDREN_KEY,
): T[] {
  function iter(data: T[], parents: T[]): T[] {
    const items: T[] = [];

    data.forEach((node, index) => {
      if (callback(node, index, parents)) {
        return;
      }

      // 判读是否存在子级
      const children = get(node, childrenKey, []) as T[];
      if (children.length === 0) {
        items.push(node);
        return;
      }

      const results = iter(children, parents.concat(node));
      if (results.length > 0) {
        items.push({ ...node, [childrenKey]: results });
      }
    });

    return items;
  }

  return iter(data, []);
}
