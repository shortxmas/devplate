#! /usr/bin/env node

import { Devplate } from "../devplate/Devplate";
import yargs from "yargs";

let commandArray = [];

let devplate: Devplate | null = null;

const getDevplateInstance = async (): Promise<Devplate> => {
  if (!devplate) {
    devplate = new Devplate();
    await devplate.initalizeDevplateRepositories();
  }
  return devplate;
};

yargs.command({
  command: "repo",
  describe: "Repository commands",
  builder: (yargs) => {
    yargs.command({
      command: "add",
      describe: "Add a new Devplate repository",
      async handler() {
        const devplateInstance = await getDevplateInstance();
        await devplateInstance.promptAddDevplateRepository();
      },
    });

    yargs.command({
      command: "view",
      describe: "View Devplate repositories",
      async handler() {
        const devplateInstance = await getDevplateInstance();
        devplateInstance.logDevplateRepositories();
      },
    });

    yargs.command({
      command: "remove",
      describe: "Remove a Devplate repository",
      async handler() {
        const devplateInstance = await getDevplateInstance();
        await devplateInstance.promptRemoveDevplateRepository();
      },
    });

    return yargs;
  },
  handler: () => {
    console.log(
      "Please specify a valid subcommand, e.g., 'dp repo add' or 'dp repo view'."
    );
  },
});

commandArray.push({
  command: "repo add",
  arguments: "",
});
commandArray.push({
  command: "repo remove",
  arguments: "",
});
commandArray.push({
  command: "repo view",
  arguments: "",
});

yargs.command({
  command: "select",
  describe: "Select a Devplate to pull down",
  async handler() {
    const devplateInstance = await getDevplateInstance();
    await devplateInstance.selectDevplate();
  },
});
commandArray.push({
  command: "select",
  arguments: "",
});

yargs.command({
  command: "pull <id>",
  describe: "Pull down a Devplate via Devplate ID",
  builder: {
    id: {
      describe: "Devplate ID to pull",
      demandOption: true,
      type: "string",
    },
  },
  async handler(argv) {
    const devplateInstance = await getDevplateInstance();
    const devplateId = argv.id;
    await devplateInstance.pullInputedDevplate(devplateId);
  },
});

commandArray.push({
  command: "pull",
  arguments: "<id>",
});

yargs.command({
  command: "view",
  describe: "View devplates",
  async handler() {
    const devplateInstance = await getDevplateInstance();
    await devplateInstance.viewDevplates();
  },
});
commandArray.push({
  command: "view",
  arguments: "",
});

const logExistingCommands = () => {
  console.log("Existing commands:");
  commandArray.map((command, index) => {
    if (command.arguments !== "") {
      console.log(`${index + 1}:${command.command} ${command.arguments}`);
    } else {
      console.log(`${index + 1}:${command.command}`);
    }
  });
};

yargs.command("*", false, () => {
  console.error("Error: Command not found!");
  logExistingCommands();
  yargs.showHelp();
});

yargs.help("h").alias("h", "help");

yargs.version("0.0.1");

yargs.parse();
