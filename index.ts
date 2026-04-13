/**
 * My Plugin — template for maw-js plugins.
 *
 * One handler. Three surfaces. Edit this file.
 *
 * Surfaces:
 *   CLI:  maw my-plugin [args]
 *   API:  GET/POST /api/my-plugin
 *   Peer: maw hey plugin:my-plugin "message"
 */

// Types from maw SDK
interface InvokeContext {
  source: "cli" | "api" | "peer";
  args: string[] | Record<string, unknown>;
}

interface InvokeResult {
  ok: boolean;
  output?: string;
  error?: string;
}

// Plugin metadata (used by command-registry)
export const command = {
  name: ["my-plugin", "mp"],
  description: "My first maw-js plugin",
};

// The handler — one function, all surfaces
export default async function handler(ctx: InvokeContext): Promise<InvokeResult> {
  const logs: string[] = [];
  const origLog = console.log;
  console.log = (...a: any[]) => logs.push(a.map(String).join(" "));

  try {
    // ─── CLI surface ─────────────────────────────────────────
    if (ctx.source === "cli") {
      const args = ctx.args as string[];
      const sub = args[0] ?? "hello";

      switch (sub) {
        case "hello":
          console.log("Hello from my-plugin!");
          console.log("Edit index.ts to make it yours.");
          break;

        case "info":
          console.log("my-plugin v0.1.0");
          console.log("  surfaces: cli + api + peer");
          console.log("  weight: 50");
          break;

        default:
          console.log(`Unknown subcommand: ${sub}`);
          console.log("Try: maw my-plugin hello");
      }
    }

    // ─── API surface ─────────────────────────────────────────
    else if (ctx.source === "api") {
      const body = ctx.args as Record<string, unknown>;
      console.log(JSON.stringify({
        plugin: "my-plugin",
        message: "Hello from API!",
        received: body,
      }));
    }

    // ─── Peer surface ────────────────────────────────────────
    else if (ctx.source === "peer") {
      const body = ctx.args as Record<string, unknown>;
      console.log(`Hello from peer! Message: ${body.message ?? "(none)"}`);
    }

    return { ok: true, output: logs.join("\n") || undefined };
  } catch (e: any) {
    return { ok: false, error: logs.join("\n") || e.message, output: logs.join("\n") || undefined };
  } finally {
    console.log = origLog;
  }
}
