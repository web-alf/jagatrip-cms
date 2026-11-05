---
target: the batch2 landing page (hero flyer, form, FAQ)
total_score: 28
max_score: 36
na_heuristics: 10
p0_count: 0
p1_count: 3
target_identity: "file:/home/archyless/al-madinah/jagatrip-cms/src/pages/batch2.astro"
target_fingerprint: "sha256:8bebe2e2006fdaba04db5dbfc0222d133704830549e8277b1fa35e6e43acbb46"
target_path: /home/archyless/al-madinah/jagatrip-cms/src/pages/batch2.astro
timestamp: 2026-11-05T15-35-53Z
slug: src-pages-batch2-astro
---
Method: dual-agent (A: general-purpose design-review agent · B: general-purpose detector/evidence agent, first attempt crashed on an infrastructure/API timeout after 25+ min with no report delivered, re-run from scratch with tighter time-boxing)

**Note on timing**: between when this review's target was fixed and when the two assessments actually read the page, the hero flyer's flip interaction was reimplemented with different code (now `.flyer-card.f1`/`.f2`, a 2D z-index/transform swap) than a version with a visible "tap to flip" hint that had just been built — most likely from the other session working on this same file concurrently. Both assessments independently evaluated the *current* code, so the findings below are accurate for what's on disk now, but the flyer-discoverability issue reported below is about this current implementation, not the one being built moments earlier. Separately, the registration form's `jabatan`/`alamat` fields (role and address) were added to the form and backend during this same window — Assessment A's source read happened to catch this already-updated form, so that gap is already closed and isn't listed below.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Submit shows "Mengirim…" → "Data terkirim"; tabs/FAQ/flyer all reflect state via ARIA attributes. But the success message shows even if the backend POST silently fails. |
| 2 | Match Between System & Real World | 4 | Correct, natural use of rektor/dekan/ketua yayasan/PIC/MoU/PKS/IKU terminology throughout. |
| 3 | User Control and Freedom | 3 | Tabs/FAQ are reversible; the page auto-redirects to wa.me 600ms after submit with no way to stay and re-read the confirmation first. |
| 4 | Consistency and Standards | 4 | One button style, one heading system, orange=CTA / navy=info used consistently across 10+ sections. |
| 5 | Error Prevention | 3 | `normalizeWa()` accepts 08xx/8xx/+62 formats with an example placeholder; no debounce on rapid re-clicks before the submit button disables. |
| 6 | Recognition Rather Than Recall | 2 | Price (Rp13.600.000), dates, and "10 pendaftar pertama" are stated once, well above the form, with nothing recapped beside it at the exact moment of commitment. |
| 7 | Flexibility and Efficiency | 3 | `autocomplete` on every field speeds up repeat fillers; anchor nav gives desktop users direct jumps (lost on mobile — see P2). |
| 8 | Aesthetic and Minimalist Design | 3 | Strong section-level restraint, but the Perguruan Tinggi tab dumps 12 undivided cards at once. |
| 9 | Help Recognize/Diagnose/Recover from Errors | 3 | Inline validation is genuinely good (per-field red border + example text + focus-to-first-error) — but there's no user-facing failure path if the backend POST fails; the UI always claims success. |
| 10 | Help and Documentation | n/a | A single-purpose lead-gen landing page has no features needing documentation; the FAQ section already fills that role contextually. |
| **Total** | | **28/36** | **Good (78%)** |

## Design Specificity Verdict

**LLM assessment**: Not reusable as-is by an unrelated company. The copy shows real domain fluency — Indonesian education-sector jargon used correctly (IKU, BK/guru BK, SMK-track customization, MoU vs. PKS, "penjaminan mutu", akreditasi-as-evidence framing), named real partner campuses (University of Cyberjaya, Asia Metropolitan University, TAR UMT) with their actual faculties, a real date/price/admin WhatsApp number wired to a real Apps Script backend, and two audience-specific program tracks (school vs. higher-ed) with non-overlapping content. This is built for Jagatrip's actual January 2027 batch, not a templated "trip landing page."

**Deterministic scan**: The static source-file scan (`impeccable detect --json src/pages/batch2.astro`) found **0 primary / 0 advisory** findings — clean at the markup/pattern level. A separate rendered-page overlay scan (same page, live at 1440×900) caught **4 findings the static scan and the LLM review both missed**: short orphaned words ("stragglers") left alone on the last line of a wrapped paragraph — `"Malaysia"` (16% of the measure), `"kunjungan."` (24%), `"kampus."` (12%), and `"kunjungan"` (29%) — all in hero/body copy. This is exactly the kind of viewport-dependent typographic issue a file-level scan structurally cannot catch, and a real, fixable widow problem in first-impression copy. No false positives in either scan.

