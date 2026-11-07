import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Save, Trash2, ArrowUpRight } from "lucide-react";
import { useStore, useT, upload } from "../core/store";
import { Button, PageHead } from "../components/UI";
export function Voice() {
  const s = useStore(),
    t = useT(),
    [state, setState] = useState("idle"),
    [error, setError] = useState(""),
    [seconds, setSeconds] = useState(0),
    [level, setLevel] = useState(0),
    [url, setUrl] = useState(""),
    [title, setTitle] = useState("Voice note"),
    [blob, setBlob] = useState<Blob | null>(null);
  const recorder = useRef<MediaRecorder | null>(null),
    stream = useRef<MediaStream | null>(null),
    context = useRef<AudioContext | null>(null),
    raf = useRef(0),
    timer = useRef<ReturnType<typeof setInterval> | null>(null),
    urlRef = useRef(""),
    mounted = useRef(true);
  function cleanup() {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    void context.current?.close().catch(() => {});
    context.current = null;
    cancelAnimationFrame(raf.current);
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (recorder.current?.state === "recording") recorder.current.stop();
      cleanup();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);
  async function start() {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError(
        "Audio recording is not supported in this browser. Use Conversations for text notes.",
      );
      return;
    }
    setState("permission");
    setError("");
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current) {
        media.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = media;
      const type = ["audio/webm", "audio/mp4", "audio/ogg"].find((t) =>
        MediaRecorder.isTypeSupported(t),
      );
      const rec = new MediaRecorder(
        media,
        type ? { mimeType: type } : undefined,
      );
      recorder.current = rec;
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      rec.onstop = () => {
        const b = new Blob(chunks, { type: rec.mimeType });
        cleanup();
        if (!mounted.current) return;
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        const u = URL.createObjectURL(b);
        urlRef.current = u;
        setUrl(u);
        setBlob(b);
        setState("playback");
        setLevel(0);
      };
      rec.onerror = () => {
        cleanup();
        if (mounted.current) {
          setError("Recording interrupted. Try again.");
          setState("error");
        }
      };
      const audio = new AudioContext();
      context.current = audio;
      const analyser = audio.createAnalyser();
      analyser.fftSize = 256;
      audio.createMediaStreamSource(media).connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      const measure = () => {
        if (!mounted.current) return;
        analyser.getByteTimeDomainData(samples);
        const rms = Math.sqrt(
          samples.reduce((sum, x) => sum + ((x - 128) / 128) ** 2, 0) /
            samples.length,
        );
        setLevel(Math.min(1, rms * 4));
        raf.current = requestAnimationFrame(measure);
      };
      measure();
      const began = Date.now();
      setSeconds(0);
      timer.current = setInterval(
        () => setSeconds((Date.now() - began) / 1000),
        200,
      );
      rec.start(250);
      setState("recording");
    } catch (e) {
      cleanup();
      setState("error");
      setError(
        e instanceof DOMException && e.name === "NotAllowedError"
          ? "Microphone permission denied. Check browser permissions or use text notes."
          : String(e),
      );
    }
  }
  function stop() {
    if (recorder.current?.state === "recording") recorder.current.stop();
  }
  async function save() {
    if (!blob) return;
    setState("saving");
    try {
      const a = await upload(blob, title);
      await s.create("recording", title.trim() || "Voice note", {
        url: a.url,
        assetId: a.id,
        duration: seconds,
        mime: a.mime,
        size: a.size,
      });
      setState("playback");
      s.toast("Recording saved to Library");
    } catch (e) {
      setError(String(e));
      setState("playback");
    }
  }
  function discard() {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = "";
    setUrl("");
    setBlob(null);
    setSeconds(0);
    setState("idle");
  }
  return (
    <div className="page">
      <PageHead
        index="CAPTURE THE MOMENT"
        title={t("Good ideas sound like you", "เสียงของคุณ ไอเดียของคุณ")}
        description={t(
          "A real microphone. A quiet space. Keep what matters.",
          "บันทึกเสียงจริง ฟังย้อนหลัง และเก็บช่วงเวลาที่สำคัญ",
        )}
      />
      <section
        className={
          "voice-studio " + (state === "recording" ? "is-recording" : "")
        }
      >
        <span className="eyebrow">
          {state === "recording"
            ? "● RECORDING LIVE AUDIO"
            : state === "permission"
              ? "WAITING FOR MICROPHONE PERMISSION"
              : "YOUR VOICE / YOUR SPACE"}
        </span>
        <div
          className="voice-orb"
          style={{ "--level": level } as React.CSSProperties}
        >
          <Mic size={48} />
          <div className="voice-ring" />
          <div className="voice-ring second" />
        </div>
        <div className="voice-timer">
          {Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0")}
          :
          {Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0")}
        </div>
        <div
          className="input-meter"
          role="meter"
          aria-label="Microphone input level"
          aria-valuenow={Math.round(level * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div style={{ width: level * 100 + "%" }} />
        </div>
        <p>
          {state === "recording"
            ? t(
                "Listening to your microphone. Stop whenever you’re ready.",
                "กำลังบันทึกจากไมโครโฟน กดหยุดเมื่อพร้อม",
              )
            : t(
                "Microphone access starts only when you choose to record.",
                "ไมโครโฟนจะเริ่มเมื่อคุณกดบันทึกเท่านั้น",
              )}
        </p>
        <div className="button-row">
          {state === "recording" ? (
            <Button variant="danger" onClick={stop}>
              <Square size={16} />
              Stop recording
            </Button>
          ) : (
            <Button
              variant="primary"
              disabled={state === "permission" || state === "saving"}
              onClick={() => void start()}
            >
              <Mic size={16} />
              {blob ? "Record again" : "Start recording"}
            </Button>
          )}
        </div>
        {url && (
          <div className="recording-playback">
            <label>
              Recording title
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <audio controls src={url} />
            <div className="button-row">
              <Button
                variant="primary"
                disabled={state === "saving"}
                onClick={() => void save()}
              >
                <Save size={16} />
                {state === "saving" ? "Saving…" : "Save to Library"}
              </Button>
              <Button onClick={discard}>
                <Trash2 size={16} />
                Discard
              </Button>
            </div>
          </div>
        )}
        {error && (
          <p role="alert" className="error-text">
            {error}
          </p>
        )}
        <div className="integration-note">
          Transcription is unavailable until a speech engine is connected. No
          transcript is generated from your recording.
        </div>
        <a className="text-button" href="#/chat">
          Prefer text? Open Conversations <ArrowUpRight size={15} />
        </a>
      </section>
    </div>
  );
}
