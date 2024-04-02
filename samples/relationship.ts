import { ROOT_ID, toTree } from "../src/mod.ts";

const data = [
  { uid: 10000, pid: null, title: "标题 1", sort: 1 },
  { uid: 20000, pid: null, title: "标题 2", sort: 2 },
  { uid: 11000, pid: 10000, title: "标题 1-1", sort: 3 },
];

const result = toTree(data, {
  // 如果 parentId 为 null 或 undefined 会合并一起
  // 使用 ROOT_ID 作为 key 保存
  // 支持函数，动态返回
  root: ROOT_ID,

  // lodash 版本，支持 path, 如: nested.id
  idKey: "uid", // 可选，默认: id

  // lodash 版本，支持 path, 如: nested.parentId
  parentKey: "pid", // 可选，默认：parentId

  // 挂载子级的属性名称，默认：children
  childrenKey: "items",

  // 数据添加进 children 数组前的处理，可选
  transform(data) {
    // 通过浅拷贝避免修改原始数据
    // 可以在这里动态添加属性
    return { ...data, checked: false };
  },

  // 接管插入行为
  insert(siblings, node) {
    // ps: 任意层级的数据都是这样处理的
    const index = siblings.findIndex((n) => n.sort > node.sort);

    if (index === -1) {
      siblings.push(node);
    } else {
      siblings.splice(index, 0, node);
    }
  },
});

console.log(result);
// [
//   {
//     uid: 10000,
//     pid: null,
//     title: "标题 1",
//     sort: 1,
//     checked: false,
//     items: [
//       {
//         uid: 11000,
//         pid: 10000,
//         title: "标题 1-1",
//         sort: 3,
//         checked: false,
//         items: []
//       }
//     ]
//   },
//   {
//     uid: 20000,
//     pid: null,
//     title: "标题 2",
//     sort: 2,
//     checked: false,
//     items: []
//   }
// ]
