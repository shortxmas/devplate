import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { promises as fs } from "fs";
import { Devplate } from "../src/devplate/Devplate";
import * as path from "path";

jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

jest.mock("path", () => ({
  join: jest.fn(),
}));

jest.mock("inquirer", () => ({
  prompt: jest.fn(),
}));

describe("Devplate", () => {
  let devplate: Devplate;

  beforeEach(() => {
    devplate = new Devplate();
    jest.clearAllMocks();
  });

  describe("initalizeDevplateRepositories", () => {
    test("should read and parse devplates.json", async () => {
      const mockData = JSON.stringify({
        devplateRepositories: [{ name: "Repo1", url: "https://repo1.com" }],
      });
      (fs.readFile as jest.Mock).mockResolvedValue(mockData as never);
      (path.join as jest.Mock).mockReturnValue("/mock/path/devplates.json");

      await devplate.initalizeDevplateRepositories();

      expect(fs.readFile).toHaveBeenCalledWith(
        "/mock/path/devplates.json",
        "utf-8"
      );
      expect(devplate.getDevplateRepositories()).resolves.toEqual([
        { name: "Repo1", url: "https://repo1.com" },
      ]);
    });

    test("should handle error and set an empty array if an error occurs", async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(
        new Error("File read error") as never
      );

      await devplate.initalizeDevplateRepositories();

      expect(devplate.getDevplateRepositories()).resolves.toEqual([]);
    });
  });

  describe("devplateRepositryExists", () => {
    test("should return true if repository exists", async () => {
      devplate["devplateRepositories"] = [
        { name: "Repo1", url: "https://repo1.com" },
      ];

      const exists = await devplate["devplateRepositryExists"]({
        name: "Repo1",
        url: "https://repo1.com",
      });

      expect(exists).toBe(true);
    });

    test("should return false if repository does not exist", async () => {
      devplate["devplateRepositories"] = [
        { name: "Repo1", url: "https://repo1.com" },
      ];

      const exists = await devplate["devplateRepositryExists"]({
        name: "Repo2",
        url: "https://repo2.com",
      });

      expect(exists).toBe(false);
    });
  });

  describe("updateDevplateRepositoryJson", () => {
    test("should write new JSON to devplates.json and update repositories", async () => {
      const newJson = {
        devplateRepositories: [{ name: "Repo1", url: "https://repo1.com" }],
      };
      (path.join as jest.Mock).mockReturnValue("/mock/path/devplates.json");

      await devplate["updateDevplateRepositoryJson"](newJson);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "/mock/path/devplates.json",
        JSON.stringify(newJson, null, 2),
        "utf-8"
      );
    });
  });

  describe("addDevplateRepository", () => {
    test("should add a new repository if it does not exist", async () => {
      devplate["devplateRepositories"] = [
        { name: "Repo1", url: "https://repo1.com" },
      ];

      const newRepository = { name: "Repo2", url: "https://repo2.com" };
      const result = await devplate.addDevplateRepository(newRepository);

      expect(result).toBe(1);
      expect(fs.writeFile).toHaveBeenCalled();
    });

    test("should not add a repository if it already exists", async () => {
      devplate["devplateRepositories"] = [
        { name: "Repo1", url: "https://repo1.com" },
      ];

      const newRepository = { name: "Repo1", url: "https://repo1.com" };
      const result = await devplate.addDevplateRepository(newRepository);

      expect(result).toBe(0);
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe("removeDevplateRepository", () => {
    test("should remove an existing repository", async () => {
      devplate["devplateRepositories"] = [
        { name: "Repo1", url: "https://repo1.com" },
      ];

      const repositoryToRemove = { name: "Repo1", url: "https://repo1.com" };
      const result = await devplate.removeDevplateRepository(
        repositoryToRemove
      );

      expect(result).toBe(1);
      expect(fs.writeFile).toHaveBeenCalled();
    });

    test("should not remove a repository if it does not exist", async () => {
      devplate["devplateRepositories"] = [
        { name: "Repo1", url: "https://repo1.com" },
      ];

      const repositoryToRemove = { name: "Repo2", url: "https://repo2.com" };
      const result = await devplate.removeDevplateRepository(
        repositoryToRemove
      );

      expect(result).toBe(0);
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });
});
