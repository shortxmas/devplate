import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, get, child } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBp0P6mrbmEXHxy7nR9gWndXOqTekesNAE",
  databaseURL: "https://devplate-1cf7c-default-rtdb.firebaseio.com",
  projectId: "devplate-1cf7c",
  messagingSenderId: "413404523011",
  appId: "1:413404523011:web:080ceed868908f33c67c36",
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export const writeDevplateRepository = async (data: {
  url: string;
}): Promise<void> => {
  const dbRef = ref(database, "repositories");
  try {
    const snapshot = await get(dbRef);
    const urlExists =
      snapshot.exists() &&
      Object.values(snapshot.val()).some((repoUrl) => repoUrl === data.url);

    if (!urlExists) {
      push(dbRef, data.url);
    }
  } catch (error) {
    console.error("Error writing to database: ", error);
  }
};
