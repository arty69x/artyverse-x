import type { Composition } from "../../shared/v2/contracts";
export const midiHz = (note: number) => 440 * 2 ** ((note - 69) / 12);
export function scheduleTone(
  context: BaseAudioContext,
  target: AudioNode,
  note: number,
  time: number,
  stepDuration: number,
  config: Composition,
) {
  const oscillator = context.createOscillator(),
    envelope = context.createGain();
  oscillator.type = config.wave;
  oscillator.frequency.value = midiHz(note);
  envelope.gain.setValueAtTime(0, time);
  envelope.gain.linearRampToValueAtTime(1, time + config.attack);
  envelope.gain.setTargetAtTime(0.38, time + config.attack, 0.03);
  const end = time + Math.max(stepDuration * 0.7, config.attack + 0.01);
  envelope.gain.setValueAtTime(0.38, end);
  envelope.gain.linearRampToValueAtTime(0, end + config.release);
  oscillator.connect(envelope);
  envelope.connect(target);
  oscillator.start(time);
  oscillator.stop(end + config.release + 0.02);
  oscillator.onended = () => {
    oscillator.disconnect();
    envelope.disconnect();
  };
  return oscillator;
}
export function encodeWav(buffer: AudioBuffer): Blob {
  const frames = buffer.length,
    channels = buffer.numberOfChannels,
    bytes = frames * channels * 2,
    data = new ArrayBuffer(44 + bytes),
    view = new DataView(data);
  const text = (at: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(at + i, s.charCodeAt(i));
  };
  text(0, "RIFF");
  view.setUint32(4, 36 + bytes, true);
  text(8, "WAVE");
  text(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * channels * 2, true);
  view.setUint16(32, channels * 2, true);
  view.setUint16(34, 16, true);
  text(36, "data");
  view.setUint32(40, bytes, true);
  const arrays = Array.from({ length: channels }, (_, i) =>
    buffer.getChannelData(i),
  );
  let offset = 44;
  for (let i = 0; i < frames; i++)
    for (let c = 0; c < channels; c++) {
      const sample = Math.max(-1, Math.min(1, arrays[c][i]));
      view.setInt16(offset, sample < 0 ? sample * 32768 : sample * 32767, true);
      offset += 2;
    }
  return new Blob([data], { type: "audio/wav" });
}
export async function renderComposition(config: Composition) {
  if (typeof OfflineAudioContext === "undefined")
    throw Error("Offline audio rendering is not supported in this browser");
  const step = 60 / config.tempo / 4,
    duration = step * 16 + config.attack + config.release + 0.1,
    sampleRate = 44100,
    ctx = new OfflineAudioContext(
      1,
      Math.ceil(duration * sampleRate),
      sampleRate,
    ),
    filter = ctx.createBiquadFilter(),
    gain = ctx.createGain();
  filter.type = "lowpass";
  filter.frequency.value = config.cutoff;
  gain.gain.value = config.volume;
  filter.connect(gain);
  gain.connect(ctx.destination);
  config.steps.forEach((n, i) => {
    if (n >= 0) scheduleTone(ctx, filter, n, i * step, step, config);
  });
  const buffer = await ctx.startRendering();
  return { blob: encodeWav(buffer), duration, buffer };
}
