#! /usr/bin/env node

import { Devplate } from "./devplate";

const devplate = new Devplate();

const main = async () => {
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

main();
