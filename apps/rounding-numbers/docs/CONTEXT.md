# Context: Rounding Numbers Game

An interactive educational game teaching Grade 4 students (ages 9–10) to round
whole numbers to a given place value (tens through hundred millions), based on
the "Math World 4" lesson (Chapter 1, Lesson 3). Standard rounding rule: look at
the digit to the right of the target place — 5 or greater rounds up, less than 5
stays the same; zero out everything to the right.

> System-wide structure/tooling decisions live in the root
> [`docs/adr/`](../../../docs/adr/). This file holds the *game's* domain decisions.

## Decisions

- **Tech stack:** React + Vite app inside the monorepo (`apps/rounding-numbers`).
  Runs locally (no backend). Leaderboard persisted in browser `localStorage`
  (single-device).
- **Answer format:** Multiple choice, **4 buttons** (1 correct + 3 distractors),
  shuffled. Distractors are common rounding mistakes so wrong taps can be taught
  against in the hint.
- **Session shape:** Endless survival. Game ends only when lives reach zero.
  Score is **points** (see Scoring), not a raw count of correct answers.
- **Lives:** Easy 5, Normal 4, Hard 3 starting lives. A wrong OR missed
  (timed-out) answer costs one life. **Hard mode only** regains 1 life every
  10-answer streak, capped at its starting max of 3. Easy/Normal never regain.
- **Scoring & streaks:** +10 base points per correct answer. Once the current
  streak reaches 3, each further correct answer adds a combo bonus of
  `+5 × (streak − 2)`. Every 10-in-a-row awards a celebratory +100 (and the Hard
  life-back above). A wrong/missed answer resets the streak to 0. A visible
  streak counter/animation shows the chain.
- **Hard timer:** 10s countdown per question. Timeout = missed answer (lose a
  life). After a correct answer auto-advance ~1.5s; after a wrong/missed answer
  reveal the correct answer and auto-advance ~2s.
- **Easy/Normal pacing:** No timer. Player advances manually with a Next button
  after each question.
- **Difficulty place-value behavior:**
  - *Easy* — player picks one place value; it stays fixed all game.
  - *Normal* — player picks a starting place value; each question moves ±1 step
    along the ladder at random, bouncing off the ends (tens / hundred millions).
  - *Hard* — place value is random each question; no player choice.
- **Audio:** All sound effects and background music are synthesized in-code via
  the Web Audio API (no asset files). One distinct generated background tune per
  difficulty. Includes a mute toggle.
- **Leaderboard:** Four boards shown as tabs — Easy, Normal, Hard (each top-10 by
  **points**), plus an **Overall** board ranked by weighted points
  (points × 1 Easy / × 2 Normal / × 3 Hard). Stored in `localStorage`.
- **Name entry:** Always prompt at game-over for a **display nickname** (not a
  real name) with on-screen guidance "Don't use your real name"; prefill with the
  last-used nickname. Score is filed into its difficulty board and the Overall
  board. Per the repo-wide no-PII-from-children policy, never collect or store any
  real-name/email/PII — nicknames only, client-side `localStorage`.
- **Question style:** Plain abstract "Round N to the nearest <place>." rendered
  big and clear, wrapped in a kid-friendly visual theme/mascot (no word problems).
- **Number generation:** Includes instructive tricky cases weighted by difficulty
  — Easy mostly clear-cut with rare boundaries; Normal adds exactly-5 boundaries;
  Hard freely includes boundary and cascade/carry cases (e.g. 95,500 → 100,000).
- **Hint/explanation (Easy & Normal only):** Auto-shown after every answer.
  Underlines the target place-value digit, colors the digit to its right, states
  the rule applied (≥5 round up / <5 keep), shows the zeroed result, and for a
  wrong tap names the misconception that distractor represents. Also shows an
  animated **number line** (lower/upper endpoints, midpoint, and a tick for the
  actual number) proving which side it's closer to — covering both methods the
  lesson teaches. Hidden on Hard.
- **Distractors:** Drawn from four modeled misconceptions, each with its own
  tailored "why that's wrong" explanation: (1) wrong direction / other
  number-line endpoint, (2) rounded to an adjacent place value, (3) truncated /
  always rounded down without checking the rule, (4) didn't zero the trailing
  digits. The generator picks 3 distinct, valid distractors per question
  (deduping collisions, never equal to the correct answer).
- **Place-value picker (Easy/Normal):** A grid of 8 tappable cards, each with the
  place name and a tiny example showing that digit position highlighted in a
  sample number (e.g. 6[3]4,572). Big touch targets; teaches place value before
  play. (Hard has no picker — random each question.)
- **Form factor:** Responsive, tablet-first (touch). Big tap targets, no reliance
  on hover/keyboard; scales down to phone and up to desktop.
- **Theme:** ~4 cosmetic themes (e.g. Space, Jungle, Underwater, Candy-Arcade),
  one chosen at random when a game starts → controls palette, mascot, background,
  and life/score icons only. Never changes math, rules, or difficulty. Background
  music stays per-difficulty (3 generated tunes), independent of theme.
- **Number format:** Comma thousands separators everywhere (e.g. 389,645,000),
  per common PH textbook convention.
- **Visual art:** Built in-code with CSS/SVG/emoji — no external image files, so
  the app stays self-contained and works offline (consistent with synthesized
  audio).
- **Onboarding:** Skippable opening card on first run — how to play + a 3-step
  rounding refresher from the lesson. Reachable anytime via a "?" button.
- **Pause/quit:** Pause button freezes the game (incl. Hard timer) with
  Resume/Quit. Quitting confirms and discards the run (no leaderboard entry).
- **Language:** English UI and explanations throughout (matches lesson + PH math
  medium of instruction).
- **Accessibility:** Digit highlighting is not color-only — the target place uses
  an underline + bold and the look-right digit is labeled, so colorblind kids can
  follow. Touch targets sized for tablets.
- **Settings:** Mute toggle (audio on/off) and a "Clear scores" action
  (confirm-gated) to reset the leaderboard.
- **Feedback/juice:** Playful & animated. Themed mascot reacts (cheer/jump on
  correct, gentle "aww" on wrong — never mocking), answer button green-pop /
  red-shake, correct answer glows, confetti on milestone (every-10) streaks.
  Distinct synthesized sounds for: tap/select, correct, wrong, streak milestone,
  life-lost, life-gained, game-over, plus per-difficulty background music.

## Glossary

- **Place value** — the rounding target. The eight supported values, smallest to
  largest: tens, hundreds, thousands, ten thousands, hundred thousands, millions,
  ten millions, hundred millions. Modeled as a **ladder** indexed 0–7.
- **Round / Rounding** — replacing a number with a nearby "about how much" value
  at the indicated place value.
- **Look digit** — the digit immediately to the right of the target place; the one
  the ≥5 / <5 rule inspects.
- **Distractor** — a wrong multiple-choice option, each modeling a specific known
  misconception (see Distractors above).
- **Streak** — count of consecutive correct answers; resets on any wrong/missed
  answer. Drives combo bonus points and (Hard) life regain.
