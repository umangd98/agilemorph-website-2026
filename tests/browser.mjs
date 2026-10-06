import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "playwright";
const origin = process.env.TEST_BASE_URL ?? "http://localhost:3100";
const output = process.env.TEST_OUTPUT_DIR ?? ".context/overhaul";
fs.mkdirSync(output, { recursive: true });
const docs = JSON.parse(
  fs.readFileSync(
    new URL("../src/data/reviewed-content.json", import.meta.url),
  ),
);
const projects = docs.filter((d) => d._type === "caseStudy");
const routes = [
  "/",
  "/about",
  "/services",
  "/pricing",
  "/contact",
  "/work",
  "/privacy",
  ...docs
    .filter((d) => d._type === "servicePage")
    .map((d) => `/services/${d.slug.current}`),
  ...projects.filter((p) => p.detailed).map((p) => `/work/${p.slug.current}`),
  "/blog",
  "/blog/client-reporting-for-agencies",
  "/blog/prospect-research-automation",
  "/blog/unlock-the-power-of-professional-web-design-agencies-agilemorph-solutions",
  "/blog/unveiling-the-power-of-software-testing-agilemorph-solutions-perspective",
  "/blog/billion-dollar-manufacturer-paper-registers",
];
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
// Prevent real chat conversations and external scheduling submissions during QA.
await context.route("https://code.tidio.co/**", (route) => route.abort());
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const summary = [];
const interactionsOnly = process.env.TEST_INTERACTIONS_ONLY === "1";
async function prepareImages() {
  await page.locator("img").evaluateAll(async (images) => {
    for (const image of images) image.loading = "eager";
    await Promise.all(images.map((image) => image.decode().catch(() => {})));
  });
  const broken = await page
    .locator("img")
    .evaluateAll((images) =>
      images.filter((image) => !image.naturalWidth).map((image) => image.src),
    );
  assert.deepEqual(broken, [], "broken images");
}
try {
  if (!interactionsOnly) {
    for (const route of routes) {
      const response = await page.goto(origin + route, {
        waitUntil: "networkidle",
      });
      assert.equal(response.status(), 200, route);
      assert.equal(await page.locator("h1").count(), 1, route + " h1");
      assert.equal(
        new URL(
          await page.locator('link[rel="canonical"]').getAttribute("href"),
        ).href,
        new URL("https://theagilemorph.com" + route).href,
        route + " canonical",
      );
      const body = await page.locator("body").innerText();
      for (const phrase of [
        "500K+",
        "180+",
        "100+ clients",
        "guarantees product quality",
        "guarantee a seamless",
        "98% client retention",
        "Rated by clients worldwide",
        "PLATINUM PARTNER",
        "SOC-ready",
        "100% Webhook reliability",
        "System Status: Optimal",
      ])
        assert.ok(
          !body.toLowerCase().includes(phrase.toLowerCase()),
          route + " " + phrase,
        );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        route + " overflow",
      );
      const links = await page
        .locator('a[href^="/work/"]')
        .evaluateAll((els) => els.map((a) => a.getAttribute("href")));
      for (const href of links)
        assert.ok(
          projects.some(
            (p) => p.detailed && `/work/${p.slug.current}` === href,
          ),
          route + " invalid project link",
        );
      summary.push({
        route,
        status: response.status(),
        heading: await page.locator("h1").innerText(),
      });
    }
    const sitemap = await context.request.get(origin + "/sitemap.xml");
    const xml = await sitemap.text();
    for (const route of routes.filter((r) => r !== "/"))
      assert.ok(
        xml.includes("https://theagilemorph.com" + route),
        route + " sitemap",
      );
    for (const route of ["/work/not-a-project", "/services/not-a-service"]) {
      const response = await page.goto(origin + route, {
        waitUntil: "networkidle",
      });
      assert.ok([200, 404].includes(response.status()), route);
      assert.ok(
        await page
          .getByRole("heading", { name: "This page could not be found." })
          .isVisible(),
      );
      assert.ok(
        (
          await page
            .locator('meta[name="robots"]')
            .first()
            .getAttribute("content")
        ).includes("noindex"),
      );
    }
    const redirect = await context.request.get(
      origin + "/services/website-development",
      { maxRedirects: 0 },
    );
    assert.equal(redirect.status(), 301);
    assert.equal(redirect.headers().location, "/services/software-development");
    for (const slug of [
      "bookkeeping",
      "digital-marketing",
      "virtual-assistance",
    ]) {
      const retired = await context.request.get(origin + `/services/${slug}`, {
        maxRedirects: 0,
      });
      assert.equal(retired.status(), 301);
      assert.equal(retired.headers().location, "/services/ai-automation");
    }
    await page.goto(origin + "/work");
    await page
      .getByRole("button", { name: "Data platforms", exact: true })
      .click();
    assert.equal(
      await page
        .getByRole("button", { name: "Data platforms", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    assert.ok((await page.locator("article").count()) < projects.length);
    await page.getByRole("button", { name: "All capabilities" }).click();
    assert.equal(await page.locator("article").count(), projects.length);
    await page.goto(origin + "/");
    const showcase = page.getByRole("group", {
      name: "Explore a project workflow",
    });
    for (const [label, slug] of [
      ["Products", "publisher-content-platform"],
      ["Data", "business-data-search"],
      ["Operations", "whatsapp-inventory-intake"],
    ]) {
      const button = showcase.getByRole("button", { name: label, exact: true });
      await button.focus();
      await page.keyboard.press("Enter");
      assert.equal(await button.getAttribute("aria-pressed"), "true");
      assert.equal(
        await page.locator(".showcase-project-link").getAttribute("href"),
        `/work/${slug}`,
      );
    }
    assert.equal(
      await page
        .locator(".art-hero .art-signal-path")
        .evaluate((el) => getComputedStyle(el).animationName),
      "none",
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
    assert.equal(
      await page
        .locator(".art-hero .art-signal-path")
        .evaluate((el) => getComputedStyle(el).animationName),
      "studio-signal",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.locator("main details summary").first().click();
    assert.ok(
      (await page.locator("main details").first().getAttribute("open")) !==
        null,
    );
    assert.equal(
      await page
        .getByRole("button", { name: "Read more", exact: true })
        .count(),
      0,
    );
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      for (const theme of ["light", "dark"]) {
        await page.evaluate((t) => {
          localStorage.setItem("agilemorph-theme", t);
          window.dispatchEvent(new Event("agilemorph-theme-change"));
        }, theme);
        for (const route of [
          "/",
          "/work",
          "/about",
          "/pricing",
          "/contact",
          "/services/ai-agents",
          "/work/punchbowl-support-agent",
        ]) {
          await page.goto(origin + route, { waitUntil: "networkidle" });
          assert.equal(
            await page.evaluate(() =>
              document.documentElement.classList.contains("dark"),
            ),
            theme === "dark",
          );
          assert.equal(
            await page.evaluate(
              () => document.documentElement.scrollWidth > innerWidth,
            ),
            false,
            `${route} ${width} ${theme} overflow`,
          );
          assert.ok(await page.locator("h1").isVisible());
        }
        await page.goto(origin + "/", { waitUntil: "networkidle" });
        await prepareImages();
        await page.screenshot({
          path: `${output}/home-${width}-${theme}.png`,
          fullPage: width !== 1440,
        });
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(origin + "/");
    await page.getByRole("button", { name: "Open navigation" }).click();
    assert.ok(
      await page
        .getByRole("navigation", { name: "Mobile navigation", exact: true })
        .isVisible(),
    );
    await page
      .getByRole("navigation", { name: "Mobile navigation", exact: true })
      .getByRole("link", { name: "Our Work", exact: true })
      .click();
    await page.waitForURL("**/work");
    assert.equal(
      await page
        .getByRole("navigation", { name: "Mobile navigation", exact: true })
        .count(),
      0,
    );
    await page.goto(origin + "/pricing");
    await page.locator("#efficiency-automatable").fill("0");
    assert.ok((await page.locator("body").innerText()).includes("$0"));
    assert.ok(
      (await page.locator("body").innerText())
        .toLowerCase()
        .includes("estimated annual value of time released"),
    );
  }
  // No real form submissions: exercise a server rejection followed by success.
  await page.goto(origin + "/contact");
  await page.evaluate(() => {
    window.Calendly = {
      initPopupWidget: ({ url }) => {
        window.testBookingUrl = url;
      },
    };
  });
  await page
    .getByRole("button", { name: "Book a free introductory call", exact: true })
    .click();
  assert.equal(
    await page.evaluate(() => window.testBookingUrl),
    "https://calendly.com/agilemorph/15-minute-discovery",
  );
  let payload = "";
  let fail = true;
  await page.route(origin + "/", (route) => {
    if (route.request().method() !== "POST") return route.continue();
    payload = route.request().postData() ?? "";
    return route.fulfill({
      status: fail ? 500 : 200,
      body: fail ? "error" : "ok",
    });
  });
  await page.getByLabel("First name").fill("Preview");
  await page.getByLabel("Last name").fill("Test");
  await page.getByLabel("Email address").fill("preview@example.test");
  await page.getByLabel("Company name").fill("Internal QA");
  await page
    .getByLabel("How can we help?")
    .fill("Controlled browser test; no real submission.");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await page.locator("main").getByRole("alert").waitFor();
  fail = false;
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await page.locator("main").getByRole("status").waitFor();
  assert.match(payload, /form-name=contact/);
  assert.match(payload, /company=Internal\+QA/);
  assert.equal(await page.getByLabel("First name").inputValue(), "");
  await page.getByRole("button", { name: "Send another message" }).click();
  assert.ok(
    await page
      .getByRole("button", { name: "Send message", exact: true })
      .isEnabled(),
  );
  // Keyboard focus and theme persistence.
  await page.goto(origin + "/");
  await page.keyboard.press("Tab");
  assert.equal(await page.locator(":focus").innerText(), "Skip to content");
  await page
    .getByRole("button", { name: /Switch to (light|dark) mode/ })
    .click();
  const dark = await page.evaluate(() =>
    document.documentElement.classList.contains("dark"),
  );
  await page.reload();
  assert.equal(
    await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    ),
    dark,
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  const serviceMenu = page.locator("header details");
  await serviceMenu.locator("summary").focus();
  await page.keyboard.press("Enter");
  assert.ok(
    await serviceMenu
      .getByRole("link", { name: "AI products & agents" })
      .isVisible(),
  );
  await page.keyboard.press("Escape");
  assert.equal(await serviceMenu.getAttribute("open"), null);
  await page.evaluate(() => {
    localStorage.setItem("agilemorph-theme", "light");
    window.dispatchEvent(new Event("agilemorph-theme-change"));
  });
  for (const [route, name] of [
    ["/", "homepage"],
    ["/work", "portfolio"],
    ["/work/punchbowl-support-agent", "case-study"],
  ]) {
    await page.goto(origin + route, { waitUntil: "networkidle" });
    await prepareImages();
    await page.screenshot({
      path: `${output}/${name}.png`,
      fullPage: name !== "homepage",
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + "/", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${output}/homepage-mobile.png` });
  assert.deepEqual(errors, [], "browser runtime errors");
  fs.writeFileSync(
    `${output}/${interactionsOnly ? "interaction" : "browser"}-results.json`,
    JSON.stringify(
      {
        routes: summary,
        viewports: [390, 768, 1440],
        themes: ["light", "dark"],
        reducedMotion: true,
        form: "mocked success and failure; no external submission",
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    interactionsOnly
      ? "Passed contact, booking, keyboard, and screenshot checks."
      : `Passed ${routes.length} routes, responsive/theme checks, filters, forms, redirects, sitemap, and keyboard checks.`,
  );
} catch (error) {
  await page.screenshot({ path: `${output}/failure.png`, fullPage: true });
  console.error("Failed URL:", page.url(), "Runtime errors:", errors);
  throw error;
} finally {
  await browser.close();
}
