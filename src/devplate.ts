import { promises as fs } from "fs";
import * as path from "path";
import inquirer from "inquirer";

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

  public getDevplateRepositories = async (): Promise<
    DevplateRepository[] | undefined
  > => {
    return this.devplateRepositories;
  };

  private logDevplateRepositories = async (): Promise<void> => {
    const repositories = await this.getDevplateRepositories();
    repositories?.map((repository, index) => {
      console.log(`\n${index + 1} : ${repository.name} | ${repository.url}`);
    });
  };

  public viewDevplates = async (): Promise<void> => {
    const repositories = await this.getDevplateRepositories();
    while (true) {
      console.log("\n**************************************************");
      await this.logDevplateRepositories();

      console.log(
        "\nPlease enter the Devplate repository ID to view Devplates in or enter 0 to exit."
      );
      const input = await inquirer.prompt({
        name: "devplateRepoId",
        type: "number",
        message: "Enter Devplate repository ID : ",
      });

      switch (input.devplateRepoId) {
        case 0:
          process.exit(0);
        default:
          if (repositories) {
            try {
              // Add in command to show devplates in a devplate repository
              console.log(
                "Showing devplates in repository : ",
                repositories[input.devplateRepoId - 1].name
              );
              process.exit(0);
            } catch (error: any) {
              console.log(
                "The ID you entered doesn't match any Devplate repository."
              );
            }
          }
      }
    }
  };

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

export const test = async () => {
  const devplate = new Devplate();

  let plates = await devplate.getDevplateRepositories();
  console.log(plates);

  console.log("\nAdding new repo");
  await devplate.addDevplateRepository({
    name: "New devplate repo name",
    url: "New devplate repo URL",
  });
  plates = await devplate.getDevplateRepositories();
  console.log(plates);

  console.log("\nAdding new repo");
  await devplate.addDevplateRepository({
    name: "New devplate repo name",
    url: "New devplate repo URL",
  });
  plates = await devplate.getDevplateRepositories();
  console.log(plates);

  console.log("\nRemoving new repo");
  await devplate.removeDevplateRepository({
    name: "New devplate repo name",
    url: "New devplate repo URL",
  });
  plates = await devplate.getDevplateRepositories();
  console.log(plates);

  console.log("\nRemoving new repo");
  await devplate.removeDevplateRepository({
    name: "New devplate repo name",
    url: "New devplate repo URL",
  });
  plates = await devplate.getDevplateRepositories();
  console.log(plates);
};
