// Mobile nav
const toggle = document.querySelector(".nav-toggle");
const links = document.getElementById("nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
links.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
});

// Reveal on scroll
const revealTargets = document.querySelectorAll(".card, .stat, .arg, .goal, .steps li, .debate, .callout, .sim, .mission, .letter-box");
revealTargets.forEach((el) => el.classList.add("reveal"));
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("in"));
}

// Tracking simulation (fictional data)
const reads = [
  ["07:42 AM", "CAM 0412", "Residential street", "home"],
  ["08:15 AM", "CAM 1187", "University parking entrance", "school"],
  ["12:31 PM", "CAM 0093", "Medical plaza on Route 9", "medical"],
  ["01:10 PM", "CAM 1190", "University parking entrance", "school"],
  ["05:48 PM", "CAM 2204", "Retail center, part-time job", "work"],
  ["07:20 PM", "CAM 0761", "Community center on Oak Ave", "worship"],
  ["11:58 PM", "CAM 3315", "Apartment complex across town", "overnight"],
];
const log = document.getElementById("sim-log");
const summary = document.getElementById("sim-summary");
const runBtn = document.getElementById("sim-run");
let running = false;
log.innerHTML = '<li class="empty">Press "Run the search" to query the network.</li>';

runBtn.addEventListener("click", () => {
  if (running) return;
  running = true;
  log.innerHTML = "";
  summary.hidden = true;
  runBtn.textContent = "Searching...";
  const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450;
  reads.forEach((r, i) => {
    setTimeout(() => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="t">${r[0]}</span><span class="c">${r[1]}</span><span>${r[2]} <span class="tag">→ ${r[3]}</span></span>`;
      log.appendChild(li);
      if (i === reads.length - 1) {
        summary.hidden = false;
        runBtn.textContent = "Run again";
        running = false;
      }
    }, delay * (i + 1));
  });
});

// Letter generator
const fields = {
  name: document.getElementById("f-name"),
  city: document.getElementById("f-city"),
  rep: document.getElementById("f-rep"),
  why: document.getElementById("f-why"),
};
const out = document.getElementById("letter-out");

function buildLetter() {
  const name = fields.name.value.trim() || "[Your name]";
  const city = fields.city.value.trim() || "[City, State]";
  const rep = fields.rep.value.trim() || "[Representative / Senator name]";
  const why = fields.why.value.trim();

  return `Dear ${rep},

My name is ${name}, and I am your constituent in ${city}. I am writing to ask you to support a nationwide ban on Flock automated license plate reader cameras.

These cameras photograph every passing vehicle, record its plate, appearance, time, and location, and store that information in databases that can be searched across many agencies. Millions of innocent drivers are tracked without any suspicion of wrongdoing, and there is no comprehensive federal law limiting how this data is collected, kept, or shared.
${why ? `\n${why}\n` : ""}
In Carpenter v. United States (2018), the Supreme Court recognized that tracking a person's movements over time reveals the "privacies of life." I believe the same principle should apply to camera networks that log where Americans drive every day.

I respectfully ask that you:
  1. Support hearings on automated license plate surveillance and its misuse.
  2. Sponsor or co-sponsor legislation banning Flock cameras nationwide.
  3. Support clear federal limits on how surveillance data is collected and shared.

Thank you for your time and for representing our community.

Sincerely,
${name}
${city}`;
}

function render() { out.textContent = buildLetter(); }
Object.values(fields).forEach((f) => f.addEventListener("input", render));
render();

function flash(el, msg) {
  el.textContent = msg;
  setTimeout(() => { el.textContent = ""; }, 2500);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

const copyStatus = document.getElementById("copy-status");
document.getElementById("copy-letter").addEventListener("click", async () => {
  const ok = await copyText(buildLetter());
  flash(copyStatus, ok ? "Copied. Paste it into your rep's contact form." : "Copy failed. Select the text manually.");
});

const shareBtn = document.getElementById("share-btn");
shareBtn.addEventListener("click", async () => {
  const ok = await copyText(window.location.href.split("#")[0]);
  const original = "Copy link to this site";
  shareBtn.textContent = ok ? "Link copied" : "Copy failed";
  setTimeout(() => { shareBtn.textContent = original; }, 2000);
});
