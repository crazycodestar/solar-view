import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  inputs: defineTable({
    voltage: v.number(),
    current: v.number(),
    timestamp: v.string(),
  }),
  outputs: defineTable({
    voltage: v.number(),
    current: v.number(),
    timestamp: v.string(),
  }),
});
