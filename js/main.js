/* Zarsa Gold — interactions & motion (vanilla JS, Lenis optional) */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const root = document.documentElement;

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- piece descriptions ---------- */
  const DESC = {
    ring1: "A pair of fine bands, each carrying a T-bar toggle and a small charm. Wear one, or both on neighbouring fingers.",
    necklace1: "A long chain of open gold loops finished with a soft tassel drop. Long enough to wrap twice.",
    bracelet1: "Open bangle cuffs set with a pearl at each end and a floating gold halo. Made to stack.",
    set2: "A delicate chain with a round disc pendant, worn with a matching disc bracelet and toggle drop earrings.",
    necklace6: "A close-fitting chain with a toggle clasp worn at the front and a single black stone drop.",
    necklace8: "Hand-hammered gold discs, overlapped into a sculptural collar that catches every light.",
    bracelet3: "A curb chain bracelet fastened with a toggle bar and finished with a small padlock charm.",
    set3: "Cascading gold leaves on long drop earrings, with a matching leaf pendant on a fine chain.",
    necklace4: "Two layered chains, one with a row of small links and one with a tiny heart charm.",
    necklace2: "A paperclip chain that joins a curb chain at a front-facing toggle with a round charm.",
    set1: "A curb-link necklace worn with a fine pearl-station bracelet. Easy to wear together or apart.",
    necklace7: "A large open heart outlined in a single line of gold, on an adjustable fine chain.",
    bracelet2: "Our open halo cuff — a slim bangle with a floating circle and a pearl. Light enough for every day.",
    necklace5: "Two layers: a fine chain with an open halo, and a longer one with a toggle bar.",
    set4: "A slim curved bar on a fine chain, paired with a sculpted gold ear cuff. No piercing needed for the cuff.",
    necklace3: "A Y-shaped lariat with a halo slide and a long drop finished in a gold bead.",
  };

  /* ---------- smooth scroll (Lenis) ---------- */
  let lenis = null;
  const startLenis = () => {
    if (reduced || !window.Lenis || !finePointer) return;
    lenis = new window.Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  };
  const scrollToEl = (el) => {
    if (!el) return;
    const offset = el.id === "top" ? 0 : -10;
    if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  /* ---------- anchors ---------- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    closeMenu();
    if (lb.classList.contains("is-open") && a.id !== "lbAsk") closeLb();
    const goto = a.dataset.goto;
    if (goto) applyFilter(goto);
    scrollToEl(el);
    history.replaceState(null, "", id === "#top" ? location.pathname : id);
  });

  /* ---------- nav ---------- */
  const nav = $("#nav");
  let lastY = window.scrollY;
  const onNav = (y) => {
    nav.classList.toggle("is-scrolled", y > 20);
    const goingDown = y > lastY && y > 400;
    if (!document.body.classList.contains("menu-open")) nav.classList.toggle("is-hidden", goingDown);
    lastY = y;
  };

  /* ---------- mobile menu ---------- */
  const burger = $("#burger");
  const mmenu = $("#mmenu");
  function closeMenu() {
    document.body.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    mmenu.setAttribute("aria-hidden", "true");
    if (lenis) lenis.start();
  }
  burger.addEventListener("click", () => {
    const open = !document.body.classList.contains("menu-open");
    if (!open) return closeMenu();
    document.body.classList.add("menu-open");
    nav.classList.remove("is-hidden");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Close menu");
    mmenu.setAttribute("aria-hidden", "false");
    if (lenis) lenis.stop();
  });

  /* ---------- reveal on view ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const d = parseInt(el.dataset.delay || 0, 10);
        setTimeout(() => el.classList.add("is-in"), d);
        io.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  const observeAll = () => {
    $$("[data-lines], .fade, .piece").forEach((el) => {
      if (el.closest(".hero")) return; // hero handled by load sequence
      io.observe(el);
    });
  };
  // stagger siblings
  $$(".steps li, .promises .promise, .contact__list li").forEach((el, i, arr) => {
    const sibs = Array.from(el.parentElement.children);
    el.dataset.delay = sibs.indexOf(el) * 90;
  });

  /* ---------- split hero title into letters ---------- */
  (() => {
    const t = $(".hero__title");
    if (!t) return;
    let i = 0;
    $$(".line > span", t).forEach((sp) => {
      const words = sp.textContent.split(" ");
      sp.textContent = "";
      words.forEach((w, wi) => {
        const ws = document.createElement("span");
        ws.className = "w";
        [...w].forEach((c) => {
          const ch = document.createElement("span");
          ch.className = "ch"; ch.textContent = c; ch.style.setProperty("--i", i++);
          ws.appendChild(ch);
        });
        sp.appendChild(ws);
        if (wi < words.length - 1) sp.appendChild(document.createTextNode(" "));
      });
      i += 2;
    });
  })();

  /* ---------- load sequence ---------- */
  const heroLoad = () => {
    document.body.classList.add("is-loaded");
    const title = $(".hero__title");
    requestAnimationFrame(() => title && title.classList.add("is-in"));
    $$(".hero .fade").forEach((el) => setTimeout(() => el.classList.add("is-in"), parseInt(el.dataset.delay || 0, 10)));
  };

  /* ---------- hero carousel ---------- */
  const clasp = $("#clasp");
  const claspImgs = $$(".clasp__window img");
  const claspDots = $$(".clasp__dots button");
  const archImgs = $$(".clasp__arch img");
  const claspData = [
    ["Toggle charm rings", "Rings"],
    ["Black stone toggle choker", "Necklaces"],
    ["Padlock toggle bracelet", "Bracelets"],
  ];
  let ci = 0, cTimer = null;
  const showClasp = (i) => {
    ci = (i + claspImgs.length) % claspImgs.length;
    claspImgs.forEach((im, k) => im.classList.toggle("is-active", k === ci));
    archImgs.forEach((im, k) => im.classList.toggle("is-active", k === ci));
    const nm = $(".clasp__nm"); nm.classList.remove("swap"); void nm.offsetWidth; nm.classList.add("swap");
    $("#claspNum").textContent = `0${ci + 1} / 0${claspImgs.length}`;
    claspDots.forEach((d, k) => {
      d.classList.toggle("is-active", k === ci);
      d.setAttribute("aria-selected", k === ci ? "true" : "false");
      const bar = d.querySelector("i");
      bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = "";
    });
    $("#claspName").textContent = claspData[ci][0];
    $("#claspCat").textContent = claspData[ci][1];
  };
  const autoClasp = () => { clearInterval(cTimer); if (!reduced) cTimer = setInterval(() => showClasp(ci + 1), 5000); };
  claspDots.forEach((d, k) => d.addEventListener("click", () => { showClasp(k); autoClasp(); }));
  showClasp(0); autoClasp();
  document.addEventListener("visibilitychange", () => (document.hidden ? clearInterval(cTimer) : autoClasp()));

  // pointer tilt on the clasp
  const seal = $(".clasp__seal");
  if (finePointer && !reduced && clasp) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener("pointermove", (e) => {
      tx = (e.clientX / innerWidth - 0.5) * 2;
      ty = (e.clientY / innerHeight - 0.5) * 2;
    }, { passive: true });
    const loop = () => {
      cx = lerp(cx, tx, 0.06); cy = lerp(cy, ty, 0.06);
      const win = $(".clasp__window", clasp);
      win.style.translate = `${cx * -10}px ${cy * -10}px`;
      if (seal) seal.style.translate = `${cx * 14}px ${cy * 14}px`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- magnetic buttons ---------- */
  if (finePointer && !reduced) {
    $$("[data-magnetic]").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        b.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
      });
      b.addEventListener("pointerleave", () => { b.style.transform = ""; });
    });
  }

  /* ---------- filters ---------- */
  const grid = $("#grid");
  const pieces = $$(".piece", grid);
  const fBtns = $$(".filters button");
  const pill = $(".filters__pill");
  const movePill = (btn) => {
    if (!btn || !pill) return;
    const pr = btn.parentElement.getBoundingClientRect();
    const r = btn.getBoundingClientRect();
    pill.style.width = r.width + "px";
    pill.style.transform = `translateX(${r.left - pr.left + btn.parentElement.scrollLeft}px)`;
  };
  /* masonry: distribute visible pieces into columns, shortest first (keeps reading order) */
  const colCount = () => (innerWidth <= 1080 ? 2 : 3);
  let cols = [];
  const layout = () => {
    const n = colCount();
    if (cols.length !== n) {
      cols.forEach((c) => c.remove());
      cols = Array.from({ length: n }, () => { const c = document.createElement("div"); c.className = "gcol"; grid.appendChild(c); return c; });
      grid.classList.add("is-masonry");
    }
    const h = new Array(n).fill(0);
    pieces.forEach((p) => {
      if (p.hidden) { cols[0].appendChild(p); return; }
      const img = $("img", p);
      const ratio = (parseFloat(img.getAttribute("height")) || 1) / (parseFloat(img.getAttribute("width")) || 1);
      let k = 0; for (let i = 1; i < n; i++) if (h[i] < h[k] - 0.05) k = i;
      cols[k].appendChild(p);
      h[k] += ratio + 0.18;
    });
  };
  layout();
  let lastCols = colCount();
  window.addEventListener("resize", () => { if (colCount() !== lastCols) { lastCols = colCount(); layout(); } });

  let currentFilter = "all";
  function applyFilter(cat) {
    if (cat === currentFilter) return;
    currentFilter = cat;
    const btn = fBtns.find((b) => b.dataset.filter === cat);
    fBtns.forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
    movePill(btn);
    if (btn) { const bar = btn.parentElement; bar.scrollTo({ left: btn.offsetLeft - bar.clientWidth / 2 + btn.offsetWidth / 2, behavior: reduced ? "auto" : "smooth" }); }
    pieces.forEach((p) => p.classList.add("is-out"));
    setTimeout(() => {
      let n = 0;
      pieces.forEach((p) => {
        const show = cat === "all" || p.dataset.cat === cat;
        p.hidden = !show;
      });
      layout();
      pieces.forEach((p) => {
        const show = !p.hidden;
        if (show) {
          p.classList.add("is-in");
          const d = n++ * 60;
          setTimeout(() => p.classList.remove("is-out"), 30 + d);
        }
      });
      if (lenis) lenis.resize();
    }, reduced ? 0 : 380);
  }
  fBtns.forEach((b) => b.addEventListener("click", () => applyFilter(b.dataset.filter)));
  window.addEventListener("resize", () => movePill(fBtns.find((b) => b.getAttribute("aria-pressed") === "true")));

  /* ---------- custom cursor ---------- */
  const cursor = $("#cursor");
  if (finePointer && !reduced && cursor) {
    let x = -200, y = -200, px = x, py = y, on = false, sc = 0;
    window.addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    grid.addEventListener("pointerover", (e) => { on = !!e.target.closest(".piece__btn"); });
    grid.addEventListener("pointerleave", () => { on = false; });
    const loop = () => {
      px = lerp(px, x, 0.2); py = lerp(py, y, 0.2);
      sc = lerp(sc, on ? 1 : 0, 0.18);
      cursor.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${sc.toFixed(3)})`;
      requestAnimationFrame(loop);
    };
    loop();
  } else if (cursor) cursor.remove();

  /* ---------- saved pieces ---------- */
  const SKEY = "zarsa-saved";
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem(SKEY) || "[]"); } catch (_) { saved = []; }
  const nameOf = (k) => { const p = pieces.find((x) => x.dataset.key === k); return p ? p.dataset.name : k; };
  const savedLink = $("#savedLink");
  const renderSaved = (bump) => {
    try { localStorage.setItem(SKEY, JSON.stringify(saved)); } catch (_) {}
    pieces.forEach((p) => {
      const on = saved.includes(p.dataset.key);
      const b = $(".piece__save", p);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", (on ? "Remove " : "Save ") + p.dataset.name);
    });
    $("#savedCount").textContent = saved.length;
    savedLink.classList.toggle("has", saved.length > 0);
    savedLink.setAttribute("aria-label", `Saved pieces: ${saved.length}. Go to the custom order form`);
    if (bump) { savedLink.classList.remove("bump"); void savedLink.offsetWidth; savedLink.classList.add("bump"); }
    const box = $("#savedBox"), list = $("#savedList");
    box.hidden = saved.length === 0;
    list.innerHTML = "";
    saved.forEach((k) => {
      const li = document.createElement("li");
      li.textContent = nameOf(k);
      const rm = document.createElement("button");
      rm.type = "button"; rm.textContent = "×"; rm.setAttribute("aria-label", "Remove " + nameOf(k));
      rm.addEventListener("click", () => toggleSave(k));
      li.appendChild(rm); list.appendChild(li);
    });
    if (lb.classList.contains("is-open")) syncLbSave();
  };
  function toggleSave(k) {
    const had = saved.includes(k);
    saved = had ? saved.filter((x) => x !== k) : [...saved, k];
    renderSaved(!had);
  }
  pieces.forEach((p) => $(".piece__save", p).addEventListener("click", () => toggleSave(p.dataset.key)));

  /* ---------- lightbox ---------- */
  const lb = $("#lb"), lbImg = $("#lbImg"), lbName = $("#lbName"), lbCat = $("#lbCat"), lbCount = $("#lbCount"), lbDesc = $("#lbDesc"), lbSave = $("#lbSave");
  let lbList = [], li = 0, lastFocus = null;
  const visible = () => pieces.filter((p) => !p.hidden);
  const syncLbSave = () => {
    const k = lbList[li] && lbList[li].dataset.key;
    lbSave.setAttribute("aria-pressed", saved.includes(k) ? "true" : "false");
  };
  const fillLb = (swap) => {
    const p = lbList[li];
    const set = () => {
      lbImg.src = p.dataset.full;
      lbImg.alt = $("img", p).alt;
      lbName.textContent = p.dataset.name;
      lbCat.textContent = p.dataset.label;
      lbDesc.textContent = DESC[p.dataset.key] || "";
      lbCount.textContent = `${li + 1} / ${lbList.length}`;
      syncLbSave();
    };
    if (swap && !reduced) {
      lbImg.classList.add("is-swap");
      setTimeout(() => { set(); lbImg.onload = () => lbImg.classList.remove("is-swap"); if (lbImg.complete) lbImg.classList.remove("is-swap"); }, 260);
    } else set();
  };
  const openLb = (p) => {
    lbList = visible(); li = lbList.indexOf(p);
    lastFocus = document.activeElement;
    fillLb(false);
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();
    setTimeout(() => $("#lbClose").focus(), 50);
  };
  function closeLb() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lenis) lenis.start();
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  const step = (d) => { li = (li + d + lbList.length) % lbList.length; fillLb(true); };
  pieces.forEach((p) => $(".piece__btn", p).addEventListener("click", () => openLb(p)));
  $("#lbClose").addEventListener("click", closeLb);
  $("#lbPrev").addEventListener("click", () => step(-1));
  $("#lbNext").addEventListener("click", () => step(1));
  lbSave.addEventListener("click", () => toggleSave(lbList[li].dataset.key));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.id === "lbStage") closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { if (lb.classList.contains("is-open")) closeLb(); else closeMenu(); }
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "Tab") {
      const f = $$("button, a, input", lb).filter((el) => el.offsetParent !== null);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // swipe
  let sx = null, sy = null;
  const stage = $("#lbStage");
  stage.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    sx = null;
  });
  // "Ask about this piece" → prefill form
  const catMap = { rings: "Ring", bracelets: "Bracelet", necklaces: "Necklace", sets: "Set" };
  $("#lbAsk").addEventListener("click", () => {
    const p = lbList[li];
    const karat = ($('input[name="lbKarat"]:checked') || {}).value || "18K";
    const radio = $(`#contactForm input[name="category"][value="${catMap[p.dataset.cat] || "Other"}"]`);
    if (radio) radio.checked = true;
    const msg = $("#f-msg");
    msg.value = `I'm interested in the ${p.dataset.name.replace("&amp;", "&")} in ${karat} gold. `;
    closeLb();
    setTimeout(() => msg.focus({ preventScroll: true }), 900);
  });

  /* ---------- scroll-driven scenes ---------- */
  const reveal = $("#reveal");
  const rMedia = reveal && $(".reveal__media", reveal);
  const parallax = $$("[data-parallax]");
  const wornTrack = $("#wornTrack");
  const worn = $("#worn");
  const mcta = $("#mcta");
  const heroEl = $(".hero");
  const contactEl = $("#contact");

  const scene = () => {
    const y = window.scrollY;
    const vh = innerHeight;
    onNav(y);

    if (reveal && !reduced) {
      const r = reveal.getBoundingClientRect();
      const total = r.height - vh;
      const p = clamp(-r.top / total);
      const grow = clamp(p / 0.62);
      const eased = 1 - Math.pow(1 - grow, 3);
      const maxR = Math.hypot(innerWidth, vh) / Math.min(innerWidth, vh) * 72; // % to cover corners
      reveal.style.setProperty("--r", lerp(14, maxR, eased).toFixed(2) + "%");
      reveal.style.setProperty("--s", lerp(1.12, 1, eased).toFixed(3));
      reveal.style.setProperty("--o", eased.toFixed(3));
      reveal.style.setProperty("--sp", clamp((eased - 0.3) / 0.55).toFixed(3));
      reveal.style.setProperty("--t", clamp((p - 0.5) / 0.25).toFixed(3));
    }

    if (!reduced) {
      parallax.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const c = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = `translate3d(0, ${(c * parseFloat(el.dataset.parallax) * 100).toFixed(2)}%, 0)`;
      });
      if (worn && wornTrack) {
        const r = worn.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh) {
          const p = clamp((vh - r.top) / (vh + r.height));
          const max = Math.max(0, wornTrack.scrollWidth - innerWidth + 40);
          wornTrack.style.transform = `translate3d(${(-p * max).toFixed(1)}px, 0, 0)`;
        }
      }
    }

    if (mcta) {
      const pastHero = heroEl.getBoundingClientRect().bottom < 0;
      const atContact = contactEl.getBoundingClientRect().top < vh * 0.9;
      mcta.classList.toggle("is-on", pastHero && !atContact);
    }
  };
  let ticking = false;
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { scene(); ticking = false; }); } };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // On touch / reduced motion: let the worn strip scroll natively
  if (reduced || !finePointer) {
    if (wornTrack) { wornTrack.style.overflowX = "auto"; wornTrack.style.width = "auto"; wornTrack.style.scrollSnapType = "x mandatory"; wornTrack.style.paddingRight = "var(--gutter)"; wornTrack.style.scrollbarWidth = "none"; $$("figure", wornTrack).forEach((f) => (f.style.scrollSnapAlign = "start")); }
  }

  /* ---------- form ---------- */
  const form = $("#contactForm");
  const statusEl = $("#formStatus");
  const drop = $("#drop");
  const fileIn = $('input[type="file"]', drop);
  const dropName = $("#dropName");
  const dropDefault = dropName.innerHTML;
  fileIn.addEventListener("change", () => {
    const f = fileIn.files[0];
    if (!f) { dropName.innerHTML = dropDefault; return; }
    if (f.size > 10 * 1024 * 1024) { fileIn.value = ""; dropName.innerHTML = dropDefault; setStatus("That file is larger than 10 MB. Choose a smaller image or PDF.", "err"); return; }
    dropName.textContent = f.name;
  });
  ["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, () => drop.classList.add("is-over")));
  ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, () => drop.classList.remove("is-over")));

  function setStatus(msg, kind) {
    statusEl.textContent = msg;
    statusEl.className = "status" + (kind ? " " + kind : "");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.name.value.trim(), email = form.email.value.trim(), msg = form.message.value.trim();
    if (!name) return setStatus("Add your name so we know who to reply to.", "err"), form.name.focus();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return setStatus("Enter a valid email address, like name@example.com.", "err"), form.email.focus();
    if (!msg) return setStatus("Tell us a little about the piece you have in mind.", "err"), form.message.focus();
    if (!$("#agree").checked) return setStatus("Tick the box to let us contact you about this request.", "err"), $("#agree").focus();

    const btn = $('button[type="submit"]', form);
    const lbl = $(".lbl", btn);
    btn.disabled = true; btn.classList.add("is-busy"); lbl.textContent = "Sending";
    setStatus("");
    try {
      const data = new FormData(form);
      if (saved.length) data.set("message", `${msg}\n\nSaved pieces: ${saved.map(nameOf).join(", ")}`);
      const res = await fetch("/api/contact", { method: "POST", body: data });
      if (!res.ok) throw new Error("Request failed");
      const json = await res.json().catch(() => ({}));
      setStatus(json.message || "Request sent. We'll reply within two business days.", "ok");
      form.reset(); dropName.innerHTML = dropDefault;
    } catch (err) {
      console.error(err);
      setStatus("Your request didn't send. Check your connection and try again, or email zarsagold@gmail.com.", "err");
    } finally {
      btn.disabled = false; btn.classList.remove("is-busy"); lbl.textContent = "Send request";
    }
  });
  $("#cancelBtn").addEventListener("click", () => { form.reset(); dropName.innerHTML = dropDefault; setStatus(""); });

  /* ---------- boot ---------- */
  const boot = () => {
    startLenis();
    observeAll();
    renderSaved(false);
    movePill(fBtns[0]);
    scene();
    setTimeout(heroLoad, 120);
  };
  boot();
})();
