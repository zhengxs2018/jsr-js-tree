/**
 * 树节点遍历
 *
 * @module
 */
import { CHILDREN_KEY } from "../src/constants.ts";
import { get } from "../src/utils.ts";

/**
 * 遍历所有节点
 *
 * @param data         - 数结构数据
 * @param callback     - 处理回调，返回 true 将跳过子级的遍历操作
 * @param childrenKey  - 自定义子节点属性名称
 */
export function each<T extends object = object>(
  data: T[],
  callback: (data: T, index: number, parents: T[]) => boolean | void,
  childrenKey: string = CHILDREN_KEY,
): T[] {
  function iter(data: T[], parents: T[]): T[] {
    const items: T[] = [];

    data.forEach((node, index) => {
      // Note: 允许返回 false 停止当前航遍历
      if (callback(node, index, parents)) return;

      iter(get(node, childrenKey, []) as T[], parents.concat(node));
    });

    return items;
  }

  return iter(data, []);
}
