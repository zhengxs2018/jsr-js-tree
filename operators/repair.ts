/**
 * 节点关系修复
 *
 * @module
 */
import { CHILDREN_KEY, ID_KEY, PARENT_ID_KEY } from "../src/constants.ts";
import type { ID, Node } from "../src/types.ts";

/**
 * 配置项
 */
export type RepairOptions<T extends object = object, U extends Node = Node> = {
  /**
   * 节点 ID 键名
   *
   * @defaultValue 'id'
   */
  idKey?: string;
  /**
   * 父节点 ID 键名
   *
   * @defaultValue 'parentId'
   */
  parentKey?: string;
  /**
   * 子节点键名
   *
   * @defaultValue 'children'
   */
  childrenKey?: string;
  /**
   * 根据缺失节点唯一ID返回缺失节点数据
   *
   * @param id - 缺失节点唯一ID
   * @returns 缺失节点数据
   */
  resolve: (id: ID) => T | null | undefined;
  /**
   * 自定义插入函数
   *
   * @param siblings - 兄弟节点列表
   * @param node - 待插入的缺失节点
   */
  insert?: (siblings: U[], node: U) => void;
};

/**
 * 根据列表修复缺失的节点数据
 *
 * @param data - 不完整列表数据
 * @param  options - 配置项
 * @returns 已修复好的数结构
 */
export function repair<T extends object = object, U extends Node = Node>(
  data: T[],
  options: RepairOptions<T, U>
): U[] {
  const {
    idKey = ID_KEY,
    parentKey = PARENT_ID_KEY,
    childrenKey = CHILDREN_KEY,
    resolve,
    insert = (siblings: U[], node: U) => siblings.push(node),
  } = options;

  const rootNodes: U[] = [];
  const parents: Record<ID, U> = {};

  const create_node = (data: T) => {
    const children: U[] = [];
    const current = { ...data, [childrenKey]: children } as unknown as U;

    // @ts-expect-error ignore type error
    parents[data[idKey] as ID] = current;

    return current;
  };

  const repair_node_links = (current: U) => {
    // @ts-expect-error ignore type error
    const parentId = current[parentKey] as ID;
    const parent = parents[parentId];

    // 查找本地是否存在上级
    if (parent) {
      // @ts-expect-error ignore type error
      insert(parent[childrenKey] as U[], current);
      return;
    }

    // 查找外部是存在上级
    const data = resolve(parentId);
    if (!data) {
      insert(rootNodes, current);
      return;
    }

    const target = create_node(data);

    // 插入当前节点
    // @ts-expect-error ignore type error
    insert(target[childrenKey] as U[], current);

    // 继续向上修复
    repair_node_links(target);
  };

  data.forEach((item) => {
    // @ts-expect-error ignore type error
    const data = resolve(item[idKey] as ID);
    if (!data) return;

    repair_node_links(create_node(data));
  });

  return rootNodes;
}
