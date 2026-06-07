# Changelog

All notable updates for Neon Hatch Pet are tracked here.

## v2.12.0 - Dock Journal And More Play

- Reworked the hover bottom bar into a compact category dock inspired by the reference project: Care, Play, Mood, Today, and More now expand into a scrollable sub-action row.
- Added a companion journal panel that records recent hatch milestones, care interactions, moods, ToDo progress, check-ins, mouse gestures, drags, and companion-time moments.
- Added High Five and Sing interactions with randomized animation variants, contextual feedback, right-click entries, daily-task matching, and journal logging.
- Added bottom-dock access to journal, time announcement, owner call, naming, daily tasks, full menu, and reset through the More category.
- Added desktop automation hooks for opening quick-bar categories and the journal panel.

## v2.11.0 - Todo Pro And Play Pack

- Upgraded Today ToDo with editable task rows, drag/drop sorting, up/down ordering buttons, and a live remaining-count summary.
- Added optional carry-over for unfinished tasks from the previous day instead of silently discarding them.
- Added ToDo completion celebration with stronger animation, particles, and a short optional Web Audio chime.
- Added `bornAtMs` compatibility for companion duration reports while keeping existing `startedAt` saves working.
- Added four new interactions: tickle, snack, hide-and-seek, and photo, each with randomized pixel animation variants and contextual feedback.
- Added the new interactions to the hover care bar, right-click menu, and daily task pool.

## v2.10.0 - Living Interaction Variants

- Added randomized animation variants for feed, play, pet, explore, dance, sleep, clean, and mood interactions.
- Added intimacy-stage feedback tails so every major interaction can respond differently at Lv.1 through Lv.5 relationship stages.
- Improved daily companion-time scheduling with 2-4 random reminders spread across morning, noon, afternoon, and evening windows.
- Added drag interactions: moving the pet by holding the mouse now triggers randomized feedback, particles, and small happiness/bond rewards.
- Added explore and dance to the hover care bar for faster access to more interactions.
- Added desktop automation hooks for intimacy feedback previews and forced drag-interaction verification.

## v2.9.0 - Contextual Color And Companion Time

- Added time-of-day and seasonal color tinting so the pet palette shifts between morning, noon, afternoon, evening, night, and the current season.
- Expanded feed, play, pet, explore, dance, sleep, clean, and mood interactions with randomized feedback based on time period, current stats, relationship stage, and season.
- Added tomorrow companion-time moments: the pet schedules several random daytime/evening reminders and tells the owner how long it has been accompanying them.
- Added period, stage, and season-aware grammar for companion-time reminders.
- Added desktop automation hooks for verifying contextual themes and forced companion-time reminders.

## v2.8.0 - Daily ToDo Companion

- Reduced the hover bottom bar to care, mood, and today-focused actions.
- Added a Today ToDo panel with multiline task input, checkbox progress tracking, progress feedback, all-done feedback, and later reminders.
- Added configurable morning ToDo planning prompts, daytime progress check-ins, and evening completion summaries.
- Added right-click ToDo settings for morning prompt time, daytime reminder interval, and evening summary time.
- Added ToDo-specific feedback bubbles and pixel activities for planning, checking, completion, and summaries.
- Added desktop automation hooks for ToDo setup, reminders, and summary verification.

## v2.7.0 - Classified Quick Interaction Panel

- Expanded the hover quick bar into a classified multi-row interaction panel.
- Added direct bottom-panel access to care, activity, mood, relationship, daily, reset, time announcement, and full-menu actions.
- Added all 10 mood choices to the bottom panel with command values wired to the existing mood feedback system.
- Added an egg-mode panel with hatch, owner naming, and full-menu actions.
- Repositioned the pet canvas and increased the transparent desktop window height so the multi-row panel has room without crowding the pet.

## v2.6.0 - Hover Quick Bar And Ambient Chatter

