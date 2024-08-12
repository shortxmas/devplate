import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { Puller } from "../src/puller/Puller";

type FetchMock = jest.MockedFunction<typeof fetch>;

global.fetch = jest.fn() as FetchMock;

describe("Puller class", () => {
  let puller: Puller;

  beforeEach(() => {
    puller = new Puller("https://github.com/user/repo");
    jest.clearAllMocks();
  });

  describe("toGithubApIurl", () => {
    test("should convert GitHub URL to API URL", () => {
      const repoUrl = "https://github.com/user/repo";
      const apiUrl = puller["toGithubApIurl"](repoUrl);
      expect(apiUrl).toBe("https://api.github.com/repos/user/repo/contents");
    });

    test("should return null for invalid URL", () => {
      const invalidUrl = "https://example.com/user/repo";
      const apiUrl = puller["toGithubApIurl"](invalidUrl);
      expect(apiUrl).toBeNull();
    });
  });

  describe("getRepositoryUrl", () => {
    test("should return the repository URL", () => {
      const repoUrl = puller["getRepositoryUrl"]();
      expect(repoUrl).toBe("https://github.com/user/repo");
    });
  });

  describe("initialize", () => {
    test("should fetch and initialize devplates", async () => {
        const mockResponse = [
          { name: "devplate1" },
          { name: "devplate2" },
        ];
  
        const mockFetchResponse = {
          ok: true,
          json: async () => mockResponse,
        } as unknown as Response;
  
        (global.fetch as FetchMock).mockResolvedValue(mockFetchResponse);
  
        await puller.initialize();
  
        expect(global.fetch).toHaveBeenCalledWith(
          "https://api.github.com/repos/user/repo/contents"
        );
        expect(puller["devplates"]).toEqual(mockResponse);
      });

      test("should handle fetch errors", async () => {
        const mockFetchResponse = {
          ok: false,
          json: async () => [],
        } as unknown as Response;
      
        (global.fetch as FetchMock).mockResolvedValue(mockFetchResponse);
      
        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      
        await puller.initialize();
      
        expect(global.fetch).toHaveBeenCalledWith(
          "https://api.github.com/repos/user/repo/contents"
        );
        expect(consoleSpy).toHaveBeenCalledWith(new Error("Failed to fetch data"));
        expect(puller["devplates"]).toEqual([]);
        
        consoleSpy.mockRestore();
      });
  });

  describe("logDevplates", () => {
    test("should log devplate names", async () => {
        puller["devplates"] = [
          { name: "devplate1" },
          { name: "devplate2" },
        ];
      
        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      
        await puller.logDevplates();
      
        expect(consoleSpy).toHaveBeenCalledWith(
          "\nFetching list of Devplate names in repository https://github.com/user/repo\n"
        );
        expect(consoleSpy).toHaveBeenCalledWith("1. devplate1");
        expect(consoleSpy).toHaveBeenCalledWith("2. devplate2");
      
        consoleSpy.mockRestore();
      });
      
      test("should not log anything if devplates is undefined", async () => {
        puller["devplates"] = undefined;

        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      
        await puller.logDevplates();
      
        expect(consoleSpy).toHaveBeenCalledTimes(1);
      
        consoleSpy.mockRestore();
      });
  });
});
