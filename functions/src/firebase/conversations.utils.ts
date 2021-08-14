import {
  conversationRef,
  conversationsRef,
  mutationConversationRef,
} from "./firebase";
import { retrieveLastMutation } from "./mutations.utils";
import { Mutation } from "../services/mutation-manager";

export interface Conversation {
  id: string;
  lastMutation?: Mutation | null;
  text: string;
}

export const deleteConversation = (conversationId: string): void => {
  mutationConversationRef(conversationId).remove();
  conversationRef(conversationId).remove();
};

export const retrieveConversations = async (): Promise<Conversation[]> => {
  const conversationsSnapshot = await conversationsRef().once("value");

  const conversations: Conversation[] = [];
  conversationsSnapshot.forEach((childSnapshot) => {
    const conversationId = childSnapshot.key;
    conversations.push({
      id: conversationId!,
      text: childSnapshot.val().text,
    });
  });

  for (const conversation of conversations) {
    conversation.lastMutation = await retrieveLastMutation(conversation.id);
  }

  return conversations;
};

export const retrieveConversation =
  async (conversationId: string): Promise<Conversation | null> => {
    const conversationSnapshot = await conversationRef(conversationId)
        .once("value");

    if (!conversationSnapshot.exists()) {
      return null;
    }

    return {
      id: conversationSnapshot.key!,
      text: conversationSnapshot.val().text,
    };
  };

export const addConversation = (text: string): Conversation => {
  const newConversationRef = conversationsRef().push({ text });
  const newConversationKey = newConversationRef.key;

  return {
    id: newConversationKey!,
    text,
  };
};

export const updateConversation =
  (conversationId: string, text: string): void => {
    conversationRef(conversationId).update({ text });
  };
