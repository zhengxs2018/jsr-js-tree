import { ROOT_ID } from "./constants.ts";
import type { ParseResult } from "./parse.ts";
import type { ID } from "./types.ts";
import { defaultTo } from "./utils.ts";

/**
 * 数据导出器类型
 */
export type Exporter<T> = (
  nodes: Record<ID, T[]>,
  result: ParseResult<T>,
) => T[] | null | undefined;

/**
 * 数据导出，允许外部自定义根节点
 *
 * @param nodes - 包含所有层级的数据
 * @param root  - 根节点，支持自定义函数
 */
export function exporter<T>(
  result: ParseResult<T>,
  root?: ID | Exporter<T>,
): T[] {
  const nodes = result.childNodes;

  if (typeof root === "function") {
    return root(nodes, result) || [];
  }

  return nodes[defaultTo(root, ROOT_ID)] || [];
}
