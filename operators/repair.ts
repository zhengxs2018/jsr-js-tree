/**
 * 节点关系修复
 *
 * @module
 */
import { CHILDREN_KEY, ID_KEY, PARENT_ID_KEY } from "../src/constants.ts";
import type { ID, Node } from "../src/types.ts";

export type RepairConfig<
  T extends object = object,
  U extends Node = Node,
> = {
  idKey?: string;
  parentKey?: string;
  childrenKey?: string;
  resolve: (id: ID) => T;
  insert?: (list: U[], node: U) => void;
};

export type RepairOptions<
  T extends object = object,
  U extends Node = Node,
> = Required<RepairConfig<T, U>>;

/**
 * 根据列表修复缺失的节点数据
 *
 * @param list - 不完整列表数据
 * @param  config - 配置参数
 * @returns 已修复好的数结构
 */
export const repair = <T extends object = object, U extends Node = Node>(
  list: T[],
  config: RepairConfig<T, U>,
): U[] => {
  const {
    idKey = ID_KEY,
    parentKey = PARENT_ID_KEY,
    childrenKey = CHILDREN_KEY,
    resolve,
    insert = (list: U[], node: U) => list.push(node),
  } = config;

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

  list.forEach((item) => {
    // @ts-expect-error ignore type error
    const data = resolve(item[idKey] as ID);
    if (!data) return;

    repair_node_links(create_node(data));
  });

  return rootNodes;
};