**Visual overlays**: Script injection into the live page succeeded and the detector ran in-page (confirmed via console output), but this ran through a headless automated browser, not a visible window on your screen — there is no "[Human]" tab you can look at for this run. The evidence is the console output above plus timestamped before/after screenshots the agent saved under `/tmp/impeccable-eval-b/` (not in the repo).

## Overall Impression

This is a page written by someone who understands the audience, not a template. The narrative arc (aspiration → legitimacy → urgency → price) is genuinely well-paced, and the ARIA-tabs and form-validation engineering are better than most lead-gen pages bother with. The gap is that the page's best reassurance work happens in the middle, and its single biggest ask — an institutional leader handing over a personal WhatsApp number — lands on the thinnest, least-reassuring part of the page. The flyer flip (confirmed working via `aria-pressed` toggling false→true and a real pixel diff on screenshots at both viewports) is a nice idea that's currently invisible as an affordance, so most visitors will never discover it.

## What's Working

- **Section pacing/color-blocking** (navy "about", warm-gradient "prog", deep-blue "benefit", orange "bridge") creates real narrative rhythm instead of a flat scroll of white cards.
- **The program tabs** (`#tab-s`/`#tab-p`) are a textbook-correct ARIA tabs implementation — roving tabindex, arrow-key switching, `aria-selected` — confirmed working via both click and keyboard testing.
- **Form engineering care**: inline per-field validation with example-format text, `aria-invalid`/`aria-describedby` wiring, focus-to-first-error, and `keepalive: true` on the lead-capture fetch so the POST survives the immediate redirect to WhatsApp — a reliability detail most lead forms skip. The form now also correctly captures role (`jabatan`) and address (`alamat`), closing what would otherwise have been a lead-qualification gap.

## Priority Issues

**[P1] Flyer flip has no visible affordance.**
What: `#flyerFlip` is a plain `<button>` wrapping two stacked images (`.flyer-card.f1`/`.f2`) with no icon, label, or on-screen cue that it's interactive — confirmed the only change on hover is a slightly deeper shadow. The mechanism itself works (`aria-pressed` toggles false→true and screenshots differ by 3.3%–20.6% of pixels at the two tested viewports), but `aria-label` stays the static "Tukar flyer JAGATRIP ke depan" regardless of state, so even a screen-reader user gets no confirmation anything changed.
Why it matters: the flyer is the first rich visual element in the hero. If visitors never discover it flips, the back-side content is simply never seen, and a screen-reader user who does activate it has no idea it did anything.
Fix: add a small visible label/icon near the flyer ("Ketuk untuk lihat sisi lain"), and update `aria-label` on click to reflect the current face shown, not a fixed string.
Suggested command: `$impeccable delight` or `$impeccable clarify` (affordance + copy), `$impeccable audit` to re-check the ARIA state after.

