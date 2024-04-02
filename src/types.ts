/**
 * ID类型
 */
export type ID = string | number;

/**
 * 普通对象
 */
export type Row = object;

/**
 * 默认的节点对象
 */
export interface Node extends Row {
  id: ID;
  parentId: ID;
  children: Node;
}
