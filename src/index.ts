#! /usr/bin/env node

import { Devplate } from "./dp";

const devplate = new Devplate();

const test = async () => {
  const plates = await devplate.getDevplateRepositories();
  console.log(plates);
};

test();
