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

- `handlers` - (JS) Event handlers can live here, if they do not close over any state of a React component.

- `services` - (RxFx) Bus listeners like `positionService` - which tracks the piece's position and options - lives here

- `effects` - (RxFx) The `speechEffect` that handles speech synthesis, and the `moveEffect` which animates the correct move, live here.


## Why an Event Bus?
React components, and code modules in general, can be decoupled, and prop-drilling minimized or eliminated, when they share events over the Event Bus.

### Example - Toggling Notation

For showing/hiding the labels of the squares, the `<Board>` component can pass `react-chessboard` a prop called `showBoardNotation`. Therefore, it owns a piece of state that it can pass down. The question is - since it is `<Controls>` that owns the toggle switch - how are the toggle events getting from `<Controls>` to the `<Board>`?

In RxFx Event Bus style, `<Board>` subscribes to the `NOTATION_TOGGLE` event. That event is imported, and triggered by `<Controls>`, meanwhile `<Board>` imports the event, and listens for it, remaining unaware of where the event comes from. 

This makes testing of `Board` in isolation very straightforward - neither the parent `<App>` not `<Controls>` are necessary! Also, the markup can remain simple, with the parent not needing to pass functions or own state.

```jsx
// App.tsx
<header>
   <Controls />
</header>
<Board />

```

Aside from the lack of prop-drilling, React Context is also not needed. Both of these are common causes of excessive re-rendering, so app performance can be higher. (Similar benefits can be found with Signals as well).

### Example - Toggling Piece visibility

The `react-chessboard` library does not have a prop to control piece visibility, so we can't use the same approach as for notation. Since pieces are rendered as SVG, and we can give the board an `id`, which appears in its `data-boardid` attribute, we can hide them with pure CSS.

```css
[data-boardid="chessboard"] svg {
  visibility: 'hidden';
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
document.querySelector("#root")
  .style
  .setProperty("--piece-visibility", "hidden")
```

This will work, but now we must consider where to execute this code. I suggest not doing it in the control itself. Like the code that toggles notation, the job of the control should simply be to trigger the event. This allows us to decouple WHAT occurred (the visibility was toggled), from HOW it gets done, and keeps the `<Controls>` UI component simple and testable.

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

