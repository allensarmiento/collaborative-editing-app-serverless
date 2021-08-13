export interface Mutation {
  author: string;
  data: {
    index: number;
    length?: number;
    text?: string;
    type: "insert" | "delete";
  }
  origin: {
    alice: number;
    bob: number;
  }
}

export class MutationManager {
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
}
