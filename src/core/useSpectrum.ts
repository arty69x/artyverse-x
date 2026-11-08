import { useEffect, useRef, useState } from "react";
import { useMotionValue } from "motion/react";
export type SpectrumMouth =
  "viseme_aa" | "viseme_E" | "viseme_FF" | "viseme_sil";
/** An energy-band illustration, not phoneme recognition or audio transcription. */
export function useSpectrum() {
  const [state, setState] = useState<
      "idle" | "permission" | "active" | "error"
    >("idle"),
    [error, setError] = useState(""),
    [viseme, setViseme] = useState<SpectrumMouth>("viseme_sil"),
    [sampleRate, setSampleRate] = useState(0),
    [amount, setAmount] = useState(0),
    level = useMotionValue(0),
    stream = useRef<MediaStream | null>(null),
    context = useRef<AudioContext | null>(null),
    source = useRef<MediaStreamAudioSourceNode | null>(null),
    analyser = useRef<AnalyserNode | null>(null),
    raf = useRef(0),
    generation = useRef(0),
    mounted = useRef(true);
  function release() {
    ++generation.current;
    cancelAnimationFrame(raf.current);
    for (const track of stream.current?.getTracks() || []) {
      track.onended = null;
      track.stop();
    }
    stream.current = null;
    source.current?.disconnect();
    analyser.current?.disconnect();
    source.current = null;
    analyser.current = null;
    void context.current?.close().catch(() => {});
    context.current = null;
    level.set(0);
  }
  function stop() {
    release();
    if (mounted.current) {
      setState("idle");
      setViseme("viseme_sil");
      setAmount(0);
    }
  }
  useEffect(() => {
    mounted.current = true;
    const hide = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      mounted.current = false;
      release();
      document.removeEventListener("visibilitychange", hide);
    };
  }, []);
  async function start() {
    if (state === "active" || state === "permission") return;
    if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
      setError(
        "เบราว์เซอร์นี้ไม่รองรับ microphone / Web Audio ใช้ text และ state preview แทนได้",
      );
      setState("error");
      return;
    }
    setError("");
    setState("permission");
    const ticket = ++generation.current;
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (
        !mounted.current ||
        ticket !== generation.current ||
        document.hidden
      ) {
        media.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = media;
      const ctx = new AudioContext();
      context.current = ctx;
      await ctx.resume();
      if (!mounted.current || ticket !== generation.current) return;
      source.current = ctx.createMediaStreamSource(media);
      const fft = ctx.createAnalyser();
      fft.fftSize = 256;
      fft.smoothingTimeConstant = 0.8;
      analyser.current = fft;
      source.current.connect(fft);
      media.getTracks().forEach((t) => (t.onended = () => stop()));
      setSampleRate(ctx.sampleRate);
      setState("active");
      const spectrum = new Uint8Array(fft.frequencyBinCount),
        wave = new Uint8Array(fft.fftSize);
      let last = 0,
        lastLabel = 0;
      function measure(now: number) {
        if (!mounted.current || ticket !== generation.current) return;
        if (now - last >= 80) {
          last = now;
          fft.getByteTimeDomainData(wave);
          fft.getByteFrequencyData(spectrum);
          const rms = Math.sqrt(
            wave.reduce((sum, n) => sum + ((n - 128) / 128) ** 2, 0) /
              wave.length,
          );
          level.set(Math.min(1, rms * 5));
          if (now - lastLabel > 250) {
            lastLabel = now;
            setAmount(Math.round(Math.min(1, rms * 5) * 100) / 100);
          }
          const band = (from: number, to: number) => {
            const lo = Math.max(
                1,
                Math.floor(from / (ctx.sampleRate / fft.fftSize)),
              ),
              hi = Math.min(
                spectrum.length - 1,
                Math.ceil(to / (ctx.sampleRate / fft.fftSize)),
              );
            let sum = 0;
            for (let i = lo; i <= hi; i++) sum += spectrum[i];
            return sum / Math.max(1, hi - lo + 1);
          };
          const low = band(60, 300),
            mid = band(300, 2000),
            high = band(2500, 8000);
          setViseme(
            rms < 0.015
              ? "viseme_sil"
              : high > mid && high > low
                ? "viseme_FF"
                : mid > low
                  ? "viseme_E"
                  : "viseme_aa",
          );
        }
        raf.current = requestAnimationFrame(measure);
      }
      raf.current = requestAnimationFrame(measure);
    } catch (e) {
      if (ticket !== generation.current) return;
      release();
      if (mounted.current) {
        setState("error");
        setError(String(e));
        setViseme("viseme_sil");
      }
    }
  }
  return { state, error, viseme, level, amount, sampleRate, start, stop };
}
