#! /usr/bin/env node

import { Devplate } from "./devplate";

const devplate = new Devplate();

const main = async () => {
  let plates = await devplate.getDevplateRepositories();
  console.log(plates);

  await devplate.addDevplateRepository("New devplate repo link");
  plates = await devplate.getDevplateRepositories();
  console.log(plates);

  await devplate.addDevplateRepository("New devplate repo link");
  plates = await devplate.getDevplateRepositories();
  console.log(plates);

  await devplate.removeDevplateRepository("New devplate repo link");
  plates = await devplate.getDevplateRepositories();
  console.log(plates);

  await devplate.removeDevplateRepository("New devplate repo link");
  plates = await devplate.getDevplateRepositories();
  console.log(plates);
};

main();
