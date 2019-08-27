const { assert } = require("chai");

describe("Array", () => {
  describe("#indexOf()", () => {
    it("should return -1 when the value is not present", () => {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe("#toBeEqual", () => {
  it('should return "Mocha & Chai are greats!"', () => {
    assert.equal(
      (() => "Mocha & Chai are greats!")(),
      "Mocha & Chai are greats!"
    );
  });
});
