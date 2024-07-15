var shell = require("shelljs");

interface Devplate {
  name: string;
}

export class Puller {
  private repositoryUrl: string;

  constructor(repositoryUrl: string) {
    this.repositoryUrl = repositoryUrl;
  }

  private getRepositoryUrl = (): string => {
    return this.repositoryUrl;
  };

  private toGithubApIurl(repoUrl: string): string | null {
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
  }

  public logDevplates = async () => {
    const fetchUrl = this.toGithubApIurl(this.getRepositoryUrl());
    console.log(
      `\nFetching list of Devplate names in repository ${fetchUrl}\n`
    );
    try {
      if (fetchUrl) {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData: Devplate[] = await response.json();
        jsonData.map((devplate: Devplate, index: number) => {
          console.log(`${index + 1}. ${devplate.name}`);
        });
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
