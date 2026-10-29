import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { displayIndiaMobile, toE164India } from "./phone";

describe("Indian mobile E.164", () => {
  it("accepts a 10-digit number starting 6–9", () => {
    assert.equal(toE164India("98765 43210"), "+919876543210");
    assert.equal(toE164India("+91 7980123456"), "+917980123456");
    assert.equal(toE164India("919876543210"), "+919876543210");
  });

  it("rejects landlines, short numbers, and leading 5", () => {
    assert.equal(toE164India("0123456789"), null);
    assert.equal(toE164India("98765"), null);
    assert.equal(toE164India("5876543210"), null);
  });

  it("strips +91 for display", () => {
    assert.equal(displayIndiaMobile("+919876543210"), "9876543210");
  });
});
