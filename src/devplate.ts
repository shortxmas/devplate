import { promises as fs } from "fs";
import * as path from "path";

interface DevplateJson {
  devplateRepositories: string[];
}

export class Devplate {
  private devplateRepositories: Promise<string[]> | undefined;

  constructor() {
    this.devplateRepositories = this.setDevplateRepositories();
  }

  private setDevplateRepositories = async (): Promise<string[]> => {
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

  private devplateRepositryExists = async (
    devplateLink: string
  ): Promise<boolean> => {
    const repositories = await this.devplateRepositories;
    if (repositories && repositories.includes(devplateLink)) {
      return true;
    } else {
      return false;
    }
  };

  private updateDevplateRepositoryJson = async (
    newJson: DevplateJson
  ): Promise<void> => {
    await fs.writeFile(
      path.join(__dirname, "../devplates.json"),
      JSON.stringify(newJson, null, 2),
      "utf-8"
    );
    this.devplateRepositories = this.setDevplateRepositories();
  };

  public async getDevplateRepositories(): Promise<string[] | undefined> {
    return this.devplateRepositories;
  }

  public async addDevplateRepository(devplateLink: string): Promise<void> {
    const repositories = await this.getDevplateRepositories();
    const repositoryExists = await this.devplateRepositryExists(devplateLink);
    if (repositories && repositoryExists === false) {
      repositories.push(devplateLink);
      await this.updateDevplateRepositoryJson({
        devplateRepositories: repositories,
      });
      console.log("Devplate repository has been added.");
    } else {
      console.log("Devplate repository has not been added.");
    }
  }

  public async removeDevplateRepository(devplateLink: string): Promise<void> {
    let repositories = await this.getDevplateRepositories();
    const repositoryExists = await this.devplateRepositryExists(devplateLink);
    if (repositories && repositoryExists === true) {
      repositories = repositories.filter((repo) => repo !== devplateLink);
      await this.updateDevplateRepositoryJson({
        devplateRepositories: repositories,
      });
      console.log("Devplate repository has been removed.");
    } else {
      console.log("Devplate repository has not been removed.");
    }
  }
}
