import { deepStrictEqual } from "node:assert";

import { repair } from "./repair.ts";

Deno.test("test repair()", function () {
  const valuesMap = {
    10000: { id: 10000, parentId: null, title: "研发中心" },
    11000: { id: 11000, parentId: 10000, title: "体验设计部" },
    11001: { id: 11001, parentId: 11000, title: "设计组" },
    11002: { id: 11002, parentId: 11000, title: "前端组" },
    12000: { id: 12000, parentId: 10000, title: "系统集成部" },
  };

  const data = [
    { id: 12000, parentId: 10000, title: "系统集成部" },
    { id: 11001, parentId: 11000, title: "设计组" },
    { id: 11002, parentId: 11000, title: "前端组" },
  ];

  const result = repair(data, {
    // @ts-expect-error ignore type error
    resolve: (id) => valuesMap[id],
  });

  const expected = [
    {
      id: 10000,
      parentId: null,
      title: "研发中心",
      children: [
        { id: 12000, parentId: 10000, title: "系统集成部", children: [] },
        {
          id: 11000,
          parentId: 10000,
          title: "体验设计部",
          children: [
            { id: 11001, parentId: 11000, title: "设计组", children: [] },
            { id: 11002, parentId: 11000, title: "前端组", children: [] },
          ],
        },
      ],
    },
  ];

  deepStrictEqual(result, expected);
});
