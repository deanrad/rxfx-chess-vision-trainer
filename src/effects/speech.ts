import { THRESHOLD } from "@rxfx/perception";
import { Observable, after, createQueueingEffect } from "@rxfx/service";

export const speechEffect = createQueueingEffect<[string, number]>(
  ([text, rate]) => {
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

export const say = (text: string, rate = 0.9) => {
  return speechEffect.send([text, rate]);
};
