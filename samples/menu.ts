import { toTree } from "../src/mod.ts";

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
