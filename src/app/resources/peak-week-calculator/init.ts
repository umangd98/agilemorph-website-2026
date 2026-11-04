type Row = { name: string; share: number; mins: number; auto: number; h: number; ah: number };

const DEFAULT_MIX = [
  { name: "Where's my order?", share: 35, mins: 4, auto: 70 },
  { name: "Cancel or change order", share: 15, mins: 6, auto: 40 },
  { name: "Returns and refunds", share: 20, mins: 8, auto: 30 },
  { name: "Product and sizing", share: 15, mins: 5, auto: 20 },
  { name: "Discount or payment", share: 10, mins: 6, auto: 30 },
  { name: "Something else", share: 5, mins: 10, auto: 0 },
];

const DAYS = [
  { d: "Thu", l: "Thanksgiving", w: 8 },
  { d: "Fri", l: "Black Friday", w: 14 },
  { d: "Sat", l: "", w: 14 },
  { d: "Sun", l: "", w: 12 },
  { d: "Mon", l: "Cyber Monday", w: 18 },
  { d: "Tue", l: "", w: 18 },
  { d: "Wed", l: "", w: 16 },
];

const VIEWS = ["quick", "advanced", "playbook"];
const QUICK_IDS = ["q-orders", "q-rate", "q-mins", "q-mult", "q-cost", "q-shift"];
const ADVANCED_IDS = ["a-orders", "a-rate", "a-mult", "a-tail", "a-day", "a-cost"];

const fmt = (x: number) => Math.round(x).toLocaleString("en-US");
const money = (x: number) => `$${fmt(x)}`;

/**
 * Runs the calculator against the markup in markup.ts. Everything stays in the
 * browser: nothing here reads or sends the values anywhere but the page. Aborting
 * `signal` removes every listener this adds.
 */
