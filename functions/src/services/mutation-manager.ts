import { Transformer } from "./transformer";

interface Origin {
  alice: number;
  bob: number;
}

export interface Mutation {
  author: string;
  data: {
    index: number;
    length?: number;
    text?: string;
    type: "insert" | "delete";
  }
  origin: Origin;
}

export class MutationManager {
  static attemptTransformations({ newMutation, mutationStack }: {
    newMutation: Mutation, mutationStack: Mutation[],
  }): void {
    let lastMutation = mutationStack[mutationStack.length - 1];
    let isSameOrigin = Transformer
        .isSameOrigin({ prev: lastMutation, next: newMutation });
    const isDifferentDirection = Transformer
        .isDifferentDirection({ prev: lastMutation, next: newMutation });

    if (isSameOrigin && !isDifferentDirection) {
      throw new Error("Attempting to modify the same document twice");
    }

    if (lastMutation) {
      if (this.isBehind({
        lastOrigin: lastMutation.origin,
        newOrigin: newMutation.origin,
      })) {
        const allMutations = [ ...mutationStack ];

        const mutationIndex = this.backtrackToModifiableOrigin({
          mutations: allMutations, newMutation });

        this.transformNewMutationFromPrev({
          index: mutationIndex,
          prev: allMutations,
          next: newMutation,
        });

        lastMutation = allMutations[allMutations.length - 1];
        isSameOrigin = Transformer.isSameOrigin({
          prev: lastMutation, next: newMutation,
        });
      }
    }

    if (isSameOrigin) {
      Transformer.performTransform({ prev: lastMutation, next: newMutation });
    }
  }

  static mutate(current: string, mutation: Mutation): string {
    const { data: { type, index, length, text } } = mutation;

    if (type === "insert" && text !== undefined) {
      return this.insert(current, index, text);
    } else if (type === "delete" && length !== undefined) {
      return this.delete(current, index, length);
    }
    return "";
  }

  static insert(current: string, index: number, text: string): string {
    return current.slice(0, index) + text + current.slice(index);
  }

  static delete(current: string, index: number, length: number): string {
    return current.slice(0, index) + current.slice(index + length);
  }

  static isBehind({ lastOrigin, newOrigin }: {
    lastOrigin: Origin, newOrigin: Origin,
  }): boolean {
    return newOrigin.alice < lastOrigin.alice ||
      newOrigin.bob < lastOrigin.bob;
  }

  static backtrackToModifiableOrigin({ mutations, newMutation }: {
    mutations: Mutation[], newMutation: Mutation,
  }): number {
    let mutationIndex = mutations.length - 1;

    while (mutationIndex >= 0) {
      const currentMutation = mutations[mutationIndex];

      const isSameOrigin = Transformer
          .isSameOrigin({ prev: currentMutation, next: newMutation });

      if (isSameOrigin) break;

      if (this.wentTooFarBack({
        lastOrigin: currentMutation.origin,
        newOrigin: newMutation.origin,
      })) {
        mutationIndex += 1;
        this.copyNextMutationOriginFromPrev({
          prev: mutations[mutationIndex].origin,
          next: newMutation.origin,
        });
        break;
      }

      mutationIndex--;
    }

    return mutationIndex;
  }

  static wentTooFarBack({ lastOrigin, newOrigin }: {
    lastOrigin: Origin, newOrigin: Origin,
  }): boolean {
    return lastOrigin.alice < newOrigin.alice &&
        lastOrigin.bob < newOrigin.bob;
  }

  static copyNextMutationOriginFromPrev({ prev, next }: {
    prev: Origin, next: Origin,
  }): void {
    next.alice = prev.alice;
    next.bob = prev.bob;
  }

  static transformNewMutationFromPrev({ index, prev, next }: {
    index: number, prev: Mutation[], next: Mutation,
  }): void {
    for (let i = index; i < prev.length; i++) {
      Transformer.performTransform({ prev: prev[i], next });
    }
  }
}
