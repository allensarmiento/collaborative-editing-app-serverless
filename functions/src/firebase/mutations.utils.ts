import { mutationRef, mutationConversationRef } from "./firebase";
import { Mutation } from "../services/mutation-manager";

export const retrieveConversationMutations =
  async (conversationId: string): Promise<Mutation[]> => {
    const mutationsSnapshot = await mutationConversationRef(conversationId)
        .once("value");

    if (!mutationsSnapshot.exists()) {
      return [];
    }

    const mutationKeys = Object.keys(mutationsSnapshot.val());
    const mutations: Mutation[] = [];

    mutationKeys.map((mutationId) => {
      const currentMutation = mutationsSnapshot.val()[mutationId];
      const mutation: Mutation = {
        author: currentMutation.author,
        data: { ...currentMutation.data },
        origin: { ...currentMutation.origin },
      };
      mutations.push(mutation);
    });

    return mutations;
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

export const addMutationToConversation = ({ conversationId, mutation }: {
    conversationId: string, mutation: Mutation }): void => {
  mutationConversationRef(conversationId).push(mutation);
};
