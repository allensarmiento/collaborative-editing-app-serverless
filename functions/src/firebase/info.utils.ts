import { db } from "./firebase";

interface Info {
  answers: string[],
  author: {
    email: string;
    name: string;
  }
  frontend: {
    url: string;
  }
  language: string;
  sources: string;
}

export const retrieveInfo = async (): Promise<Info> => {
  const infoRef = db.ref("info");
  const infoSnapshot = await infoRef.once("value");

  return infoSnapshot.val();
};
