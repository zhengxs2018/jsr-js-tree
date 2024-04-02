import { deepStrictEqual } from "node:assert";

import { toRows } from "./toTows.ts";

Deno.test("test toRows()", function () {
  const result = toRows([
    { id: 1, parentId: null, children: [{ id: 3, parentId: 1, children: [] }] },
    { id: 2, parentId: null, children: [] },
  ]);

  const expected = [
    { id: 1, parentId: null },
    { id: 3, parentId: 1 },
    { id: 2, parentId: null },
  ];

  deepStrictEqual(result, expected);
});

Deno.test("test toRows(children=items)", function () {
  const result = toRows(
    [
      { id: 1, parentId: null, items: [{ id: 3, parentId: 1, items: [] }] },
      { id: 2, parentId: null, items: [] },
    ],
    "items",
  );

  const expected = [
    { id: 1, parentId: null },
    { id: 3, parentId: 1 },
    { id: 2, parentId: null },
  ];
  deepStrictEqual(result, expected);
});
