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

  describe("setDevplateRepositories", () => {
    test("should read and parse devplates.json", async () => {
      const mockData = JSON.stringify({
        devplateRepositories: [{ name: "Repo1", url: "https://repo1.com" }],
      });
      (fs.readFile as jest.Mock).mockResolvedValue(mockData as never);
      (path.join as jest.Mock).mockReturnValue("/mock/path/devplates.json");

      const repositories = await devplate["setDevplateRepositories"]();

      expect(fs.readFile).toHaveBeenCalledWith(
        "/mock/path/devplates.json",
        "utf-8"
      );
      expect(repositories).toEqual([
        { name: "Repo1", url: "https://repo1.com" },
      ]);
    });

    test("should return an empty array if an error occurs", async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(
        new Error("File read error") as never
      );
      const repositories = await devplate["setDevplateRepositories"]();
      expect(repositories).toEqual([]);
    });
  });

  describe("devplateRepositryExists", () => {
    test("should return true if repository exists", async () => {
      const mockRepositories = [{ name: "Repo1", url: "https://repo1.com" }];
      devplate["devplateRepositories"] = Promise.resolve(mockRepositories);

      const exists = await devplate["devplateRepositryExists"]({
        name: "Repo1",
        url: "https://repo1.com",
      });

      expect(exists).toBe(true);
    });

    test("should return false if repository does not exist", async () => {
      const mockRepositories = [{ name: "Repo1", url: "https://repo1.com" }];
      devplate["devplateRepositories"] = Promise.resolve(mockRepositories);

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
      const mockRepositories = [{ name: "Repo1", url: "https://repo1.com" }];
      devplate["devplateRepositories"] = Promise.resolve(mockRepositories);

      const newRepository = { name: "Repo2", url: "https://repo2.com" };
      const result = await devplate.addDevplateRepository(newRepository);

      expect(result).toBe(1);
      expect(fs.writeFile).toHaveBeenCalled();
    });

    test("should not add a repository if it already exists", async () => {
      const mockRepositories = [{ name: "Repo1", url: "https://repo1.com" }];
      devplate["devplateRepositories"] = Promise.resolve(mockRepositories);

      const newRepository = { name: "Repo1", url: "https://repo1.com" };
      const result = await devplate.addDevplateRepository(newRepository);

      expect(result).toBe(0);
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe("removeDevplateRepository", () => {
    test("should remove an existing repository", async () => {
      const mockRepositories = [{ name: "Repo1", url: "https://repo1.com" }];
      devplate["devplateRepositories"] = Promise.resolve(mockRepositories);

      const repositoryToRemove = { name: "Repo1", url: "https://repo1.com" };
      const result = await devplate.removeDevplateRepository(
        repositoryToRemove
      );

      expect(result).toBe(1);
      expect(fs.writeFile).toHaveBeenCalled();
    });

    test("should not remove a repository if it does not exist", async () => {
      const mockRepositories = [{ name: "Repo1", url: "https://repo1.com" }];
      devplate["devplateRepositories"] = Promise.resolve(mockRepositories);

      const repositoryToRemove = { name: "Repo2", url: "https://repo2.com" };
      const result = await devplate.removeDevplateRepository(
        repositoryToRemove
      );

      expect(result).toBe(0);
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });
});
