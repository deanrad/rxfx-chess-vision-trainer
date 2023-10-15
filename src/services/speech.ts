import { createQueueingService, defaultBus as bus } from "@rxfx/service";

const speechEffect = createQueueingService<[string, number]>(
  "speech",
  bus,
  ([text, rate]) => {
    const spoken = new SpeechSynthesisUtterance(text);
    spoken.rate = rate;
    const done = new Promise((resolve) => {
      spoken.onend = resolve;
    });
    speechSynthesis.speak(spoken);
    return done;
  }
);

export const say = (text, rate = 0.9) => {
  return speechEffect.send([text, rate]);
};
