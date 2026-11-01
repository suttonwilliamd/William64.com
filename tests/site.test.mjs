import { after, test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import { buildSite } from "./helpers/build-site.mjs";

const site = buildSite();
after(site.cleanup);
const open = (path) =>
  new JSDOM(readFileSync(join(site.output, path), "utf8"), {
    url: "https://william64.com/",
    runScripts: "outside-only",
  });
function htmlFiles(dir, prefix = "") {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(prefix, entry.name);
    return entry.isDirectory()
      ? htmlFiles(join(dir, entry.name), path)
      : entry.name.endsWith(".html")
        ? [path]
        : [];
  });
}
const routes = htmlFiles(site.output);

test("every route has the same accessible shell and one shared stylesheet", () => {
  const styles = new Set();
  for (const path of routes) {
    const dom = open(path),
      d = dom.window.document;
    assert.equal(d.querySelectorAll("main").length, 1, path);
    assert.equal(d.querySelectorAll("h1").length, 1, path);
    assert.equal(d.querySelectorAll(".site-header").length, 1, path);
    assert.equal(d.querySelectorAll(".site-footer").length, 1, path);
    assert.equal(d.querySelector(".skip-link").hash, "#main-content", path);
    assert.ok(d.querySelector("#main-content"), path);
    assert.ok(d.querySelector('meta[name="viewport"]'), path);
    assert.ok(
      d.querySelector('meta[name="description"]').content.trim().length > 0,
      path,
    );
    assert.equal(d.querySelectorAll('link[rel="stylesheet"]').length, 1, path);
    styles.add(d.querySelector('link[rel="stylesheet"]').getAttribute("href"));
    for (const image of d.images)
      assert.ok(image.hasAttribute("alt"), `${path}: unlabeled image`);
    for (const field of d.querySelectorAll("input,textarea"))
      assert.ok(
        d.querySelector(`label[for="${field.id}"]`),
        `${path}: unlabeled field`,
      );
    dom.window.close();
  }
  assert.equal(
    styles.size,
    1,
    "All pages should load the exact same CSS asset",
  );
});

