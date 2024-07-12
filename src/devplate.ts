import { promises as fs } from "fs";
import * as path from "path";

interface DevplateRepository {
  name: string;
  url: string;
}

interface DevplateJson {
  devplateRepositories: DevplateRepository[];
}

export class Devplate {
  private devplateRepositories: Promise<DevplateRepository[]> | undefined;

  constructor() {
    this.devplateRepositories = this.setDevplateRepositories();
  }

  private setDevplateRepositories = async (): Promise<DevplateRepository[]> => {
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
    repository: DevplateRepository
  ): Promise<boolean> => {
    const repositories = await this.devplateRepositories;
    if (repositories) {
      return repositories.some(
        (repo) => repo.name === repository.name || repo.url === repository.url
      );
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

  public async getDevplateRepositories(): Promise<
    DevplateRepository[] | undefined
  > {
    return this.devplateRepositories;
  }

  public async toString(): Promise<string | undefined> {
    const repositories = await this.getDevplateRepositories();
    let ret = "";

    return ret;
  }

  public async addDevplateRepository(
    newRepository: DevplateRepository
  ): Promise<void> {
    const repositories = await this.getDevplateRepositories();
    const repositoryExists = await this.devplateRepositryExists(newRepository);
    if (repositories && repositoryExists === false) {
      repositories.push(newRepository);
      await this.updateDevplateRepositoryJson({
        devplateRepositories: repositories,
      });
      console.log("Devplate repository has been added.");
    } else {
      console.log("Devplate repository name or URL already exists.");
    }
  }

  public async removeDevplateRepository(
    newRepository: DevplateRepository
  ): Promise<void> {
    let repositories = await this.getDevplateRepositories();
    const repositoryExists = await this.devplateRepositryExists(newRepository);
    if (repositories && repositoryExists === true) {
      repositories = repositories.filter(
        (repo) =>
          repo.name !== newRepository.name && repo.url !== newRepository.url
      );
      await this.updateDevplateRepositoryJson({
        devplateRepositories: repositories,
      });
      console.log("Devplate repository has been removed.");
    } else {
      console.log("Devplate repository does not exist.");
    }
  }
}
