#! /usr/bin/env node

import { Devplate } from "../devplate/Devplate";
import yargs from "yargs";

let commandArray = [];

yargs.command({
  command: "repo",
  describe: "Repository commands",
  builder: (yargs) => {
    yargs.command({
      command: "add",
      describe: "Add a new Devplate repository",
      async handler() {
        const devplate = new Devplate();
        await devplate.promptAddDevplateRepository();
      },
    });

    yargs.command({
      command: "view",
      describe: "View Devplate repositories",
      async handler() {
        const devplate = new Devplate();
        await devplate.logDevplateRepositories();
      },
    });

    yargs.command({
      command: "remove",
      describe: "Remove a Devplate repositories",
      async handler() {
        const devplate = new Devplate();
        await devplate.promptRemoveDevplateRepository();
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
    const devplate = new Devplate();
    await devplate.selectDevplate();
  },
});
commandArray.push({
  command: "select",
  arguments: "",
});

yargs.command({
  command: "view",
  describe: "View devplates",
  async handler() {
    const devplate = new Devplate();
    await devplate.viewDevplates();
  },
});
commandArray.push({
  command: "view",
  arguments: "",
});

const logExistingCommands = () => {
  let counter = 1;
  console.log("Existing commands:");
  commandArray.forEach((command) => {
    if (command.arguments != "") {
      console.log(`${counter}:${command.command} ${command.arguments}`);
    } else {
      console.log(`${counter}:${command.command}`);
    }
    counter++;
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