**[P1] No price/date recap at the registration form, and thin reassurance at the commitment moment.**
What: the `#daftar` form section repeats none of the Rp13.600.000 price, 11–14 Jan 2027 dates, or early-bird quota shown earlier; the only trust elements are two small proof photos with one generic caption.
Why it matters: this is the exact moment an institutional leader commits budget interest and hands over a personal WhatsApp number — the page should be doing its most reassuring work here, not its least.
Fix: add a compact summary line next to the form ("Rp13.600.000/orang · 11–14 Jan 2027 · kuota early bird terbatas") and strengthen proof (partner logos, a short quote, or the admin's name/photo since follow-up is personal anyway).
Suggested command: `$impeccable layout` (placement/hierarchy) then `$impeccable polish`.

**[P1] Lead-capture failure is invisible to both user and team.**
What: `fetch(APPS_SCRIPT_URL, {mode:'no-cors', ...}).catch(function(){})` — confirmed the POST does fire, but `no-cors` makes the response opaque and the empty `.catch` swallows any network error. The UI always shows "Data terkirim" regardless of whether the Apps Script backend actually received the row.
Why it matters: if the endpoint is ever down, renamed, or rate-limited, Jagatrip silently loses institutional leads while the visitor believes registration succeeded (the WhatsApp redirect still happens, which partially saves the lead, but only if they actually send that pre-filled message).
Fix: instrument the Apps Script side to alert on failures, and/or add a visible fallback ("coba lagi" / contact admin directly) if the request doesn't resolve within a timeout.
Suggested command: `$impeccable harden`.

**[P2] Unverifiable scarcity claim ("untuk 10 pendaftar pertama").**
What: the price card states early-bird pricing applies to the first 10 registrants with no counter of how many remain or have registered.
Why it matters: for an audience explicitly sensitive to being "sold to" (the FAQ's own careful, non-hype tone — "MoU tidak otomatis menaikkan akreditasi" — is a strength elsewhere), an unsubstantiated fixed number reads as generic urgency tactics, cutting against the trust the rest of the page works hard to build.
Fix: either surface a real, backend-driven remaining-slot count, or soften to qualitative framing ("kuota terbatas") if a live number can't be maintained.
Suggested command: `$impeccable clarify`.

**[P2] Mobile header drops all section navigation with no replacement.**
What: `.top nav a:not(.btn){display:none}` at ≤960px removes the Program/Manfaat/Biaya/FAQ links entirely on mobile, leaving only the "Daftar" button — no hamburger or alternative appears.
Why it matters: the page is ~7,500–11,000px tall depending on content; mobile visitors (likely the majority, given the Iklan/Medsos→website funnel) lose their only way to jump directly to Biaya or FAQ and must linearly scroll the whole page.
Fix: add a simple mobile menu sheet, or at minimum keep Biaya/FAQ as a compact pill row under the sticky header.
Suggested command: `$impeccable adapt`.

## Persona Red Flags

**Jordan (confused first-timer)**: Never discovers the flyer flip (no affordance, see P1). Hits "PIC kampus" in the hero copy and again in the agenda before any plain-language gloss is given — the FAQ reuses the term without ever spelling it out. At the registration form, with no price/date recap, Jordan has to scroll back up to confirm what they're agreeing to before typing a WhatsApp number — exactly the hesitation point a nervous first-timer needs resolved, not created.

**Casey (distracted mobile user)**: Benefits from the one genuinely good mobile accommodation — the sticky header's "Daftar" button stays reachable at all times. But the Perguruan Tinggi tab delivers 12 full cards in a single-column stack on mobile, many screens of thumb-flicking before reaching pricing, with no "top 4 + show more" progressive disclosure. If interrupted mid-scroll, there's no resume point — she starts over from wherever she left off, not from a remembered state. She also has no section nav at all (P2 above).

**Sam (accessibility-dependent)**: Genuine strengths confirmed: a global `:focus-visible` outline gives a real visible focus ring everywhere; the tabs use correct ARIA roles/roving tabindex/arrow keys; all measured text-contrast ratios cleared 4.5:1+. But the flyer's `aria-label` never updates with its `aria-pressed` state (P1), so a screen-reader user gets zero indication anything changed after activating it — the visual-only "flip" content is never described in text at all for a blind user.

## Minor Observations

- 4 orphaned-word "widow" line breaks caught by the rendered-overlay scan in hero/body copy at 1440×900 (see Deterministic scan above) — a quick typographic fix (non-breaking space or a manual line-break adjustment on the affected copy).
- FAQ uses native `<details>` with no JS exclusivity, so multiple items can be expanded at once; the first item also loads already-expanded (confirmed: `open=true` before any click) rather than collapsed, adding to initial scroll length.
- `.tabs button .ico{display:none}` on mobile removes the book/cap icons from the tab buttons — a small loss of visual distinction; text-only differentiation remains adequate.
- The role/address fields (`jabatan`, `alamat`) were added to the form and payload during this review window — this closes what would have been a lead-qualification gap; no action needed.
- Og:image/meta, favicon, and canonical URL are all correctly wired; no obvious SEO gaps for a landing page of this type.

## Questions to Consider

1. If the flyer's back side exists to show a second value-prop angle, why hide it behind an undiscoverable click instead of showing both framings as two always-visible panels — what does the flip interaction buy you that a static second panel wouldn't?
2. The page clearly knows its audience is skeptical of hype (the FAQ's own honesty about MoU/accreditation is a strength) — so why lean on an unverifiable "first 10" scarcity claim in pricing? What would this section look like leaning entirely on verifiable proof instead of urgency mechanics?
3. Given the real stakes of this moment (an institutional leader handing over contact info, not an impulse buy), what would the registration section look like designed as its own small "closing" experience — recap, named human contact, explicit next-step timeline — rather than reusing the same generic form-card pattern as every other lead-gen page?
