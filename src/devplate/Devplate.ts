import { promises as fs } from "fs";
import * as path from "path";
import inquirer from "inquirer";
import { Puller } from "../puller/Puller";

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
    const filePath = path.join(__dirname, "../../devplates.json");
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
      path.join(__dirname, "../../devplates.json"),
      JSON.stringify(newJson, null, 2),
      "utf-8"
    );
    this.devplateRepositories = this.setDevplateRepositories();
  };

  private selectDevplateRepository = async (): Promise<number> => {
    while (true) {
      await this.logDevplateRepositories();
      const input = await inquirer.prompt({
        name: "devplateRepoId",
        type: "number",
        message:
          "Please enter the Devplate repository ID to view Devplates in or enter 0 to exit.",
      });

      return input.devplateRepoId;
    }
  };

  public logDevplateRepositories = async (): Promise<void> => {
    const repositories = await this.getDevplateRepositories();
    repositories?.map((repository, index) => {
      console.log(`\n${index + 1} : ${repository.name} | ${repository.url}\n`);
    });
  };

  public getDevplateRepositories = async (): Promise<
    DevplateRepository[] | undefined
  > => {
    return this.devplateRepositories;
  };

  public selectDevplate = async (): Promise<void> => {
    const repositories = await this.getDevplateRepositories();
    const devplateRepoId = await this.selectDevplateRepository();

    switch (devplateRepoId) {
      case 0:
        process.exit(0);
      default:
        if (repositories) {
          try {
            console.log(
              "Showing devplates in repository : ",
              repositories[devplateRepoId - 1].name
            );
            const puller = new Puller(repositories[devplateRepoId - 1].url);
            await puller.initialize();
            await puller.pullDevplate();

            process.exit(0);
          } catch (error: any) {
            console.log(
              "The ID you entered doesn't match any Devplate repository."
            );
          }
        }
    }
  };

  public viewDevplates = async (): Promise<void> => {
    const repositories = await this.getDevplateRepositories();
    const devplateRepoId = await this.selectDevplateRepository();

    switch (devplateRepoId) {
      case 0:
        process.exit(0);
      default:
        if (repositories) {
          try {
            console.log(
              "Showing devplates in repository : ",
              repositories[devplateRepoId - 1].name
            );
            const puller = new Puller(repositories[devplateRepoId - 1].url);
            await puller.initialize();
            await puller.logDevplates();

            process.exit(0);
          } catch (error: any) {
            console.log(
              "The ID you entered doesn't match any Devplate repository."
            );
          }
        }
    }
  };

  public promptAddDevplateRepository = async () => {
    const devplateRepoUrl = await inquirer.prompt({
      name: "url",
      type: "input",
      message: "Please enter the Devplate repository URL or enter 0 to exit.",
    });

    const devplateRepoName = await inquirer.prompt({
      name: "name",
      type: "input",
      message:
        "Please enter a name for your Devplate repository or enter 0 to exit.",
    });

    const newRepository: DevplateRepository = {
      name: devplateRepoName.name,
      url: devplateRepoUrl.url,
    };
    this.addDevplateRepository(newRepository);
  };

  public addDevplateRepository = async (
    newRepository: DevplateRepository
  ): Promise<number> => {
    const repositories = await this.getDevplateRepositories();
    const repositoryExists = await this.devplateRepositryExists(newRepository);
    if (repositories && repositoryExists === false) {
      repositories.push(newRepository);
      await this.updateDevplateRepositoryJson({
        devplateRepositories: repositories,
      });
      console.log("Devplate repository has been added.");
      return 1;
    } else {
      console.log("Devplate repository name or URL already exists.");
      return 0;
    }
  };

  public removeDevplateRepository = async (
    newRepository: DevplateRepository
  ): Promise<number> => {
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
      return 1;
    } else {
      console.log("Devplate repository does not exist.");
      return 0;
    }
  };
}