test("every local link, stylesheet, script, image, and fragment resolves in the production build", () => {
  for (const path of routes) {
    const dom = open(path),
      d = dom.window.document;
    for (const element of d.querySelectorAll("[href],[src]")) {
      const value = element.getAttribute("href") ?? element.getAttribute("src");
      if (!value || /^(https?:|mailto:|data:)/.test(value)) continue;
      if (value.startsWith("#")) {
        assert.ok(
          d.getElementById(value.slice(1)),
          `${path}: missing fragment ${value}`,
        );
        continue;
      }
      assert.ok(
        value.startsWith("/"),
        `${path}: unexpected relative asset ${value}`,
      );
      const local = join(site.output, value.split(/[?#]/)[0]);
      assert.ok(
        existsSync(local) || existsSync(join(local, "index.html")),
        `${path}: missing ${value}`,
      );
    }
    dom.window.close();
  }
});

test("the main content is useful without JavaScript and sensitive existing content survives", () => {
  const home = open("index.html");
  assert.equal(
    home.window.document.querySelectorAll("[data-project]").length,
    2,
  );
  assert.doesNotMatch(
    home.window.document.body.textContent,
    /Loading projects|GitHub Stars|Senior Software Engineer/,
  );
  const gamesLink = home.window.document.querySelector('.actions a[href*="category="]');
  assert.ok(gamesLink, "The homepage should lead directly to game-related projects");
  assert.equal(new URL(gamesLink.href).searchParams.get("category"), "Games & tracking");
  const blog = open("blog/index.html");
  assert.match(
    blog.window.document.body.textContent,
    /first post is still brewing/,
  );
  const memorial = open("memorial/index.html");
  assert.match(
    memorial.window.document.body.textContent,
    /35 years at Square D/,
  );
  assert.match(
    memorial.window.document.body.textContent,
    /William and Eric Sutton/,
  );
  assert.equal(
    memorial.window.document.querySelector(".memorial-support a").href,
    "https://gofund.me/bc6e369e2",
  );
  assert.ok(existsSync(join(site.output, "images/bonnie-memorial.jpg")));
  const aaron = open("aaron/posts/hello-world/index.html");
  assert.match(aaron.window.document.body.textContent, /AI-authored/);
  for (const dom of [home, blog, memorial, aaron]) dom.window.close();
  for (const path of [
    "admin/index.html",
    "work-in-progress/index.html",
    "404.html",
  ]) {
    const dom = open(path);
    assert.match(
      dom.window.document.querySelector('meta[name="robots"]').content,
      /noindex/,
    );
    dom.window.close();
  }
});

test("mobile navigation announces state, closes on Escape, and returns focus", () => {
  const dom = open("index.html"),
    d = dom.window.document;
  dom.window.matchMedia = () => ({ matches: true, addEventListener() {} });
  for (const script of d.scripts)
    if (script.type === "module" && !script.src)
      dom.window.eval(script.textContent);
  const toggle = d.querySelector(".menu-toggle");
  assert.ok(
    d.querySelector(".site-nav").classList.contains("navigation-ready"),
  );
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  toggle.click();
  assert.equal(toggle.getAttribute("aria-expanded"), "true");
  assert.ok(d.querySelector("#nav-links").classList.contains("open"));
  d.querySelector(".site-nav").dispatchEvent(
    new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
  );
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  assert.equal(d.activeElement, toggle);
  toggle.click();
  d.querySelector("#nav-links a").click();
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  dom.window.close();
});

test("Aaron notebook uses the shared discovery cards and keeps every entry reachable", () => {
  const dom = open("aaron/index.html"),
    d = dom.window.document;
  const cards = [...d.querySelectorAll(".grid .card.link-card")];
  const publishedEntries = routes
    .filter((path) => path.startsWith(join("aaron", "posts") + "/") ||
      path.startsWith(join("aaron", "posts") + "\\"))
    .map((path) => "/" + path.replaceAll("\\", "/").replace(/index\.html$/, ""));
  const linkedEntries = cards.map((card) => new URL(card.href).pathname);
  assert.equal(new Set(linkedEntries).size, linkedEntries.length);
  assert.deepEqual([...linkedEntries].sort(), publishedEntries.sort());
  const dates = cards.map((card) => card.querySelector("time").dateTime);
  assert.deepEqual(dates, [...dates].sort().reverse());
  assert.match(d.querySelector(".note").textContent, /AI-authored/);
  assert.equal(
    d.querySelector('a[aria-current="page"]').getAttribute("href"),
    "/aaron/",
  );
  dom.window.close();
});

test("SIRQ fixture retains inspectable explanations and its safety boundary", () => {
  const dom = open("sirq/index.html"),
    d = dom.window.document;
  assert.equal(d.querySelectorAll("details.alert-item").length, 9);
  assert.equal(d.querySelectorAll("details .interrupt").length, 2);
  assert.match(d.querySelector(".note").textContent, /deterministic mock/);
  assert.match(
    d.querySelector(".note").textContent.replace(/\s+/g, " "),
    /does not mute, route, remediate, or change production/,
  );
  for (const details of d.querySelectorAll("details"))
    assert.ok(details.querySelector("p").textContent.length > 40);
  dom.window.close();
});

test("populated blog templates preserve dates, articles beyond the old limit, archives, TOC and RSS", () => {
  const posts = {};
  // More than the previous ten-post cap: every article must be reachable.
  for (let i = 1; i <= 12; i++)
    posts[`note-${i}.md`] =
      `---\ntitle: "Note ${i}"\npublishedDate: "2026-01-${String(i).padStart(2, "0")}"\nsummary: "A useful note about software and systems."\ncategory: "Technical Tutorials"\ntags: ["Astro", "Web Development"]\nfeatured: ${i === 12}\n---\n\n## A real section\n\nThe article body.\n\n## Another real section\n\nMore of the article.\n`;
  const populated = buildSite({ posts });
  try {
    const doc = (path) =>
      new JSDOM(readFileSync(join(populated.output, path), "utf8")).window
        .document;
    const index = doc("blog/index.html");
    assert.equal(index.querySelectorAll(".post-preview").length, 12);
    assert.equal(
      index.querySelector(".post-preview h2").textContent.trim(),
      "Note 12",
    );
    assert.equal(
      doc("blog/category/technical-tutorials/index.html").querySelectorAll(
        ".post-preview",
      ).length,
      12,
    );
    assert.equal(
      doc("blog/tag/web-development/index.html").querySelectorAll(
        ".post-preview",
      ).length,
      12,
    );
    const article = doc("blog/posts/note-12/index.html");
    assert.equal(article.querySelector("time").dateTime, "2026-01-12");
    assert.equal(article.querySelectorAll(".article-toc a").length, 2);
    for (const link of article.querySelectorAll(".article-toc a"))
      assert.ok(article.querySelector(link.hash));
    assert.doesNotMatch(article.body.textContent, /Invalid Date|undefined/);
    assert.equal(article.querySelectorAll(".site-footer").length, 1);
    assert.match(
      readFileSync(join(populated.output, "rss.xml"), "utf8"),
      /note-12/,
    );
  } finally {
    populated.cleanup();
  }
});
