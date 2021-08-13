import { mutationRef, mutationConversationRef } from "./firebase";
import { Mutation } from "../services/mutation-manager";

export const retrieveConversationMutations =
  async (conversationId: string): Promise<Mutation[] | null> => {
    const mutationsSnapshot = await mutationConversationRef(conversationId)
        .once("value");

    if (!mutationsSnapshot.exists()) {
      return null;
    }

    return mutationsSnapshot.val();
  };

export const retrieveLastMutation =
  async (conversationId: string): Promise<Mutation | null> => {
    const mutationSnapshot = await mutationConversationRef(conversationId)
        .limitToLast(1)
        .once("value");

    if (!mutationSnapshot.exists()) {
      return null;
    }

    const lastMutationKey = Object.keys(mutationSnapshot.val())[0];
    const lastSnapshot = await mutationRef(conversationId, lastMutationKey)
        .once("value");

    return lastSnapshot.val();
  };

export const addMutationToConversation =
  (conversationId: string, mutation: Mutation): void => {
    mutationConversationRef(conversationId).push(mutation);
  };
