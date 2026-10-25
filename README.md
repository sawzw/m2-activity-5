# Activity 05 — Geofence Alert System

> **🛠️ Stack for this lesson** — Expo SDK 57 / React Native 0.86 + native platform APIs · runs in a development build on a real phone (native modules do not run in Expo Go).
> 📥 Template: [/learn/m2/template/activity-05-geofence-alerts](/learn/m2/template/activity-05-geofence-alerts)

A map showing two 200 m circles (UM Library and KL Central) and a button that turns alerts on. The circles and the explanation dialog are ready. You write the background work, the permission order, the fence registration and the notification.

**Time:** ~50 min core path, ~30 min second sitting · **Concept:** Concept 06 — Geofencing and Location Triggers

---

## What You'll Build

| # | TODO | File |
|---|------|------|
| 1 | A background task runs on entering and leaving a fence, with a branch for each | `tasks/geofenceTask.js` |
| 2 | Foreground location, then background location, then notifications are requested in order | `App.js` |
| 3 | Both fences are registered with the operating system | `App.js` |
| 4 | Entering a fence puts a notification on the lock screen | `tasks/geofenceTask.js` |

There are no commented-out solutions in the code. Each TODO states an outcome, a way to check it and a question to answer in your Notes doc. Read what is already there, work out what each TODO asks for, and write it.

**Already in the starter:** `App.js` (map, circles, explanation dialog, stop button); `lib/fences.js` (the two places and the task name).

## Run It

```bash
npm install --legacy-peer-deps
npx expo start --dev-client
```

Open your **development build** (the app from Activity 19) on a phone that is on the same Wi-Fi as your computer. It finds the running server and loads your code. Native modules do not run in Expo Go.

A geofence needs a development build with the location and notification plugins. Simulate movement with your emulator's location controls or walk to a fence.

## Verify

Your activity is done when, on a real device:

- [ ] Foreground and background location are both granted, and notification permission too.
- [ ] Moving into the 200 m radius (or simulating it) fires a notification within about 30 seconds.
- [ ] The notification arrives with the app closed.
- [ ] Denying background permission leaves the app usable and explains what is missing.

## Stretch

Optional. Pick one and write a short note in your Notes doc about what you tried:

- **Your theme.** Replace the two fences with places on your own daily path and write the notification as if a friend sent it.
- Add a third fence when the user taps a marker.
- Keep registered fences in `AsyncStorage` so they survive a restart.
- Give the exit event its own wording: "You left UM Library, see you next time".

## 🪞 Reflect on Your Work

Answer in 2-3 sentences each, in your Notes doc. Your tutor reads these as part of grading.

1. **What did you learn that you didn't know before?** Name the most surprising thing — a permission quirk, a platform difference, a debugging story.
2. **How did you collaborate with AI?** If you used Claude / ChatGPT / Cursor / Copilot, what part of the work did *you* contribute — the prompt, the verification, the design decision, the bug-fix? If you didn't use AI, what was the hardest thing to figure out alone?
3. **How do you know your code works?** Describe one specific thing you did to confirm — the device test you ran, the screenshot you took, the behavior you watched.

> AI is a great collaborator. Owning your thinking, verifying the output, and explaining your design choices is what *learning* looks like in this course.

## 📱 Device Evidence (required, 30% of grade)

Full marks need a real device, not a simulator or Expo's web preview. Link these in your Notes doc (`Activity 05 write-up`), under a heading **Device Notes**:

1. **`screenshot-portrait.png`** — one full-screen portrait screenshot from your device showing the fences on the map and the alerts switched on, with the status bar visible (the clock and battery prove it is a real device).
2. **`recording.mp4`** — a 30–60 second screen recording of your real device showing crossing into a fence and the notification arriving with the app closed.
3. **Device Notes** (80–150 words): the phone model and OS, what worked first try, the exact text of anything that broke, and what only the real phone showed you.

Grading: 70% feature works in code, 30% device evidence. "I tested in Expo Go web" is not device evidence.

## Submit

When the Verify checklist is green, submit the link to your Notes doc, then press **Mark as Complete**.

<!-- claude-template-fix: readme-v3 -->

<!-- claude-template-fix: notes-migration-v1 -->
