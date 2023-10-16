# 𝗥𝘅𝑓𝑥 Chess Vision Trainer

# Architecture

The following libraries are used to build this site:

- Vite - For running a dev server, and building the app.
- Typescript - For a less error-prone coding experience.
- React - For turning objects into DOM, via JSX.
- 𝗥𝘅𝑓𝑥 - For decoupling components, handling effects like speech, and for avoiding prop-drilling.
- Redux - For state management and persistenece.
- XState - For the overall game flow.
- `vite-plugin-pwa` - For building the app to be able to work offline.

## Folder Structure

- `ui/components` - (React) Any React component lives here. Note these tend to be very simple and limited to a) triggering events b)  _This means that folders outside of this one are framework-agnostic, pure JS/TS!!_

- `machines` - (XState) The `trainer` state-machine that controls the overall game flow lives here.

- `events` - (JS) The strongly-typed events that `<Controls>` raises are defined here.

- `services` - (RxFx) Bus listeners like `positionService` - which tracks the piece's position and options - lives here

- `effects` - (RxFx) The `speechEffect` that handles speech synthesis, and the `moveEffect` which animates the correct move, live here.


Keep in mind that some modules depend on each other directly, while others are connected through the events they publish to, or subscribe from the Event Bus.
