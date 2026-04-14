## Music-webpage

## Project Overview
Music-webpage is an interactive front-end audio player that focuses on responsive media controls and smooth playback state management using the HTML Audio API.

The interface supports playlist navigation, progress tracking, keyboard shortcuts, and dynamic UI feedback for active playback.

## Tech Stack
- HTML5
- CSS3
- Vanilla JavaScript (ES6)
- HTML Audio API

## Core Functions

### `formatTime(seconds)`
- Converts raw time values into `mm:ss`.
- Standardizes duration and progress display for the player.

### `updatePlayIcon()`
- Synchronizes the control icon with current playback state.
- Switches between play and pause icon assets.

### `updateTimeLabel()`
- Displays real-time playback status (`current / duration`).
- Improves user control by making track progress explicit.

### `updateActiveSongUI()`
- Updates current song title in the hero section.
- Highlights the active song inside the playlist panel.

### `setSong(index, autoplay)`
- Loads song source by index with circular navigation.
- Resets seek state, updates UI, and starts playback when requested.
- Serves as the central state update function for song transitions.

### `renderPlaylist()`
- Renders song items from the configured song array.
- Binds click handlers so each song can be selected directly.

## Current Highlights
- Play/Pause, Previous, and Next controls
- Seek slider + live time updates
- Volume slider with real-time adjustment
- Keyboard shortcuts (`Space`, `ArrowLeft`, `ArrowRight`)

## Suggested Next Features
- Add shuffle/repeat modes.
- Persist last played song and volume in localStorage.
- Integrate artist metadata API for richer track context.
