import {db} from "./firebase";

export const retrieveInfo = async () => {
  const infoRef = db.ref("info");
  const infoSnapshot = await infoRef.once("value");
  
  return infoSnapshot.val();
};
