import { dummyFunction } from "~/index";

describe("Dummy test", () => {
  test("increases the number by two", () => {
    expect(dummyFunction(1)).toEqual(3);
    expect(dummyFunction(2)).toEqual(4);
  });
});
