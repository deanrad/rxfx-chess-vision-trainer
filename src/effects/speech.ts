import { createQueueingEffect } from "@rxfx/service";

const speechEffect = createQueueingEffect<[string, number]>(([text, rate]) => {
  const spoken = new SpeechSynthesisUtterance(text);
  spoken.rate = rate;
  const done = new Promise((resolve) => {
    spoken.onend = resolve;
  });
  speechSynthesis.speak(spoken);
  return done;
});

export const say = (text: string, rate = 0.9) => {
  return speechEffect.send([text, rate]);
};
