/**
 * 树结构转换
 *
 * @module
 */
import { CHILDREN_KEY } from "../src/constants.ts";
import { get } from "../src/utils.ts";

/**
 * 类数组的 map 方法
 *
 * @param data         - 数结构数据
 * @param callback     - 处理回调，注意：如果返回的对象子级不存在将不进行递归操作
 * @param childrenKey  - 自定义子节点属性名称
 *
 * @example
 *
 * ```ts
 * import { map } from 'jsr:@zhengxs/js.tree'
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
 * const result = map(data, (node, index, parents) => {
 *   if (node.title === '财务') {
 *     // 可以返回空的子节点，停止处理子级
 *     // 已经做过浅拷贝，修改不会改变原始对象
 *     node.children = []
 *     return node
 *   }
 *
 *   // 已经做过浅拷贝，修改不会改变原始对象
 *   node.title = node.title + '测试'
 *
 *   // 必须返回内容
 *   return node
 * })
 *
 * console.log(result)
 * //=>
 * // [
 * //   {
 * //     title: '财务',
 * //     children: []
 * //   },
 * //   {
 * //     title: '站点设置测试',
 * //     children: [{ title: '收入流失测试' }, { title: '财务设置测试' }]
 * //   }
 * // ]
 * ```
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
