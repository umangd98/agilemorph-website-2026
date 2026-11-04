// Static markup for the calculator. It's a string rather than JSX because the
// reply templates contain literal {braces} and init.ts drives the DOM directly.
export const PEAK_WEEK_MARKUP = `<div class="wrap">
  <header>
    <div class="eyebrow">Peak-season support planner · free, no sign-up</div>
    <h1>How many support hours will Black Friday week need?</h1>
    <p class="lede">Get a quick estimate, plan each day of peak week by ticket type, and use the playbook to cut the load before it arrives. The numbers already filled in are an example store; replace them with yours.</p>
  </header>

  <div class="tabs" role="tablist" aria-label="Planner sections">
    <button class="tab" role="tab" id="tab-quick" aria-controls="view-quick" data-view="quick">Quick estimate<small>1 min</small></button>
    <button class="tab" role="tab" id="tab-advanced" aria-controls="view-advanced" data-view="advanced">Advanced planner<small>5 min</small></button>
    <button class="tab" role="tab" id="tab-playbook" aria-controls="view-playbook" data-view="playbook">Peak-week playbook<small>13 tips + replies</small></button>
  </div>

  <!-- QUICK -->
  <section id="view-quick" role="tabpanel" aria-labelledby="tab-quick" class="grid">
    <form class="panel" id="q-form" novalidate>
      <h2>Your store</h2>
      <div class="field"><label for="q-orders">Orders in a normal month <span>orders</span></label><input id="q-orders" type="number" inputmode="numeric" min="0" step="100" value="12000"></div>
      <div class="field"><label for="q-rate">Orders that become a ticket <span>%</span></label><input id="q-rate" type="number" inputmode="decimal" min="0" max="100" step="1" value="12"><small>Your helpdesk's tickets ÷ orders for last month.</small></div>
      <div class="field"><label for="q-mins">Minutes to handle one ticket <span>min</span></label><input id="q-mins" type="number" inputmode="decimal" min="0" step="0.5" value="6"></div>
      <div class="field"><label for="q-mult">Peak week vs a normal week <span>× orders</span></label><input id="q-mult" type="number" inputmode="decimal" min="1" step="0.5" value="3"><small>Last year's Black Friday week orders ÷ an average week.</small></div>
      <div class="field"><label for="q-cost">Cost of one support hour <span>USD</span></label><input id="q-cost" type="number" inputmode="decimal" min="0" step="1" value="24"></div>
      <div class="field"><label for="q-shift">Hours one person works a week <span>hrs</span></label><input id="q-shift" type="number" inputmode="decimal" min="1" step="1" value="40"></div>
    </form>
    <div class="panel" aria-live="polite">
      <h2>Peak week readout</h2>
      <div><div class="big"><span id="q-peak">0</span><small>hours</small></div><p style="margin:8px 0 0;font-size:17px">of support work in Black Friday week, against <strong id="q-norm">0</strong> in a normal week.</p></div>
      <div class="stats">
        <div class="stat"><b id="q-tickets">0</b><span>tickets in peak week</span></div>
        <div class="stat"><b id="q-people">0</b><span id="q-people-l">people full-time</span></div>
        <div class="stat"><b id="q-cost-out">$0</b><span>support cost that week</span></div>
      </div>
      <div class="callout">
        <h3>Automation could free <span id="q-save">0</span> hours that week.</h3>
        <p>That range assumes 34–45% of the work is handled without a person, which is what two AgileMorph builds achieved. The advanced planner lets you set it per ticket type.</p>
      </div>
      <p class="hand" style="margin:0">want it day by day? try the advanced planner →</p>
      <div class="actions"><button type="button" class="btn" data-copy="quick">Copy my numbers</button><button type="button" class="btn ghost" data-go="advanced">Open advanced planner</button><span class="ok" hidden></span></div>
      <textarea class="fallback" rows="3" readonly hidden></textarea>
    </div>
  </section>

  <!-- ADVANCED -->
  <section id="view-advanced" role="tabpanel" aria-labelledby="tab-advanced" hidden style="display:grid;gap:20px">
    <div class="grid">
      <form class="panel" id="a-form" novalidate>
        <h2>Volume</h2>
        <div class="field"><label for="a-orders">Orders in a normal month <span>orders</span></label><input id="a-orders" type="number" inputmode="numeric" min="0" step="100" value="12000"></div>
        <div class="field"><label for="a-rate">Orders that become a ticket <span>%</span></label><input id="a-rate" type="number" inputmode="decimal" min="0" max="100" step="1" value="12"></div>
        <div class="field"><label for="a-mult">Peak week orders vs a normal week <span>×</span></label><input id="a-mult" type="number" inputmode="decimal" min="1" step="0.5" value="3"></div>
        <div class="field"><label for="a-tail">Week after peak: tickets vs a normal week <span>×</span></label><input id="a-tail" type="number" inputmode="decimal" min="0" step="0.5" value="2"><small>Order-status questions keep arriving while parcels are in transit.</small></div>
        <h2 style="margin-top:6px">Team</h2>
        <div class="field"><label for="a-day">Hours one person works a day <span>hrs</span></label><input id="a-day" type="number" inputmode="decimal" min="1" step="0.5" value="8"></div>
        <div class="field"><label for="a-cost">Cost of one support hour <span>USD</span></label><input id="a-cost" type="number" inputmode="decimal" min="0" step="1" value="24"></div>
      </form>
      <div class="panel" aria-live="polite">
        <h2>Peak week plan</h2>
        <div class="stats">
          <div class="stat"><b id="a-hours">0</b><span>support hours, peak week</span></div>
          <div class="stat"><b id="a-tickets">0</b><span>tickets, peak week</span></div>
          <div class="stat"><b id="a-after">0</b><span>hours the week after</span></div>
        </div>
        <div style="display:grid;gap:10px">
          <h2>People needed each day</h2>
          <div class="days" id="a-days"></div>
          <p class="fine">Days are Thanksgiving Thursday to the Wednesday after Cyber Monday. Change the daily split below if your store peaks differently.</p>
          <div class="weights" id="a-weights" aria-label="Share of the week's tickets by day, percent"></div>
        </div>
        <div class="callout">
          <h3 id="a-save-h">Automation could free 0 hours that week.</h3>
          <p id="a-save-p">That's 0 person-days, worth about $0.</p>
        </div>
      </div>
    </div>
    <div class="panel">
      <h2>Ticket mix · example store, replace with your helpdesk's numbers</h2>
      <div class="mix-wrap">
        <table class="mix" aria-label="Ticket types">
          <thead><tr><th scope="col">Ticket type</th><th scope="col">Share of tickets %</th><th scope="col">Minutes each</th><th scope="col">Could be automated %</th><th scope="col">Peak-week hours</th></tr></thead>
          <tbody id="a-mix"></tbody>
          <tfoot><tr><td>Total</td><td id="a-share-sum">100%</td><td></td><td></td><td id="a-mix-total">0</td></tr></tfoot>
        </table>
      </div>
      <div id="a-warn" class="warn" hidden></div>
      <div style="display:grid;gap:10px">
        <h2>Where the hours go</h2>
        <div class="bars" id="a-bars"></div>
        <div class="legend"><span><i style="background:var(--green-bright)"></i>could be automated</span><span><i style="background:var(--bar-muted)"></i>needs a person</span></div>
      </div>
      <p class="fine">The "could be automated" column is your estimate. Questions with one clear answer (order status, a cancellation before packing) usually sit at the high end; anything that needs judgment sits low.</p>
      <div class="actions"><button type="button" class="btn" data-copy="advanced">Copy my plan</button><button type="button" class="btn ghost" id="a-reset">Reset to example</button><span class="ok" hidden></span></div>
      <textarea class="fallback" rows="5" readonly hidden></textarea>
    </div>
  </section>

  <!-- PLAYBOOK -->
  <section id="view-playbook" role="tabpanel" aria-labelledby="tab-playbook" hidden style="display:grid;gap:30px">
    <p class="lede" style="color:var(--ink)">Thirteen things that shrink the ticket pile before it reaches your team. Most take under an hour and cost nothing.</p>

    <div class="phase">
      <span class="when">Before peak · do these by the Wednesday before</span>
      <h2>Answer the questions before they're asked</h2>
      <div class="tips">
        <article class="tip"><span class="n">01</span><h3>Put a delivery date in the shipping email</h3><p>A tracking link tells people <b>where</b> the parcel is. A date tells them <b>when</b>, which is the question they actually write in with. Even "usually arrives in 3–5 business days" helps.</p><span class="chip">Shopify: Settings → Notifications</span></article>
        <article class="tip"><span class="n">02</span><h3>Make "where's my order?" self-serve</h3><p>Link your order status page from the site header, the FAQ and the contact form. Many order-status tickets come from people who couldn't find the link.</p><span class="chip">15 min</span></article>
        <article class="tip"><span class="n">03</span><h3>Make your auto-reply answer, not acknowledge</h3><p>Replace "we got your message" with the tracking lookup link, your holiday shipping cutoffs and your return window. Some tickets close themselves.</p><span class="chip">20 min</span></article>
        <article class="tip"><span class="n">04</span><h3>Show holiday shipping cutoffs on product pages and the cart</h3><p>Use the dates your carriers publish each season. Customers who know the cutoff don't need to ask whether it will arrive in time.</p><span class="chip">30 min</span></article>
        <article class="tip"><span class="n">05</span><h3>Write your top five replies now</h3><p>Order status, cancel or change, running late, refund status, discount code not working. Three are ready to copy at the bottom of this page.</p><span class="chip">45 min</span></article>
        <article class="tip"><span class="n">06</span><h3>Sort tickets by intent automatically</h3><p>Most helpdesks can tag by keyword: "where", "tracking", "shipped" → order status; "cancel", "change", "address" → order change. The right person sees the right pile first.</p><span class="chip">30 min</span></article>
        <article class="tip"><span class="n">07</span><h3>Leave a short gap before orders go to picking</h3><p>Even an hour gives customers time to cancel or fix an address before anything is packed, so those changes stay a one-click job.</p><span class="chip">talk to your warehouse</span></article>
        <article class="tip"><span class="n">08</span><h3>Give temporary staff a clear money line</h3><p>Decide the refund or discount amount they can approve alone, and who signs off above it. Faster replies, consistent decisions.</p><span class="chip">10 min</span></article>
        <article class="tip"><span class="n">09</span><h3>Freeze changes from Wednesday</h3><p>New apps, new automations and new email templates wait until the week after. Peak week runs on what you've already tested.</p><span class="chip">0 min</span></article>
      </div>
    </div>

    <div class="phase">
      <span class="when">During peak · Thanksgiving to the following week</span>
      <h2>Staff for the ticket wave, not the order wave</h2>
      <div class="tips">
        <article class="tip"><span class="n">10</span><h3>Plan for the week after Cyber Monday</h3><p>Orders peak over the weekend, but order-status questions build while parcels are in transit. For many stores, the Tuesday to Friday after Cyber Monday is the busier stretch for support.</p><span class="chip">set it in the advanced planner</span></article>
        <article class="tip"><span class="n">11</span><h3>Watch one screen, three numbers</h3><p>Tickets waiting more than 2 hours. Orders that haven't moved in 48 hours. Automations that need a look. Everything else can wait for Monday's report.</p><span class="chip">pin it on a second monitor</span></article>
        <article class="tip"><span class="n">12</span><h3>Message running-late customers first</h3><p>One short, honest update to customers whose parcels are delayed heads off the "where is it?" email and the follow-up after it.</p><span class="chip">template below</span></article>
      </div>
    </div>

    <div class="phase">
      <span class="when">After peak · the Tuesday after</span>
      <h2>Turn this year into next year's plan</h2>
      <div class="tips">
        <article class="tip"><span class="n">13</span><h3>Run a 45-minute review while it's fresh</h3><p>Ask which questions you answered the same way more than 50 times. That list is your automation plan for January, and what's left is what stays human.</p><span class="chip">book it today</span></article>
      </div>
    </div>

    <div class="phase">
      <span class="when">Ready to copy · edit the {braces}</span>
      <h2>Three replies that close the loop</h2>
      <div class="templates">
        <div class="tpl"><div class="tpl-head"><h3>"Where's my order?"</h3><button type="button" class="btn ghost" data-tpl="t1">Copy</button></div><pre id="t1">Hi {name}, thanks for checking in.

Your order {#number} shipped on {date} with {carrier}. You can follow it here: {tracking link}

It's expected to arrive {date range}. If it hasn't reached you by {date}, just reply to this email and I'll look into it personally.</pre><span class="ok" hidden></span></div>
        <div class="tpl"><div class="tpl-head"><h3>Cancel or change an order</h3><button type="button" class="btn ghost" data-tpl="t2">Copy</button></div><pre id="t2">Hi {name}, happy to help.

Your order {#number} hadn't been packed yet, so I've {cancelled it / updated the address to …}. You'll get a confirmation email in the next few minutes.

Anything else you'd like to change while I'm here?</pre><span class="ok" hidden></span></div>
        <div class="tpl"><div class="tpl-head"><h3>Running late (send before they ask)</h3><button type="button" class="btn ghost" data-tpl="t3">Copy</button></div><pre id="t3">Hi {name}, a quick heads-up about your order {#number}.

It's taking a little longer than usual with {carrier} this week. The latest estimate is {date}, and you can follow it live here: {tracking link}

We're keeping an eye on it and will let you know if anything changes.</pre><span class="ok" hidden></span></div>
      </div>
    </div>
  </section>

  <footer>
    <span><strong>Want these set up for your store?</strong> Send the word PEAK as a LinkedIn message to us at <a href="https://www.linkedin.com/company/agilemorph/" target="_blank" rel="noopener">AgileMorph Solutions</a>, and we'll sketch your support flow on a free 20-minute call.</span>
    <span>AgileMorph Solutions builds support and ops automation for e-commerce brands in the US and Canada. Nothing you type on this page leaves your browser.</span>
  </footer>
</div>`;
