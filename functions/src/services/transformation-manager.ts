import {Mutation} from "./mutation-manager";

export class TransformationManager {
  static transform(lastMutation: Mutation, newMutation: Mutation): void {
    if (lastMutation && this.calculateOffBy(lastMutation, newMutation) === 1) {
      newMutation.origin.alice = lastMutation.origin.alice;
      newMutation.origin.bob = lastMutation.origin.bob;

      if (lastMutation.data.index <= newMutation.data.index) {
        if (lastMutation.data.type === "insert") {
          newMutation.data.index += lastMutation.data.text!.length;
        } else if (lastMutation.data.type === "delete") {
          newMutation.data.index -= lastMutation.data.length!;
        }
      }
    }
  }

  static calculateOffBy(lastMutation: Mutation, newMutation: Mutation): number {
    if (!lastMutation) {
      return 0;
    }
    return Math.abs(newMutation.origin.alice - lastMutation.origin.alice) +
        Math.abs(newMutation.origin.bob - lastMutation.origin.bob);
  }
}
