import { after, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildSite } from "./helpers/build-site.mjs";
import { join } from "node:path";
import { JSDOM } from "jsdom";

// Exercise the actual production HTML and bundled scripts, not a copy of the filter.
const { output, cleanup } = buildSite();
after(cleanup);
const html = readFileSync(join(output, "projects/index.html"), "utf8");

function openPage({ javascript = true } = {}) {
  const dom = new JSDOM(html, {
    runScripts: "outside-only",
    url: "https://william64.com/projects/",
  });
  // No external APIs may be needed to display or filter the projects.
  dom.window.fetch = () => {
    throw new Error("Unexpected network dependency");
  };
  dom.window.matchMedia = () => ({ matches: false, addEventListener() {} });
  if (javascript) {
    for (const script of dom.window.document.scripts) {
      assert.equal(script.src, "", "Page behavior should be bundled inline");
      dom.window.eval(script.textContent);
    }
  }
  return dom;
}

function visibleNames(document) {
  return [...document.querySelectorAll("[data-project]")]
    .filter((card) => !card.hidden)
    .map((card) =>
      card.querySelector("h3").textContent.replace("↗", "").trim(),
    );
}

function choose(dom, category) {
  const button = [
    ...dom.window.document.querySelectorAll(".filter-button"),
  ].find((button) => button.dataset.category === category);
  assert.ok(button, `Missing category: ${category}`);
  button.click();
}

function search(dom, query) {
  const input = dom.window.document.querySelector("#project-search");
  input.value = query;
  input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
}

test("project content and working links are present without JavaScript", () => {
  const dom = openPage({ javascript: false });
  const document = dom.window.document;
  assert.deepEqual(visibleNames(document), [
    "PED Hunter",
    "CortexPool",
    "TPC Server",
    "SIRQ",
    "GlyphForge",
    "MeJ",
    "LewtNanny",
    "Pebble",
  ]);
  assert.equal(document.querySelector(".project-controls").hidden, true);
  assert.equal(document.querySelector("#project-count").hidden, true);
  assert.match(
    document.querySelector('[data-search*="lewtnanny"] .project-description')
      .textContent,
    /Entropia Universe/,
  );
  assert.doesNotMatch(
    document.body.textContent,
    /caregiv|Loading projects|No description available/,
  );
  for (const card of document.querySelectorAll("[data-project]")) {
    assert.ok(
      card.querySelector(".project-description").textContent.length > 60,
    );
    assert.match(
      card.querySelector(".card-links a").href,
      /^https:\/\/github\.com\/suttonwilliamd\//,
    );
  }
  assert.equal(
    document.querySelector(".project-action").href,
    "https://github.com/suttonwilliamd/ped-hunter/releases/latest",
  );
  dom.window.close();
});

test("categories, case-insensitive keyword search, and their intersection select the right projects", () => {
  const dom = openPage();
  const document = dom.window.document;
  assert.equal(document.querySelector(".project-controls").hidden, false);
  choose(dom, "Creative tools");
  assert.deepEqual(visibleNames(document), ["GlyphForge", "MeJ"]);
  search(dom, "  TYPESCRIPT  ");
  assert.deepEqual(visibleNames(document), ["GlyphForge", "MeJ"]);
  search(dom, "canvas");
  assert.deepEqual(visibleNames(document), ["GlyphForge"]);
  assert.equal(
    document.querySelector("#project-count").textContent,
    "1 of 8 projects",
  );
  choose(dom, "Games & tracking");
  assert.deepEqual(visibleNames(document), []);
  search(dom, "");
  assert.deepEqual(visibleNames(document), ["PED Hunter", "LewtNanny"]);
  choose(dom, "AI & developer tools");
  assert.deepEqual(visibleNames(document), [
    "CortexPool",
    "TPC Server",
    "SIRQ",
    "Pebble",
  ]);
  const pressed = [...document.querySelectorAll('[aria-pressed="true"]')];
  assert.equal(pressed.length, 1);
  assert.equal(pressed[0].textContent.trim(), "AI & developer tools");
  dom.window.close();
});

test("no-match state is recoverable and reset restores every project and search focus", () => {
  const dom = openPage();
  const document = dom.window.document;
  choose(dom, "Creative tools");
  search(dom, "no-such-project");
  assert.deepEqual(visibleNames(document), []);
  assert.equal(document.querySelector("#empty-state").hidden, false);
  assert.equal(
    document.querySelector("#project-count").textContent,
    "0 of 8 projects",
  );
  document.querySelector("#reset-projects").click();
  assert.equal(visibleNames(document).length, 8);
  assert.equal(document.querySelector("#empty-state").hidden, true);
  assert.equal(document.querySelector("#project-search").value, "");
  assert.equal(document.activeElement.id, "project-search");
  assert.equal(
    document.querySelector('[aria-pressed="true"]').textContent.trim(),
    "All projects",
  );
  assert.equal(
    document.querySelector("#project-count").textContent,
    "8 of 8 projects",
  );
  dom.window.close();
});
