import { CHILDREN_KEY, ID_KEY, PARENT_ID_KEY, ROOT_ID } from "./constants.ts";
import type { ID } from "./types.ts";
import { assert, defaultTo, get, isNil, isNotNil } from "./utils.ts";

/**
 * 节点转换
 */
export type Transform<T, S> = (data: T, index: number) => S | null | undefined;

export type ParseOptions<T, S> = {
  /** id 的属性名 */
  idKey?: string;
  /** parentId 的属性名 */
  parentKey?: string;
  /** 支持自定义 children 的属性名 */
  childrenKey?: string;
  /** 允许外部转换数据 */
  transform?: Transform<T, S>;
  /** 允许外部接管插入行为 */
  insert?: (siblings: S[], node: S) => void;
};

export type ParseResult<S> = {
  /** id 的属性名 */
  idKey: string;
  /** parentId 的属性名 */
  parentKey: string;
  /** 支持自定义 children 的属性名 */
  childrenKey: string;
  /** 包含所有节点的对象 */
  nodes: Record<ID, S>;
  /** 包含所有节点关系的对象 */
  childNodes: Record<ID, S[]>;
};

/**
 * 方便外部二次封装
 *
 * 如：封装一个类 jQuery 的 API 工具，方便查找节点
 *
 * @param data    - 行数据
 * @param options - 配置项
 */
export function parse<S extends object, T extends object = S>(
  data: T[],
  options: ParseOptions<T, S> = {},
): ParseResult<S> {
  const idKey = defaultTo(options.idKey, ID_KEY);
  const parentKey = defaultTo(options.parentKey, PARENT_ID_KEY);
  const childrenKey = defaultTo(options.childrenKey, CHILDREN_KEY);

  const transform = defaultTo(options.transform, (x) => x as unknown as S);
  const insert = defaultTo(
    options.insert,
    (siblings: S[], node: S) => siblings.push(node),
  );

  const nodes: Record<ID, S> = {};
  const childNodes: Record<ID, S[]> = {};

  data.forEach((row, i) => {
    // 数据结构转换
    const node = transform(row, i);

    // 支持过滤掉某些数据
    if (isNil(node)) return;

    // 获取节点ID
    const id = getId(node, row, idKey) as ID;

    // id 必须存在
    assert(isNotNil(id), `id is required, in ${i}.`);

    // 获取子级元素
    const children = childNodes[id];
    if (children) {
      // @ts-expect-error ignore type error
      node[childrenKey] = children;
    } else {
      // @ts-expect-error ignore type error
      childNodes[id] = node[childrenKey] = [];
    }

    // 获取上级节点ID
    //  注意: 不能使用 _.get 的 `defaultValue` 参数， 那个只有不存在 `key` 才会返回默认值
    const parentId = defaultTo(getId(node, row, parentKey), ROOT_ID) as ID;

    // 获取同级元素
    const siblings = childNodes[parentId];
    if (siblings) {
      insert(siblings, node);
    } else {
      insert(childNodes[parentId] = [], node);
    }

    // 为了方便外部根据ID获取节点信息
    nodes[id] = node;
  });

  return {
    idKey,
    parentKey,
    childrenKey,
    nodes,
    childNodes,
  };
}

/**
 * 优先从 node 中获取 id
 * 如果没有再从原始对象中获取
 */
function getId(
  node: object,
  raw: object,
  key: string | symbol | number,
): unknown | undefined {
  const id = get(node, key);
  return isNil(id) ? get(raw, key) : id;
}
