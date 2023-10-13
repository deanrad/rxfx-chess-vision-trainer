import { createQueueingService, defaultBus as bus } from "@rxfx/service";

const speechEffect = createQueueingService<[string, number]>(
  "speech",
  bus,
  ([text, rate]) => {
    const spoken = new SpeechSynthesisUtterance(text);
    spoken.rate = rate;
    speechSynthesis.speak(spoken);
  }
);

export const say = (text, rate = 0.9) => {
  speechEffect.request([text, rate]);
};
