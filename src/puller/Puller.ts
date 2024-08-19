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

  initialize = async () => {
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
  };

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
      await this.logDevplates();
      const input = await inquirer.prompt({
        name: "devplateId",
        type: "number",
        message:
          "Please enter the Devplate ID number you would like to pull down or 0 to exit : ",
      });

      return input.devplateId;
    }
  };

  private cloneGithubSubdirectory = (repoUrl: string, subdirectory: string) => {
    try {
      shell.exec(`git clone --depth 1 ${repoUrl} temp_dir`);
      shell.cp("-Rf", `temp_dir/${subdirectory}/.`, ".");
      console.log(
        `Successfully cloned contents of ${subdirectory} from ${repoUrl}`
      );
    } catch (error) {
      console.error("Error:", error);
    } finally {
      shell.rm("-rf", "temp_dir");
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

  public pullSelectedDevplate = async () => {
    const devplateId = await this.selectDevplate();

    switch (devplateId) {
      case 0:
        process.exit(0);
      default:
        if (this.devplates) {
          try {
            console.log(
              `Pulling Devplate ${this.devplates[devplateId - 1].name}`
            );
            this.cloneGithubSubdirectory(
              this.repositoryUrl,
              this.devplates[devplateId - 1].name
            );

            process.exit(0);
          } catch (error: any) {
            console.log(
              "Pulling Devplate failed! Please make sure the Devplate exists."
            );
          }
        }
    }
  };

  public pullInputedDevplate = async (devplateId: string) => {
    try {
      const split: string[] = devplateId.split("/");
      const author = split[0];
      const repo = split[1];
      const devplate = split[2];

      const url = `https://github.com/${author}/${repo}`;

      const fetchUrl = this.toGithubApIurl(url);

      if (!fetchUrl) {
        throw new Error(
          "Pulling Devplate failed, please make sure the Devplate exists."
        );
      }
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(
          "Pulling Devplate failed, please make sure the Devplate exists."
        );
      }

      console.log(`Pulling Devplate ${devplate}`);

      this.cloneGithubSubdirectory(url, devplate);

      process.exit(0);
    } catch (e) {
      console.log(
        "Pulling Devplate failed, please make sure the Devplate exists."
      );
      process.exit(0);
    }
  };
}
