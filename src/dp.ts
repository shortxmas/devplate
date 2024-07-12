import { promises as fs } from "fs";
import * as path from "path";

interface DevplateJson {
  devplateRepositories: string[];
}

export class Devplate {
  private devplateRepositories: Promise<string[]> | Promise<undefined>;

  constructor() {
    this.devplateRepositories = this.setDevplateRepositories();
  }

  private setDevplateRepositories = async () => {
    const filePath = path.join(__dirname, "../devplates.json");
    let ret: DevplateJson = { devplateRepositories: [] };
    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      const jsonData: DevplateJson = JSON.parse(fileData);
      ret = jsonData;
    } catch (e: any) {
      console.error(e);
    }
    return ret.devplateRepositories;
  };

  public async getDevplateRepositories(): Promise<string[] | undefined> {
    return await this.devplateRepositories;
  }
}
