import { Mutation } from "./mutation-manager";

export class Transformer {
  static isSameOrigin({ prev, next }: {
    prev: Mutation | null, next: Mutation,
  }): boolean {
    if (!prev) return false;

    return prev.origin.alice === next.origin.alice &&
      prev.origin.bob === next.origin.bob;
  }

  static isDifferentDirection({ prev, next }: {
    prev: Mutation | null, next: Mutation,
  }): boolean {
    if (!prev) return true;

    return prev.author !== next.author;
  }

  static performTransform({ prev, next }: {
    prev: Mutation | null, next: Mutation,
  }): void {
    if (!prev) return;

    if (prev.data.type === "insert" && next.data.type === "insert") {
      this.transformInsertInsert({ prev, next });
    } else if (prev.data.type === "insert" && next.data.type === "delete") {
      this.transformInsertDelete({ prev, next });
    } else if (prev.data.type === "delete" && next.data.type === "insert") {
      this.transformDeleteInsert({ prev, next });
    } else if (prev.data.type === "delete" && next.data.type === "delete") {
      this.transformDeleteDelete({ prev, next });
    }
    this.updateNextOriginFromPrevious({ prev, next });
  }

  // To transform two inserts, if the next mutation is at an index less
  // than the previous, don't need to do anything. Otherwise, the index
  // needs to be modified.
  static transformInsertInsert({ prev, next }: {
    prev: Mutation, next: Mutation,
  }): void {
    if (prev.data.index <= next.data.index) {
      next.data.index += prev.data.text!.length;
    }
  };

  // Same logic as insert insert.
  static transformInsertDelete({ prev, next }: {
    prev: Mutation, next: Mutation,
  }): void {
    if (prev.data.index <= next.data.index) {
      next.data.index += prev.data.text!.length;
    }
  }

  // To transform an insert and a delete, if the previous index
  // is less than the next, update next's index. Otherwise, don't do
  // anything.
  static transformDeleteInsert({ prev, next }: {
    prev: Mutation, next: Mutation,
  }): void {
    if (prev.data.index < next.data.index) {
      next.data.index -= prev.data.length!;
    }
  }

  // To transform two deletes, if the previous index is less than the next,
  // update next's index. But if they are equal, update next's index and length
  // to correspond with previous. If the exact same mutation is performed,
  // then the next's length should be 0.
  static transformDeleteDelete({ prev, next }: {
    prev: Mutation, next: Mutation,
  }): void {
    if (prev.data.index < next.data.index) {
      next.data.index -= prev.data.length!;
    } else if (prev.data.index === next.data.index) {
      if (prev.data.length! < next.data.length!) {
        next.data.index += prev.data.length!;
        next.data.length! -= prev.data.length!
      } else {
        next.data.length! = 0;
      }
    }
  }

  static updateNextOriginFromPrevious({ prev, next }: {
    prev: Mutation, next: Mutation,
  }): void {
    if (prev.author === "bob") {
      next.origin.bob += 1;
    } else if (prev.author === "alice") {
      next.origin.alice += 1;
    }
  }
}
