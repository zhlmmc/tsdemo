import { describe, it, expect, beforeEach, vi } from "vitest";
import { StateUtils } from "./stateUtils";

describe("StateUtils", () => {
  beforeEach(() => {
    // Clear all states, history and subscribers before each test
    StateUtils["states"] = new Map();
    StateUtils["history"] = new Map();
    StateUtils["subscribers"] = new Map();
  });

  describe("setState and getState", () => {
    it("should set and get state correctly", () => {
      StateUtils.setState("test", "value");
      expect(StateUtils.getState("test")).toBe("value");
    });

    it("should return undefined for non-existent key", () => {
      expect(StateUtils.getState("nonexistent")).toBeUndefined();
    });

    it("should keep history when option is enabled", () => {
      StateUtils.setState("test", "value1");
      StateUtils.setState("test", "value2", { keepHistory: true });
      expect(StateUtils["history"].get("test")).toEqual(["value1"]);
    });

    it("should not keep history when option is disabled", () => {
      StateUtils.setState("test", "value1");
      StateUtils.setState("test", "value2");
      expect(StateUtils["history"].has("test")).toBe(false);
    });
  });

  describe("subscribe", () => {
    it("should notify subscribers when state changes", () => {
      const subscriber = vi.fn();
      StateUtils.subscribe("test", subscriber);
      StateUtils.setState("test", "newValue");
      expect(subscriber).toHaveBeenCalledWith("newValue");
    });

    it("should allow multiple subscribers", () => {
      const subscriber1 = vi.fn();
      const subscriber2 = vi.fn();
      StateUtils.subscribe("test", subscriber1);
      StateUtils.subscribe("test", subscriber2);
      StateUtils.setState("test", "newValue");
      expect(subscriber1).toHaveBeenCalledWith("newValue");
      expect(subscriber2).toHaveBeenCalledWith("newValue");
    });

    it("should return unsubscribe function", () => {
      const subscriber = vi.fn();
      const unsubscribe = StateUtils.subscribe("test", subscriber);
      unsubscribe();
      StateUtils.setState("test", "newValue");
      expect(subscriber).not.toHaveBeenCalled();
    });
  });

  describe("undo", () => {
    it("should restore previous state", () => {
      StateUtils.setState("test", "value1");
      StateUtils.setState("test", "value2", { keepHistory: true });
      expect(StateUtils.undo("test")).toBe(true);
      expect(StateUtils.getState("test")).toBe("value1");
    });

    it("should notify subscribers on undo", () => {
      const subscriber = vi.fn();
      StateUtils.subscribe("test", subscriber);
      StateUtils.setState("test", "value1");
      StateUtils.setState("test", "value2", { keepHistory: true });
      StateUtils.undo("test");
      expect(subscriber).toHaveBeenLastCalledWith("value1");
    });

    it("should return false when no history exists", () => {
      expect(StateUtils.undo("test")).toBe(false);
    });

    it("should return false when history is empty", () => {
      StateUtils.setState("test", "value");
      expect(StateUtils.undo("test")).toBe(false);
    });
  });
});
