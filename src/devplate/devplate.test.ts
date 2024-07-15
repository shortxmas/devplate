import { describe, expect, test } from "@jest/globals";
import { Devplate } from "./Devplate";

describe("Devplate class", () => {
  const devplate = new Devplate();

  test("Add not yet existing Devplate repository", async () => {
    const add = await devplate.addDevplateRepository({
      name: "New Devplate repo name",
      url: "New Devplate repo URL",
    });
    expect(add).toBe(1);
  });

  test("Add already existing Devplate repository", async () => {
    const add = await devplate.addDevplateRepository({
      name: "New Devplate repo name",
      url: "New Devplate repo URL",
    });
    expect(add).toBe(0);
  });

  test("Remove existing Devplate repository", async () => {
    const remove = await devplate.removeDevplateRepository({
      name: "New Devplate repo name",
      url: "New Devplate repo URL",
    });
    expect(remove).toBe(1);
  });

  test("Remove non-existing Devplate repository", async () => {
    const remove = await devplate.removeDevplateRepository({
      name: "New Devplate repo name",
      url: "New Devplate repo URL",
    });
    expect(remove).toBe(0);
  });
});
