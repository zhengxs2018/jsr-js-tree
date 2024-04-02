import { type Exporter, exporter } from "./exporter.ts";
import { parse, type ParseOptions } from "./parse.ts";
import type { ID, Node, Row } from "./types.ts";

export interface ToTreeOptions<S extends object = Node, T extends object = Row>
  extends ParseOptions<T, S> {
  /** 顶级节点ID，支持自定义函数 */
  root?: ID | Exporter<S>;
}

/**
 * 行转树
 *
 * @param data    - 行数据
 * @param options - 配置项
 *
 * @example
 *
 * ```js
 * toTree([
 *   { id: 1, parentId: null },
 *   { id: 2, parentId: null },
 *   { id: 3, parentId: 1 },
 * ])
 * //=>
 * // [
 * //   {
 * //     id: 1,
 * //     parentId: null,
 * //     children: [
 * //       { id: 3, parentId: 1, children: [] }
 * //     ]
 * //   },
 * //   { id: 2, parentId: null, children: [] },
 * // ]
 * ```
 *
 * @example
 *
 * ```js
 * toTree(
 *   [
 *     { sub: 1, parent: null },
 *     { sub: 2, parent: null },
 *     { sub: 3, parent: 1 },
 *   ],
 *   { idKey: 'sub', parentKey: 'parent' } // 自定义 id/parentId 属性
 * )
 * //=>
 * // [
 * //   {
 * //     sub: 1,
 * //     parent: null,
 * //     items: [
 * //       { sub: 3, parent: 1, items: [] }
 * //     ]
 * //   },
 * //   { sub: 2, parent: null, items: [] },
 * // ]
 * ```
 *
 * @example
 *
 * ```js
 * toTree(
 *   [
 *     { id: 1, parentId: null },
 *     { id: 2, parentId: null },
 *     { id: 3, parentId: 1 },
 *   ],
 *   { children: 'items' } // 自定义 children 属性
 * )
 * //=>
 * // [
 * //   {
 * //     id: 1,
 * //     parentId: null,
 * //     items: [
 * //       { id: 3, parentId: 1, items: [] }
 * //     ]
 * //   },
 * //   { id: 2, parentId: null, items: [] },
 * // ]
 * ```
 *
 * @example
 *
 * ```js
 * toTree(
 *   [
 *     { id: 1, parentId: '__root__' },
 *     { id: 2, parentId: '__root__' },
 *     { id: 3, parentId: 1 },
 *   ],
 *   { root: '__root__' } // 自定义根节点
 * )
 * //=>
 * // [
 * //   {
 * //     id: 1,
 * //     parentId: '__root__',
 * //     children: [
 * //       { id: 3, parentId: 1, children: [] }
 * //     ]
 * //   },
 * //   { id: 2, parentId: '__root__', children: [] },
 * // ]
 * ```
 *
 * @example
 *
 * ```js
 * toTree(
 *   [
 *     { id: 1, parentId: '__root__' },
 *     { id: 2, parentId: '__root__' },
 *     { id: 3, parentId: 1 },
 *   ],
 *   { root: nodes => nodes['__root__'] } // 自定义函数导出
 * )
 * //=>
 * // [
 * //   {
 * //     id: 1,
 * //     parentId: '__root__',
 * //     children: [
 * //       { id: 3, parentId: 1, children: [] }
 * //     ]
 * //   },
 * //   { id: 2, parentId: '__root__', children: [] },
 * // ]
 * ```
 *
 * @example
 *
 * ```js
 * toTree(
 *   [
 *     { id: 1, parentId: null },
 *     { id: 2, parentId: null },
 *     { id: 3, parentId: 1 },
 *   ],
 *   {
 *     // 自定义转换
 *     transform(row) {
 *       // 返回 null 或 undefined 的数据不回保留
 *       if (row.id === 3) return
 *       // 可以进行浅拷贝后修改，防止破坏原始对象
 *       return { ...row, test: true }
 *     }
 *   }
 * )
 * //=>
 * // [
 * //   { id: 1, parentId: null, test: true, children: [] },
 * //   { id: 2, parentId: null, test: true, children: [] },
 * // ]
 * ```
 *
 * @example
 *
 * ```js
 * toTree(
 *   [
 *     { id: 2, parentId: null, sort: 2 },
 *     { id: 5, parentId: 1, sort: 1 },
 *     { id: 4, parentId: 1, sort: 2 },
 *     { id: 3, parentId: null, sort: 3 },
 *     { id: 1, parentId: null, sort: 1 },
 *   ],
 *   {
 *     // 自定义插入顺序
 *     insert(siblings, node) {
 *       // ps: 任意层级的数据都是这样处理的
 *       const index = siblings.findIndex((n) => n.sort > node.sort)
 *
 *       // 根据位置选择插入到兄弟节点当中
 *       if (index === -1) {
 *         siblings.push(node)
 *       } else {
 *         siblings.splice(index, 0, node)
 *       }
 *     }
 *   }
 * )
 * //=>
 * // [
 * //   {
 * //     id: 1,
 * //     parentId: null,
 * //     sort: 1
 * //     children: [
 * //       { id: 4, parentId: null, sort: 1, children: [] },
 * //       { id: 5, parentId: null, sort: 2, children: [] },
 * //     ]
 * //   },
 * //   { id: 2, parentId: null, sort: 2, children: [] },
 * //   { id: 3, parentId: null, sort: 3, children: [] },
 * // ]
 * ```
 */
export function toTree<S extends object = Node, T extends object = Row>(
  data: T[],
  options: ToTreeOptions<S, T> = {},
): S[] {
  return exporter(parse(data, options), options.root);
}
