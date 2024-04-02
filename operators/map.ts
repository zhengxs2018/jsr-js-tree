import { CHILDREN_KEY } from "../src/constants.ts";
import { get } from "../src/utils.ts";

/**
 * 类数组的 map 方法
 *
 * @param data         - 数结构数据
 * @param callback     - 处理回调，注意：如果返回的对象子级不存在将不进行递归操作
 * @param childrenKey  - 自定义子节点属性名称
 */
export function map<T extends object = object, U extends object = T>(
  data: T[],
  callback: (data: T, index: number, parents: T[]) => U,
  childrenKey: string = CHILDREN_KEY,
): U[] {
  function iter(data: T[], parents: T[]): U[] {
    return data.map((node, index) => {
      const source = callback({ ...node }, index, parents);

      const children = iter(
        get(source, childrenKey, []) as T[],
        parents.concat(node),
      );
      if (children.length > 0) {
        return { ...source, [childrenKey]: children };
      }

      // 递归并且浅拷贝
      return source;
    });
  }

  return iter(data, []);
}
