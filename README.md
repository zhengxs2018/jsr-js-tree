<div align="center">
  <h1>
   <br/>
    <br/>
    👍
    <br />
    jsr:@zhengxs/js-tree
    <br />
    <br />
  </h1>
  <sup>
    <br />
    <br />
    <a href="https://www.typescriptlang.org">
      <img src="https://img.shields.io/badge/lang-typescript-informational?style=flat" alt="TypeScript" />
    </a>
    <a href="https://github.com/prettier/prettier">
      <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="code style: prettier" />
    </a>
    <a href="#License">
      <img src="https://img.shields.io/npm/l/@zhengxs/js.tree.svg?style=flat-square" alt="License" />
    </a>
    <br />
    <br />
  </sup>
  <div>快速，轻量，无依赖的树结构数据处理函数库。</div>
  <br />
  <br />
  <br />
</div>

---

- 一个循环解决行转树的问题
- 转树除了添加 `children` 属性，不会修改任何数据
- 支持任意关系字段，如：非 id，parentId, children 字段支持
- 支持接管插入行为，如：自定义插入顺序
- 支持动态导出树节点
- 内置 `filter/map` 等便捷操作函数

## 安装

主要发布到 [jsr](https://jsr.io/) 平台，非传统 NPM 项目。

```sh
# deno
$ deno add @zhengxs/js-tree

# npm (one of the below, depending on your package manager)
$ npx jsr add @luca/cases

$ yarn dlx jsr add @luca/cases

$ pnpm dlx jsr add @luca/cases

$ bunx jsr add @luca/cases
```

详见 [Using packages](https://jsr.io/docs/using-packages).

### 使用

```js
import { toTree } from "jsr:@zhengxs/js-tree";

toTree([
  { id: 10000, parentId: null, title: "标题 1" },
  { id: 20000, parentId: null, title: "标题 2" },
  { id: 11000, parentId: 10000, title: "标题 1-1" },
]);
console.log(result);
// [
//   {
//     id: 10000,
//     parentId: null,
//     title: '标题 1',
//     children: [
//       { id: 11000, parentId: 10000, title: '标题 1-1', children: [] }
//     ]
//   },
//   { id: 20000, parentId: null, title: '标题 2', children: [] },
// ]
```

支持任意关系字段的数据

```js
import { ROOT_ID, toTree } from "jsr:@zhengxs/js-tree";

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
//     title: '标题 1',
//     sort: 1,
//     checked: false,
//     items: [
//       {
//         uid: 11000,
//         pid: 10000,
//         title: '标题 1-1',
//         sort: 3,
//         checked: false,
//         items: []
//       }
//     ]
//   },
//   {
//     uid: 20000,
//     pid: null,
//     title: '标题 2',
//     sort: 2,
//     checked: false,
//     items: []
//   }
// ]
```

## TypeScript

内置 ts 类型

```ts
import { toTree } from "jsr:@zhengxs/js-tree";

// 转换前的数据
type MenuItem = {
  id: string;
  parentId?: string | null;
  text: string;
  url?: string;
};

// 转换后的数据
interface Nav extends MenuItem {
  items: Nav[];
}

const data: MenuItem[] = [
  { id: "10000", text: "标题 1" },
  { id: "20000", text: "标题 2" },
  { id: "11000", parentId: "10000", text: "标题 1-1", url: "/" },
];

// 如果修改了 childrenKey
// 为了让类型提示正确，可以传入正确的类型
const result = toTree<Nav>(data, {
  childrenKey: "items",
});

console.log(result);
// [
//   {
//     id: "10000",
//     text: "标题 1",
//     items: [
//       {
//         id: "11000",
//         parentId: "10000",
//         text: "标题 1-1",
//         url: "/",
//         items: []
//       }
//     ]
//   },
//   { id: "20000", text: "标题 2", items: [] }
// ]
```

## License

- MIT
