import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";
import { DevplateRepository } from "../devplate/Devplate";

const firebaseConfig = {
  apiKey: "AIzaSyBp0P6mrbmEXHxy7nR9gWndXOqTekesNAE",
  databaseURL: "https://devplate-1cf7c-default-rtdb.firebaseio.com",
  projectId: "devplate-1cf7c",
  messagingSenderId: "413404523011",
  appId: "1:413404523011:web:080ceed868908f33c67c36",
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export const writeDevplateRepository = (data: DevplateRepository): void => {
  const dbRef = ref(database, "repositories");
  push(dbRef, data.url);
};
