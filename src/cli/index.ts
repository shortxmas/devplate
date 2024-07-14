#! /usr/bin/env node

import { Devplate } from "../devplate";
import { test } from "../devplate";
import yargs from "yargs";

let commandArray = [];

yargs.command({
  command: "test",
  describe: "Adding and removing Devplate repositories test function",
  async handler() {
    await test();
  },
});
commandArray.push({
  command: "test",
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
