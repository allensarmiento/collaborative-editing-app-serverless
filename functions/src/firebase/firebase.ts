import * as admin from "firebase-admin";
// const serviceAccount = require("../../service-account.json");

// const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG!);
// adminConfig.credential = admin.credential.cert(serviceAccount);
// admin.initializeApp(adminConfig);
admin.initializeApp({
  databaseURL: "https://collaborative-editing-system-default-rtdb.firebaseio.com",
});

export const db = admin.database();

export const conversationsRef =
  (): admin.database.Reference => db.ref("conversations");

export const conversationRef =
  (conversationId: string): admin.database.Reference =>
    db.ref(`conversations/${conversationId}`);

export const mutationsRef = (): admin.database.Reference => db.ref("mutations");

export const mutationConversationRef =
  (conversationId: string): admin.database.Reference =>
    db.ref(`mutations/${conversationId}`);

export const mutationRef =
  (conversationId: string, mutationId: string): admin.database.Reference =>
    db.ref(`mutations/${conversationId}/${mutationId}`);

export const conversationsRefWithId =
  (id: string): admin.database.Reference => db.ref(`conversations/${id}`);
