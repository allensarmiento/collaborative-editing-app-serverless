import * as admin from "firebase-admin";
import "firebase-functions";

// admin.initializeApp();
admin.initializeApp({
  databaseURL: "",
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
