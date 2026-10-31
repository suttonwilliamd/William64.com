import { execFileSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = fileURLToPath(new URL("../../", import.meta.url));
// Build from disposable source so tests never rewrite tracked dist/.astro files.
export function buildSite({ posts = {} } = {}) {
  const root = mkdtempSync(join(tmpdir(), "william64-site-test-"));
  try {
    for (const name of ["src", "public", "astro.config.mjs", "package.json"])
      cpSync(join(repo, name), join(root, name), { recursive: true });
    symlinkSync(join(repo, "node_modules"), join(root, "node_modules"), process.platform === "win32" ? "junction" : "dir");
    for (const [name, content] of Object.entries(posts)) {
      const path = join(root, "src/content/posts", name);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content);
    }
    execFileSync(
      process.execPath,
      [join(repo, "node_modules/astro/astro.js"), "build", "--root", root],
      { cwd: root, stdio: "pipe" },
    );
    return {
      root,
      output: join(root, "dist"),
      cleanup: () => rmSync(root, { recursive: true, force: true }),
    };
  } catch (error) {
    rmSync(root, { recursive: true, force: true });
    throw error;
  }
}
