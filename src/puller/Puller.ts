var shell = require("shelljs");
import inquirer from "inquirer";

interface Devplate {
  name: string;
}

export class Puller {
  private repositoryUrl: string;
  private devplates: Devplate[] | undefined;

  constructor(repositoryUrl: string) {
    this.repositoryUrl = repositoryUrl;
  }

  async initialize() {
    const ret: Devplate[] = [];
    const fetchUrl = this.toGithubApIurl(this.getRepositoryUrl());
    try {
      if (!fetchUrl) {
        throw new Error("Failed to fetch data");
      }
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData: Devplate[] = await response.json();
      jsonData.map((devplate: Devplate, index: number) => {
        ret.push(devplate);
      });
    } catch (error) {
      console.log(error);
    }
    this.devplates = ret;
  }

  private getRepositoryUrl = (): string => {
    return this.repositoryUrl;
  };

  private toGithubApIurl = (repoUrl: string): string | null => {
    const githubUrlRegex =
      /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)$/i;
    const match = repoUrl.match(githubUrlRegex);

    if (match && match.length === 3) {
      const owner = match[1];
      const repo = match[2];
      return `https://api.github.com/repos/${owner}/${repo}/contents`;
    } else {
      return null;
    }
  };

  private selectDevplate = async () => {
    while (true) {
      console.log("\n**************************************************");
      await this.logDevplates();
      const input = await inquirer.prompt({
        name: "devplateId",
        type: "number",
        message:
          "Please enter the Devplate ID number you would like to pull down",
      });

      return input.devplateId;
    }
  };

  public logDevplates = async () => {
    console.log(
      `\nFetching list of Devplate names in repository ${this.repositoryUrl}\n`
    );
    if (this.devplates) {
      this.devplates.map((devplate, index) => {
        console.log(`${index + 1}. ${devplate.name}`);
      });
    }
  };

  // public pullDevplate = async ()=>{
  //   const devplateId = await this.selectDevplate();

  //   switch (devplateId) {
  //     case 0:
  //       process.exit(0);
  //     default:
  //       if (repositories) {
  //         try {
  //           console.log(
  //             "Showing devplates in repository : ",
  //             repositories[devplateRepoId - 1].name
  //           );
  //           const puller = new Puller(repositories[devplateRepoId - 1].url);
  //           await puller.logDevplates();

  //           process.exit(0);
  //         } catch (error: any) {
  //           console.log(
  //             "The ID you entered doesn't match any Devplate repository."
  //           );
  //         }
  //       }
  //   }

  // }

  // cloneGithubSubdirectory = (repoUrl, subdirectory) => {
  //   try {
  //     shell.exec(`git clone --depth 1 ${repoUrl} temp_dir`);
  //     shell.cp("-Rf", `temp_dir/pmps/${subdirectory}/.`, ".");
  //     console.log(
  //       `Successfully cloned contents of ${subdirectory} from ${repoUrl}`
  //     );
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //   } finally {
  //     shell.rm("-rf", "temp_dir");
  //   }
  // };
}