- Added a bottom quick interaction bar that appears when the mouse moves over the pet.
- Added quick-bar actions for hatch, owner naming, feed, play, petting, chatting, and activity check-ins.
- Added a direct chat interaction with randomized owner-aware replies and matching pet animations.
- Expanded idle random actions with peek, listen, typing, scan, guard, curious, dream, and daily-chatter behaviors.
- Idle random actions now show visible text feedback bubbles instead of only updating hidden status text.
- Increased the transparent desktop window height to make room for the hover quick bar.

## v2.5.0 - Memory And Daily Companion

- Added desktop-pet daily tasks that can be completed through check-ins, mood choices, petting, feeding, reminders, and mouse gestures.
- Added task rewards with credits, stat boosts, richer "daily complete" feedback, and a celebratory desktop animation.
- Added short-term activity memory so repeated activity choices can influence later pet replies.
- Added relationship growth levels based on bond, with level-up feedback and a dedicated animation.
- Added right-click menu entries for daily task progress, task refresh, and relationship growth status.
- Added deterministic desktop test hooks for daily tasks and growth-state checks.

## v2.4.1 - Windows Offline Packaging

- Added a Windows PowerShell packaging script for creating a portable Electron folder and zip archive.
- Added `npm run package:win` for online Windows build machines.
- Documented how to copy and run the packaged app on offline Windows computers.

## v2.4.0 - Context Companion Interactions

- Added time-of-day companion check-ins for morning, noon, afternoon, evening, and night.
- Added an in-pet activity choice panel with work, reading, study, entertainment, rest, and idle options.
- Added option-specific feedback and follow-up reminders for breaks, review, hydration, or returning gently from rest.
- Added right-click controls for manually starting a check-in and setting the check-in interval.
- Added mouse-motion feedback without clicking: horizontal swipes, upward swipes, downward swipes, zigzags, and loop gestures now trigger distinct actions and text.
- Added a macOS packaging script for creating a portable `.app` and zip archive for offline Macs.

## v2.3.0 - Relationship Desktop Pet

- Added custom pet naming after hatch.
- Added custom owner title, available even before hatch.
- Added owner-addressed feedback across feeding, playing, petting, mood replies, time announcements, and care reminders.
- Added randomized periodic owner calls with configurable intervals: off, 2 minutes, 5 minutes, 10 minutes, and 30 minutes.
- Added a manual "call owner" action in the right-click relationship menu.
- Replaced Electron `window.prompt` naming with an in-pet pixel input panel that supports Enter to save and Esc to cancel.

## v2.2.0 - Living Status And Feedback

- Added richer mood replies with visible text bubbles and specific animations for celebration, breathing, comfort, cooldown, hug, spark rush, and focus.
- Added animated time announcements with particles and feedback bubbles.
- Added 3-second still-hover status details for satiety, happiness, and energy.
- Added slow time-based stat drift.
- Added configurable low-stat reminders for feed, play, and sleep thresholds at 30%, 40%, 50%, 60%, or 70%.

## v2.1.0 - Pet-Only Desktop Mode

- Converted the Electron desktop pet into a transparent pet-only window.
- Removed the old visible panel, background, buttons, and text input from the desktop mode.
- Moved desktop interactions into the native right-click menu.
- Kept left-click as a quick hatch/pet action and direct drag movement on the pet body.
- Added configurable desktop time announcements with interval and format settings.

## v2.0.0 - Electron Desktop Pet

- Added the Electron desktop pet app.
- Added a transparent frameless always-on-top window.
- Added desktop hatch, feed, play, explore, mood, petting, dance, sleep, and clean actions.
- Added local desktop state persistence.
- Added idle random actions and desktop pet animation states.

## v1.0.0 - Web Pet Prototype

- Built the cyber pixel web pet prototype.
- Added egg hatching with configurable hatch time.
- Added random pet generation.
- Added feeding, playing, cleaning, resting, training, mood replies, shop supplies, daily quests, exploration, accessories, and the spark-click minigame.
- Added local web state persistence and browser automation hooks.
