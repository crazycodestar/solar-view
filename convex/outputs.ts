import { v } from "convex/values";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";

type Input = DataModel["inputs"]["document"];
type InputWithOutSystemInputs = Omit<
  DataModel["inputs"]["document"],
  "_id" | "_creationTime"
>;

export const getInputData = query({
  args: {
    duration: v.union(v.literal("day"), v.literal("week"), v.literal("month")),
    referenceTime: v.string(),
  },
  handler: async (ctx, { duration, referenceTime }) => {
    const now = new Date(referenceTime);

    if (duration === "day") {
      const values: Input[] = [];
      for await (const input of ctx.db.query("inputs")) {
        const timestamp = new Date(input.timestamp);

        if (timestamp.getDate() === now.getDate()) {
          values.push(input);
        }
      }

      return values;
    }

    if (duration === "week") {
      const values: Record<string, InputWithOutSystemInputs> = {};
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());

      for await (const input of ctx.db.query("inputs")) {
        const timestamp = new Date(input.timestamp);

        if (timestamp >= startOfWeek && timestamp <= now) {
          const current = values[timestamp.getDay().toString()];
          if (!current) {
            values[timestamp.getDay().toString()] = {
              voltage: 0,
              current: 0,
              timestamp: timestamp.toISOString(),
            };
          }

          values[timestamp.getDay().toString()] = {
            voltage: current.voltage + input.voltage,
            current: current.current + input.current,
            timestamp: current.timestamp,
          };
        }
      }

      return values;
    }

    if ((duration = "month")) {
      const values: Record<string, InputWithOutSystemInputs> = {};
      for await (const input of ctx.db.query("inputs")) {
        const timestamp = new Date(input.timestamp);

        if (timestamp.getMonth() === now.getMonth()) {
          const current = values[timestamp.getDate().toString()];
          if (!current) {
            values[timestamp.getDate().toString()] = {
              voltage: 0,
              current: 0,
              timestamp: timestamp.toISOString(),
            };
          }

          values[timestamp.getDate().toString()] = {
            voltage: current.voltage + input.voltage,
            current: current.current + input.current,
            timestamp: current.timestamp,
          };
        }
      }

      return values;
    }

    return [];
  },
});

type Output = DataModel["outputs"]["document"];
type OutputWithOutSystemInputs = Omit<
  DataModel["outputs"]["document"],
  "_id" | "_creationTime"
>;

export const getOutputData = query({
  args: {
    duration: v.union(v.literal("day"), v.literal("week"), v.literal("month")),
    referenceTime: v.string(),
  },
  handler: async (ctx, { duration, referenceTime }) => {
    const now = new Date(referenceTime);

    if (duration === "day") {
      const values: Output[] = [];
      for await (const output of ctx.db.query("outputs")) {
        const timestamp = new Date(output.timestamp);

        if (timestamp.getDate() === now.getDate()) {
          values.push(output);
        }
      }

      return values;
    }

    if (duration === "week") {
      const values: Record<string, OutputWithOutSystemInputs> = {};
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());

      for await (const output of ctx.db.query("outputs")) {
        const timestamp = new Date(output.timestamp);

        if (timestamp >= startOfWeek && timestamp <= now) {
          const current = values[timestamp.getDay().toString()];
          if (!current) {
            values[timestamp.getDay().toString()] = {
              voltage: 0,
              current: 0,
              timestamp: timestamp.toISOString(),
            };
          }

          values[timestamp.getDay().toString()] = {
            voltage: current.voltage + output.voltage,
            current: current.current + output.current,
            timestamp: current.timestamp,
          };
        }
      }

      return values;
    }

    if ((duration = "month")) {
      const values: Record<string, OutputWithOutSystemInputs> = {};
      for await (const output of ctx.db.query("outputs")) {
        const timestamp = new Date(output.timestamp);

        if (timestamp.getMonth() === now.getMonth()) {
          const current = values[timestamp.getDate().toString()];
          if (!current) {
            values[timestamp.getDate().toString()] = {
              voltage: 0,
              current: 0,
              timestamp: timestamp.toISOString(),
            };
          }

          values[timestamp.getDate().toString()] = {
            voltage: current.voltage + output.voltage,
            current: current.current + output.current,
            timestamp: current.timestamp,
          };
        }
      }

      return values;
    }

    return [];
  },
});
