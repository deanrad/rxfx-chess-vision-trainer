<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [𝗥𝘅𝑓𝑥 Chess Vision Trainer](#%F0%9D%97%A5%F0%9D%98%85%F0%9D%91%93%F0%9D%91%A5-chess-vision-trainer)
- [Architecture](#architecture)
  - [Folder Structure](#folder-structure)
  - [Why an Event Bus?](#why-an-event-bus)
    - [Example - Event: Toggling Notation](#example---event-toggling-notation)
    - [Example - Event: Toggling Piece visibility](#example---event-toggling-piece-visibility)
    - [Example - Effect: Speech Synthesis](#example---effect-speech-synthesis)
      - [Activity Detection](#activity-detection)
      - [Cancelation](#cancelation)
      - [Summary](#summary)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 𝗥𝘅𝑓𝑥 Chess Vision Trainer

This is a game meant to be a reference architecture for a Vite Single Page App with React and an Event Bus.

The game is meant to help a player understand how to move chess pieces, and how to understand the notation for squares, such as _"Move the knight to a4"_.

How its played is that after a click or tap, the game shows a piece and asks you how to move the piece to a certain square, naming the square in [Algebraic Notation](https://en.wikipedia.org/wiki/Algebraic_notation_(chess)). It will take two moves to reach that square, so the player must choose and click on the square the piece must move to in order to arrive at the target on the next move.

# Architecture

The following libraries are used to build this site:

- Vite - For running a dev server, and building the app.
- Typescript - For a less error-prone coding experience.
- React - For turning objects into DOM, via JSX.
- 𝗥𝘅𝑓𝑥 - For an Event bus which serves to decouple components, handle effects like speech, and avoid prop-drilling.
- Redux - For state management and persistenece.
- XState - For the overall game flow.
- `vite-plugin-pwa` - For building the app to be able to work offline.

## Folder Structure

- `ui/components` - (React) Any React component lives here. Note these tend to be very simple and limited to a) triggering events b) _This means that folders outside of this one are framework-agnostic, pure JS/TS!!_

- `ui/pages` - (React) Any pages or layouts that routes point to should be defined here.

- `ui/hooks` = (React) Custom hooks should be defined here.

The rest of the folders should contain pure JS objects that _never_ should import from the `ui` directory. This is to keep them testable without React, and never subject to changes resulting from React framework version changes.

- `machines` - (XState) The `trainer` state-machine that controls the overall game flow lives here.

- `events` - (JS) The strongly-typed events that `<Controls>` raises are defined here.

- `handlers` - (JS) Event handlers can live here, if they do not close over any state of a React component.

- `services` - (𝗥𝘅𝑓𝑥) Bus listeners like `positionService` - which tracks the piece's position and options - lives here

- `effects` - (𝗥𝘅𝑓𝑥) The `speechEffect` that handles speech synthesis, and the `moveEffect` which animates the correct move, live here.

## Why an Event Bus?

React components, and code modules in general, can be decoupled, and prop-drilling minimized or eliminated, when they share events over the Event Bus. In addition, 𝗥𝘅𝑓𝑥 also offers special bus listeners called **services** and **effects** which manage async function execution and state-tracking.

### Example - Event: Toggling Notation

For showing/hiding the labels of the squares, the `<Board>` component can pass `react-chessboard` a prop called `showBoardNotation`. Therefore, it owns a piece of state that it can pass down. The question is - since it is `<Controls>` that owns the toggle switch - how are the toggle events getting from `<Controls>` to the `<Board>`?

If using local state in React — a typical style — a state variable must exist in a parent level component. The setter is then passed to `<Controls>`, and the state variable as a prop to `<Board>`

```jsx
// App.tsx
function App() {
  const [showBoardNotation, setShowBoardNotation] = useState(true)

  return (
    <header>
      <Controls onNotationSet={setShowBoardNotation} />
    </header>
    <Board showBoardNotation={showBoardNotation}/>
  )
}
```

Imagine how the prop list, and clutter in the parent component grows, as the children add more variables! And testing becomes harder, and in practice it gets short-changed because of its difficulty. Is there a better way for `<Controls>` and `<Board>` to communicate, keeping `<App>` focused on its layout concern only?

In 𝗥𝘅𝑓𝑥 Event Bus style, `<Board>` subscribes to a `NOTATION_TOGGLE` event, which `<Controls>` places on a global instance of the event bus. The `boolean`-typed event creator function is imported by `<Controls>`, while `<Board>` imports the event, and listens for it.

```jsx
// events/controls.ts
export const NOTATION_TOGGLE = createEvent<boolean>()

// ui/components/Controls.tsx
   <ToggleSlider
      onToggle={(state) => defaultBus.trigger(NOTATION_TOGGLE(state))}
   />
```

```jsx
export function Board() {
  const [hideNotation, setHideNotation] = useState(false);

  useWhileMounted(() =>
    defaultBus.listen(NOTATION_TOGGLE, ({ payload: hide }) => {
      setHideNotation(hide);
    })
  );
```

This allows `<App>` to remain simple.

```jsx
// App.tsx
<header>
   <Controls />
</header>
<Board />

```

It also makes testing of `<Controls>` in isolation very straightforward - neither the parent `<App>` not `<Board>` are necessary - just assert that `<Controls>` puts the correct events on the event bus when toggled!

Could React Context do the same thing? Perhaps, but it's got its own drawbacks - the need for a `Provider` at the top level, and Context is a frequent cause of over-rendering which hurts performance.

Redux would bring a similar benefit, however, with `<Controls>` dispatching an action (event), and `<Board>` subscribing to it directly without `<App>` needing to help. The event bus architecture is isomporphic to Redux, and event bus events made via `createEvent` are suitable for passing direct to Redux, so a Redux store can be a listener to events.

Use Redux when the piece of state must be persisted — use events when it is mainly the effect you need.

### Example - Event: Toggling Piece visibility

The `react-chessboard` library does not have a prop to control piece visibility, so we can't use the same approach as for notation. Since pieces are rendered as SVG, and we can give the board an `id`, which appears in its `data-boardid` attribute, we can hide them with pure CSS.

```css
[data-boardid="chessboard"] svg {
  visibility: "hidden";
}
```

But how do we make that dynamic? One option would be to make its value based on a CSS variable, which we can set in JavaScript.

```css
#root {
  --piece-visibility: visible;
}

[data-boardid="chessboard"] svg {
  visibility: var(--piece-visibility);
}
```

The setting code is simply:

```js
document
  .querySelector("#root")
  .style.setProperty("--piece-visibility", "hidden");
```

This will work, but now we must consider where to execute this code. I suggest not doing it in the control itself. The job of the control should simply be to trigger the event. This allows us to decouple WHAT occurred (the visibility was toggled), from HOW it gets done, and keeps the `<Controls>` UI component simple and testable.

```jsx
// Controls.tsx
   <ToggleSlider
      onToggle={(state) => defaultBus.trigger(NOTATION_TOGGLE(state))}
   />
   <ToggleSlider
      onToggle={(state) => defaultBus.trigger(BLINDFOLD_TOGGLE(state))}
   />
```

Now, the listening could be done from anywhere, but since `<App>` is the highest level component, and the CSS variable lives at the root, we'll do it there:

```jsx
function App() {
  useWhileMounted(() =>
    defaultBus.listen(BLINDFOLD_TOGGLE, ({ payload: checked }) => {
      const visibility = checked ? "hidden" : "visible";

      document.querySelector("#root").style.setProperty(
        "--piece-visibility",
        visibility
      );
    })
  );
```

We have type-safety from the `BLINDFOLD_TOGGLE` event typing its payload as `boolean`. And we have runtime safety in that the listener will be shut down when the component unmounts, thanks to the `useWhileMounted` hook.

Now, we see how events decouple components, simplify communication, and provide type-safety without prop-drilling.

The advantage of this style of React is as advantageous as the invention of Promises. Think about how Promises allowed you to no longer pass callbacks in to functions. In React, since components are just functions, why not be able to handle their events from the outside without their knowing? This is like Angular output variable, or signals, and results in a less cluttered, and more testable view layer.

### Example - Effect: Speech Synthesis

When a user clicks on an incorrect square, speech synthesis speaks a message to them aloud. The question is - what happens if the user clicks a new square while being told they are wrong? Let's tweak this behavior, revealing the power of our Effect.

The motivation for using an 𝗥𝘅𝑓𝑥 Effect is that it gives you control over these aspects of effect execution, in a standard, encapsulated fashion.

- concrrency control (queueing, debouncing)
- activity detection (loading state)
- cancelation

An Effect can be any Promise or Observable-returning function - think not only of AJAX requests, but showing a modal, or in this app, speaking via the browser's Speech API.

Returning our attention to this app, the code to say a message is run on every square click.

```ts
// handleSquareClick.ts
const msg = isCorrect
  ? `${guess} is correct`
  : `${guess} is not correct`;
say(msg);
```

A barebones implementation of `say(text)` would call the browser's speech synthesis API directly.
```ts
export const say = (text: string) => {
  const spoken = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(spoken);
}
```

The issue is that upon 3 quick clicks the user may hear:
 
- _"a4 is not correct"_
- _"b4 is not correct"_
- _"c4 is not correct"_
- _"d4 is correct"_

We want to be able to not call `say` if we are already speaking, for the case of an incorrect answer. We also want to be able to "interrupt" an "incorrect" announcement when the user gets it right. This will use the activity detection and cancelation features of our 𝗥𝘅𝑓𝑥 Effect.

Once we wrap speech synthesis in an effect, we can use its `.isActive` property to selectively announce our messages.

Wrapping in an Effect is easy - we just need to turn the utterance into a Promise for when it's done, and return it from a function provided to `createEffect`. 

```ts
import { createEffect } from "@𝗥𝘅𝑓𝑥
/service";

const speechEffect = createEffect<string>((text) => {
  const spoken = new SpeechSynthesisUtterance(text);
  
  const done = new Promise((resolve) => {
    spoken.onend = resolve;
  });

  speechSynthesis.speak(spoken);
  return done;
});
```

To trigger the effect, the `say` function can simply make a request of it.

```ts
export const say = (text: string) => {
  return speechEffect.request(text)
};
```

#### Activity Detection
While we could detect activity with the global `SpeechSynthesis.speaking`, the `.isActive` property of the Effect provides a standard way for any effect function. This encapsulation keeps the caller of an effect from knowing details about how the effect is implemented.

With an Effect, we can test the speechEffect before calling `say` like this:

```ts
// handleSquareClick.ts
const msg = isCorrect
  ? `${guess} is correct`
  : `${guess} is not correct`;

if (!speechEffect.isActive.value || isCorrect) {
  // Announce incorrect only if not doing so already
  say(msg);
}
```

The `.isActive` property contains a `.value` property for a synchronous check, and a `.subscribe` method to receive updates. See the [`@rxfx/effect` documentation](https://github.com/deanrad/rxfx/tree/main/effect) for more.


#### Cancelation
Now let's add one final feature— if an incorrect guess is being announced, the announcement should be canceled if a correct guess is made! The speech API supports this via `SpeechSynthesis.cancel()`, and it's necessary to delay the next utterance for about 250ms before speaking again for it to work properly. But we'll hide these details in the Effect, so the calling code will simply look like this:


```ts
if (isCorrect) {
  // If announcing a wrong answer, stop first
  speechEffect.cancelCurrent(); 
  say(msg);
} else if (!speechEffect.isActive.value) {
  // Announce incorrect only if not doing so already
  say(msg);
}
```

The `.cancelCurrent` method of an Effect provides a standardized way for any effect - if an AJAX effect, it will be aborted, if showing a modal, the modal will be dismissed, and so on for any effect which you can write a cancelation function for.

To allow for cancelation, our speech effect needs its request handler changed in 3 ways: 
 - We must return an Observable.
 - That Observable should wait for an unnoticable delay before beginning speech (in case a cancelation just occurred).
 - We must return a cancelation function.

All together, it looks like this:

```ts
export const speechEffect = createQueueingEffect<string>(
  (text) => {
    return new Observable<void>((notify) => {
      const spoken = new SpeechSynthesisUtterance(text);
      spoken.rate = rate;

      spoken.onend = () => notify.complete();

      // If we just canceled, we need to wait before it'll speak again
      after(THRESHOLD.Debounce).then(() => speechSynthesis.speak(spoken));

      return () => {
        speechSynthesis.cancel();
      };
    });
  }
);
```

The high-level features of this Speech effect code are:
 - The Observable constructor is used, rather than the Promise constructor.- `notify.complete()` is used instead of `resolve()`. 
 - `after` is used to create a Promise for a delay, after which we speak.
 - `THRESHOLD.Debounce` is used to introduce a 330 ms delay commonly used for debouncing.
 - The cancelation function calls the browser API `speechSynthesis.cancel()`.

Together, this is what allows our calling code to invoke `speechEffect.cancelCurrent()` safely, and still preserves our `.isActive` detection. An 𝗥𝘅𝑓𝑥
 effect works just as well with an Observable as a Promise!

At last, the board will be able to cancel a wrong-answer announcement when the correct guess is made.

---

#### Summary 

This simple example shows the power of 𝗥𝘅𝑓𝑥 effects, in their level of abstraction, activity detection, and cancelation. As soon as you need these features, don't roll your own, use an Effect!

It's also worth mentioning that all 𝗥𝘅𝑓𝑥
 Effects respond to `.stop()`, as well as `.cancelCurrentAndQueued()`, and they will also stop upon a `bus.reset()`. This keeps your effects controllable from anywhere in your app.

<!--

### Example - Service: Position state
TODO

### Example - Effect: Move animation
TODO

-->