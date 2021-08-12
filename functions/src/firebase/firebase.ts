import * as admin from "firebase-admin";

const serviceAccount = require("../../service-account.json");

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG!);
adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp(adminConfig);

export const db = admin.database();

export const conversationsRef = () => db.ref("conversations");

export const conversationRef =
  (conversationId: string) => db.ref(`conversations/${conversationId}`);

export const mutationsRef = () => db.ref("mutations");

export const mutationConversationRef = 
  (conversationId: string) => db.ref(`mutations/${conversationId}`);

  export const mutationRef =
  (conversationId: string, mutationId: string) =>
    db.ref(`mutations/${conversationId}/${mutationId}`);
