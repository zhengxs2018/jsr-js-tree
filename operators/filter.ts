/**
 * 树节点过滤
 *
 * @module
 */
import { CHILDREN_KEY } from "../src/constants.ts";
import { get } from "../src/utils.ts";

/**
 * 类数组的 filter 方法
 *
 * - 上级数据返回 true，跳过子级递归，并且数据全保留
 * - 上级数据返回 false，子级返回 true，上级也会被保留
 *
 * @param data         - 数结构数据
 * @param callback     - 处理回调，注意：如果返回的对象子级不存在将不进行递归操作
 * @param childrenKey  - 自定义子节点属性名称
 * @returns 过滤后的数据
 *
 * @example
 *
 * ```ts
 * import { filter } from 'jsr:@zhengxs/js.tree'
 *
 * const data = [
 *   {
 *     title: '财务',
 *     children: [{ title: '收入流失' }, { title: '财务设置' }],
 *   },
 *   {
 *     title: '站点设置',
 *     children: [{ title: '菜单维护' }, { title: '角色维护' }],
 *   }
 * ]
 *
 * const result = filter(data, node => node.title.indexOf('设置') > -1)
 *
 * console.log(result)
 * //=>
 * // [
 * //   {
 * //     title: '财务',
 * //     children: [{ title: '财务设置' }]
 * //   },
 * //   {
 * //     title: '站点设置',
 * //     children: [{ title: '收入流失' }, { title: '财务设置' }]
 * //   }
 * // ]
 * ```
 */
export function filter<T extends object = object>(
  data: T[],
  callback: (data: T, index: number, parents: T[]) => boolean,
  childrenKey: string = CHILDREN_KEY,
): T[] {
  function iter(data: T[], parents: T[]): T[] {
    const items: T[] = [];

    data.forEach((node, index) => {
      if (callback(node, index, parents)) {
        items.push({ ...node });
        return;
      }

      const children = iter(
        get(node, childrenKey, []) as T[],
        parents.concat(node),
      );

      if (children.length > 0) {
        items.push({ ...node, [childrenKey]: children });
      }
    });

    return items;
  }

  return iter(data, []);
}