export function initPeakWeekCalculator(root: HTMLElement, signal: AbortSignal) {
  const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
    root.querySelector<T>(`#${id}`) as T;
  const num = (id: string) => {
    const value = parseFloat($<HTMLInputElement>(id).value);
    return Number.isFinite(value) && value >= 0 ? value : 0;
  };
  const text = (id: string, value: string) => {
    $(id).textContent = value;
  };
  const on = (el: EventTarget, type: string, handler: () => void) =>
    el.addEventListener(type, handler, { signal });

  const copyText: Record<string, string> = { quick: "", advanced: "" };

  /* ---------- tabs ---------- */
  function show(requested: string) {
    const view = VIEWS.includes(requested) ? requested : "quick";
    VIEWS.forEach((v) => {
      $(`view-${v}`).hidden = v !== view;
      const tab = $(`tab-${v}`);
      tab.setAttribute("aria-selected", v === view ? "true" : "false");
      tab.tabIndex = v === view ? 0 : -1;
    });
  }
  function goTo(view: string) {
    show(view);
    try {
      history.replaceState(history.state, "", `#${view}`);
    } catch {
      // Sandboxed contexts can refuse replaceState; the tab has still switched.
    }
  }
  root.querySelectorAll<HTMLElement>(".tab").forEach((tab) => {
    on(tab, "click", () => goTo(tab.dataset.view ?? "quick"));
  });
  root.querySelectorAll<HTMLElement>("[data-go]").forEach((button) => {
    on(button, "click", () => {
      goTo(button.dataset.go ?? "quick");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
  on(window, "hashchange", () => show(location.hash.slice(1)));
  show(location.hash.slice(1));

  /* ---------- quick ---------- */
  function quick() {
    const weekly = (num("q-orders") * 12) / 52;
    const tix = (weekly * num("q-rate")) / 100;
    const norm = (tix * num("q-mins")) / 60;
    const mult = Math.max(1, num("q-mult"));
    const peak = norm * mult;
    const shift = Math.max(1, num("q-shift"));
    const people = Math.ceil(peak / shift);
    const usual = Math.ceil(norm / shift);
    text("q-peak", fmt(peak));
    text("q-norm", `${fmt(norm)} hours`);
    text("q-tickets", fmt(tix * mult));
    text("q-people", fmt(people));
    text(
      "q-people-l",
      people > usual
        ? `people full-time (${people - usual} more than usual)`
        : "people full-time",
    );
    text("q-cost-out", money(peak * num("q-cost")));
    const saved = `${fmt(peak * 0.34)}–${fmt(peak * 0.45)}`;
    text("q-save", saved);
    copyText.quick = `My Black Friday week: ${fmt(peak)} support hours (${fmt(norm)} normally), ${fmt(tix * mult)} tickets, ${people} people full-time. Automation could free ${saved} hours.`;
  }
  QUICK_IDS.forEach((id) => on($(id), "input", quick));

  /* ---------- advanced ---------- */
  const advancedDefaults = new Map(
    ADVANCED_IDS.map((id) => [id, $<HTMLInputElement>(id).value]),
  );

  // Rebuilding replaces these inputs, and their listeners go with them.
  function buildMix() {
    const body = $("a-mix");
    body.innerHTML = "";
    DEFAULT_MIX.forEach((row, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        `<td>${row.name}</td>` +
        `<td><input type="number" inputmode="decimal" min="0" max="100" step="1" id="mix-s-${i}" aria-label="${row.name} share percent" value="${row.share}"></td>` +
        `<td><input type="number" inputmode="decimal" min="0" step="0.5" id="mix-m-${i}" aria-label="${row.name} minutes each" value="${row.mins}"></td>` +
        `<td><input type="number" inputmode="decimal" min="0" max="100" step="5" id="mix-a-${i}" aria-label="${row.name} automatable percent" value="${row.auto}"></td>` +
        `<td class="val" id="mix-h-${i}" style="font-family:var(--f-mono)">0</td>`;
      body.appendChild(tr);
    });
    body.querySelectorAll("input").forEach((input) => on(input, "input", advanced));
  }

  function buildWeights() {
    const weights = $("a-weights");
    weights.innerHTML = "";
    DAYS.forEach((day, i) => {
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.step = "1";
      input.value = String(day.w);
      input.id = `w-${i}`;
      input.setAttribute("aria-label", `${day.d} share of tickets percent`);
      input.title = `${day.d} · % of the week's tickets`;
      on(input, "input", advanced);
      weights.appendChild(input);
    });
  }

  function advanced() {
    const weekly = (num("a-orders") * 12) / 52;
    const normTix = (weekly * num("a-rate")) / 100;
    const peakTix = normTix * Math.max(1, num("a-mult"));
    const dayHrs = Math.max(1, num("a-day"));
    const cost = num("a-cost");

    const rows: Row[] = DEFAULT_MIX.map((row, i) => ({
      name: row.name,
      share: num(`mix-s-${i}`),
      mins: num(`mix-m-${i}`),
      auto: Math.min(100, num(`mix-a-${i}`)),
      h: 0,
      ah: 0,
    }));
    const shareSum = rows.reduce((sum, row) => sum + row.share, 0) || 1;

    let total = 0;
    let autoH = 0;
    let avgMins = 0;
    rows.forEach((row, i) => {
      const tickets = (peakTix * row.share) / shareSum;
      row.h = (tickets * row.mins) / 60;
      row.ah = (row.h * row.auto) / 100;
      total += row.h;
      autoH += row.ah;
      avgMins += (row.share / shareSum) * row.mins;
      text(`mix-h-${i}`, fmt(row.h));
    });
    text("a-share-sum", `${fmt(shareSum)}%`);
    text("a-mix-total", fmt(total));

    const warn = $("a-warn");
    warn.hidden = Math.abs(shareSum - 100) <= 0.5;
    if (!warn.hidden) {
      warn.textContent = `Your shares add up to ${fmt(shareSum)}%, so they're scaled to 100% in the results.`;
    }

    const after = (normTix * num("a-tail") * avgMins) / 60;
    text("a-hours", fmt(total));
    text("a-tickets", fmt(peakTix));
    text("a-after", fmt(after));

    const maxHours = Math.max(...rows.map((row) => row.h), 1);
    const bars = $("a-bars");
    bars.innerHTML = "";
    rows.forEach((row) => {
      const el = document.createElement("div");
      el.className = "brow";
      el.innerHTML = `<span>${row.name}</span><div class="track"><div class="fill" style="width:${(row.h / maxHours) * 100}%"></div><div class="fill auto" style="width:${(row.ah / maxHours) * 100}%"></div></div><span class="val">${fmt(row.h)} h</span>`;
      bars.appendChild(el);
    });

    const dayWeights = DAYS.map((_, i) => num(`w-${i}`));
    const weightSum = dayWeights.reduce((sum, w) => sum + w, 0) || 1;
    const people = dayWeights.map((w) => Math.ceil(((total * w) / weightSum) / dayHrs));
    const maxPeople = Math.max(...people, 1);
    const days = $("a-days");
    days.innerHTML = "";
    DAYS.forEach((day, i) => {
      const el = document.createElement("div");
      el.className = "day";
      const count = people[i] ?? 0;
      const height = Math.max(4, (count / maxPeople) * 120);
      el.innerHTML = `<b>${count}</b><div class="col${count < maxPeople * 0.6 ? " quiet" : ""}" style="height:${height}px"></div><span>${day.d}${day.l ? `<br>${day.l}` : ""}</span>`;
      days.appendChild(el);
    });

    text("a-save-h", `Automation could free ${fmt(autoH)} of ${fmt(total)} hours that week.`);
    text(
      "a-save-p",
      `That's about ${Math.round((autoH / dayHrs) * 10) / 10} person-days, worth roughly ${money(autoH * cost)}, based on your automation estimates above.`,
    );

    copyText.advanced = `Black Friday week plan: ${fmt(total)} support hours, ${fmt(peakTix)} tickets. People per day (Thu–Wed): ${people.join(", ")}. Week after: ${fmt(after)} hours. Automation could free about ${fmt(autoH)} hours.`;
  }
  ADVANCED_IDS.forEach((id) => on($(id), "input", advanced));
  on($("a-reset"), "click", () => {
    advancedDefaults.forEach((value, id) => {
      $<HTMLInputElement>(id).value = value;
    });
    buildMix();
    buildWeights();
    advanced();
  });
  root.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => event.preventDefault(), { signal });
  });

  /* ---------- copy ---------- */
  function doCopy(value: string, scope: Element | null) {
    const ok = scope?.querySelector<HTMLElement>(".ok");
    const box = scope?.querySelector<HTMLTextAreaElement>("textarea.fallback");
    const done = () => {
      if (!ok) return;
      ok.textContent = "Copied";
      ok.hidden = false;
      setTimeout(() => {
        ok.hidden = true;
      }, 2200);
    };
    const fallback = () => {
      if (box) {
        box.value = value;
        box.hidden = false;
        box.focus();
        box.select();
      } else if (ok) {
        ok.textContent = "Select the text and copy it";
        ok.hidden = false;
      }
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(value).then(done, fallback);
    } else {
      fallback();
    }
  }
  root.querySelectorAll<HTMLElement>("[data-copy]").forEach((button) => {
    on(button, "click", () =>
      doCopy(copyText[button.dataset.copy ?? ""] ?? "", button.closest(".panel")),
    );
  });
  root.querySelectorAll<HTMLElement>("[data-tpl]").forEach((button) => {
    on(button, "click", () =>
      doCopy($(button.dataset.tpl ?? "").textContent ?? "", button.closest(".tpl")),
    );
  });

  buildMix();
  buildWeights();
  quick();
  advanced();
}
