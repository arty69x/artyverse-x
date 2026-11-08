import { useEffect, useRef, useState } from "react";
import {
  Mic,
  Square,
  Plus,
  ArrowUpRight,
  Copy,
  Volume2,
  VolumeX,
  BookOpen,
  Check,
  Save,
  ChevronDown,
  MessageSquare,
  Link2,
  Play,
  RotateCcw,
} from "lucide-react";
import { useStore, useT, useDraft, download } from "../core/store";
import { Button, PageHead, Modal } from "../components/UI";
import {
  detectQuestion,
  matchEvidence,
  buildEvidenceOutline,
  copilotData,
  type TranscriptTurn,
} from "../../shared/interview";
import { Arcyca } from "./Mascot";
import type { Navigate } from "../App";
const formats = [
  "Full Answer",
  "Key Points",
  "Bullet",
  "STAR",
  "Short",
  "Custom",
];
export function Copilot({
  id,
  go,
  practice = false,
}: {
  id?: string;
  go: Navigate;
  practice?: boolean;
}) {
  const s = useStore(),
    t = useT(),
    initial = s.items.find(
      (i) => i.id === id && !i.deletedAt && i.kind === "session",
    ),
    [current, setCurrent] = useState(initial),
    key =
      "v3:" +
      (practice ? "practice" : "copilot") +
      ":" +
      (id || "new") +
      (initial ? ":r" + initial.revision : ""),
    [title, setTitle] = useDraft(
      key + ":title",
      initial?.title ||
        t(
          practice ? "My practice session" : "My interview session",
          practice ? "การฝึกสัมภาษณ์ของฉัน" : "บันทึกสัมภาษณ์ของฉัน",
        ),
    ),
    [turns, setTurns] = useDraft<TranscriptTurn[]>(
      key + ":turns",
      initial?.data.transcript || [],
      (v) =>
        Array.isArray(v) &&
        v.every((x) => typeof x?.text === "string" && typeof x.id === "string"),
    ),
    [input, setInput] = useDraft(key + ":input", ""),
    [speaker, setSpeaker] = useState<"interviewer" | "you">("interviewer"),
    [question, setQuestion] = useDraft(
      key + ":question",
      initial?.data.question || "",
    ),
    [answer, setAnswer] = useDraft(key + ":answer", initial?.data.answer || ""),
    [selected, setSelected] = useDraft<string[]>(
      key + ":evidence",
      initial?.data.evidenceIds || [],
    ),
    [format, setFormat] = useState("Full Answer"),
    [tone, setTone] = useState("Professional"),
    [listening, setListening] = useState(false),
    [status, setStatus] = useState("idle"),
    [error, setError] = useState(""),
    [interim, setInterim] = useState(""),
    [seconds, setSeconds] = useState(0),
    [speaking, setSpeaking] = useState(false),
    [sheet, setSheet] = useState(false),
    [review, setReview] = useState(false),
    [saved, setSaved] = useState(false),
    [notes, setNotes] = useDraft(key + ":notes", initial?.data.notes || "");
  const recognition = useRef<any>(null),
    stream = useRef<MediaStream | null>(null),
    audio = useRef<AudioContext | null>(null),
    frame = useRef(0),
    canvas = useRef<HTMLCanvasElement>(null),
    mounted = useRef(false),
    speakerRef = useRef(speaker),
    startAt = useRef(0),
    utterance = useRef<SpeechSynthesisUtterance | null>(null),
    starting = useRef(false);
  speakerRef.current = speaker;
  const evidence = s.scopedItems
      .filter(
        (i) =>
          i.kind === "note" && !i.deletedAt && i.data.noteType !== "question",
      )
      .map((i) => ({
        id: i.id,
        title: i.title,
        body: String(i.data.body || ""),
      })),
    detected = detectQuestion(question),
    matches = matchEvidence(question, evidence),
    chosen = evidence.filter((e) => selected.includes(e.id)),
    canSpeak = typeof window.speechSynthesis !== "undefined";
  function stop() {
    recognition.current?.stop();
    recognition.current = null;
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    cancelAnimationFrame(frame.current);
    if (audio.current) void audio.current.close().catch(() => {});
    audio.current = null;
    if (mounted.current) {
      setListening(false);
      setInterim("");
      setStatus("stopped");
    }
  }
  useEffect(() => {
    mounted.current = true;
    const hide = () => {
      if (document.hidden) {
        stop();
        window.speechSynthesis?.cancel();
        setSpeaking(false);
      }
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      mounted.current = false;
      document.removeEventListener("visibilitychange", hide);
      stop();
      window.speechSynthesis?.cancel();
    };
  }, []);
  useEffect(() => {
    if (!listening) return;
    const timer = setInterval(
      () =>
        setSeconds(Math.floor((performance.now() - startAt.current) / 1000)),
      250,
    );
    return () => clearInterval(timer);
  }, [listening]);
  async function listen() {
    if (starting.current || listening) return;
    const Engine =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!Engine) {
      setStatus("unsupported");
      setError(
        t(
          "Speech recognition is unavailable. Add transcript text manually.",
          "เบราว์เซอร์นี้ไม่รองรับการถอดเสียง ใช้ช่องข้อความเพิ่มบทสนทนาได้",
        ),
      );
      return;
    }
    starting.current = true;
    setError("");
    setStatus("permission");
    try {
      const tracks = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current || document.hidden) {
        tracks.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = tracks;
      const ctx = new AudioContext();
      audio.current = ctx;
      await ctx.resume();
      if (!mounted.current || document.hidden) {
        stop();
        return;
      }
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      ctx.createMediaStreamSource(tracks).connect(analyser);
      const values = new Uint8Array(128);
      function draw() {
        if (!audio.current || !canvas.current) return;
        const el = canvas.current,
          c = el.getContext("2d");
        if (c) {
          el.width = Math.max(1, Math.floor(el.getBoundingClientRect().width));
          el.height = 72;
          analyser.getByteTimeDomainData(values);
          c.clearRect(0, 0, el.width, 72);
          c.beginPath();
          values.forEach((v, i) => {
            const x = (i / 127) * el.width,
              y = 36 + (v / 128 - 1) * 32;
            i ? c.lineTo(x, y) : c.moveTo(x, y);
          });
          c.strokeStyle = getComputedStyle(
            document.documentElement,
          ).getPropertyValue("--focus");
          c.lineWidth = 2;
          c.stroke();
        }
        frame.current = requestAnimationFrame(draw);
      }
      const r = new Engine();
      recognition.current = r;
      r.lang = s.locale === "th" ? "th-TH" : "en-US";
      r.continuous = true;
      r.interimResults = true;
      r.onresult = (e: any) => {
        if (!mounted.current) return;
        let pending = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const text = e.results[i][0].transcript;
          if (e.results[i].isFinal) {
            setTurns((old) => [
              ...old,
              {
                id: crypto.randomUUID(),
                speaker: speakerRef.current,
                text,
                at: new Date().toISOString(),
              },
            ]);
            if (speakerRef.current === "interviewer") setQuestion(text);
          } else pending += text;
        }
        setInterim(pending);
      };
      r.onerror = (e: any) => {
        if (!mounted.current) return;
        setError(t("Recognition stopped: ", "การถอดเสียงหยุด: ") + e.error);
        stop();
      };
      r.onend = () => {
        if (mounted.current) stop();
      };
      r.onstart = () => {
        if (!mounted.current) {
          r.abort();
          return;
        }
        startAt.current = performance.now();
        setSeconds(0);
        setListening(true);
        setStatus("listening");
        draw();
      };
      r.start();
    } catch (e) {
      stop();
      setStatus("error");
      setError(String(e));
    } finally {
      starting.current = false;
    }
  }
  function addTurn() {
    if (!input.trim()) return;
    const text = input.trim();
    setTurns((old) => [
      ...old,
      { id: crypto.randomUUID(), speaker, text, at: new Date().toISOString() },
    ]);
    if (speaker === "interviewer") setQuestion(text);
    setInput("");
    setStatus("manual");
    setSaved(false);
  }
  function outline() {
    if (!question.trim()) return;
    setAnswer(
      buildEvidenceOutline(
        question,
        chosen.map((e) => ({ title: e.title, snippet: e.body.slice(0, 900) })),
        s.locale,
        format,
      ),
    );
    if (matchMedia("(max-width:767px)").matches) setSheet(true);
    setSaved(false);
    setStatus("structured");
  }
  async function saveSession() {
    try {
      const data = copilotData.parse({
        sessionType: practice ? "practice" : "copilot",
        transcript: turns,
        question,
        answer,
        evidenceIds: selected,
        notes,
      });
      const item = current
        ? await s.save({
            ...current,
            title: title.trim() || "Interview session",
            data,
          })
        : await s.create("session", title.trim() || "Interview session", data);
      setCurrent(item);
      setSaved(true);
      s.toast(t("Session saved locally", "บันทึกการสัมภาษณ์ในเครื่องแล้ว"));
      if (!id) go(practice ? "practice" : "copilot", item.id);
    } catch (e) {
      setError(String(e));
    }
  }
  function read() {
    if (!canSpeak || !answer.trim()) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(answer);
    u.lang = s.locale === "th" ? "th-TH" : "en-US";
    u.onend = u.onerror = () => {
      if (mounted.current) setSpeaking(false);
    };
    utterance.current = u;
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }
  async function saveQuestion() {
    try {
      await s.create("note", question.slice(0, 160) || "Interview question", {
        noteType: "question",
        body: answer,
        source: question,
        tags: detected.topics.join(", "),
        evidenceIds: selected,
      });
      s.toast(t("Saved to Question Bank", "บันทึกในคลังคำถามแล้ว"));
    } catch (e) {
      setError(String(e));
    }
  }
  if (id && !initial)
    return (
      <div className="empty">
        <h1>{t("Interview session not found", "ไม่พบการสัมภาษณ์นี้")}</h1>
        <Button onClick={() => go("library")}>
          {t("Open Library", "เปิดคลังงาน")}
        </Button>
      </div>
    );
  const answerPanel = (
    <>
      <div className="v3-copilot-answer-title">
        <div>
          <span className="eyebrow">// YOUR ANSWER WORKSPACE</span>
          <h2>{t("Find your words.", "เรียบเรียงคำตอบของคุณ")}</h2>
        </div>
        <span className="state-badge">
          {t("LOCAL OUTLINE", "โครงร่าง LOCAL")}
        </span>
      </div>
      <div className="v3-answer-options">
        <label>
          {t("Writing tone / prompt context", "น้ำเสียง / บริบทสำหรับ prompt")}
          <select value={tone} onChange={(e) => setTone(e.target.value)}>
            {["Professional", "Friendly", "Concise", "Executive"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <span className="v3-mini-note">
          {t(
            "Tone is sent when opening Agent Studio. Local outlines keep your evidence verbatim.",
            "น้ำเสียงใช้เมื่อส่งไป Agent Studio ส่วนโครงร่าง local คงข้อความหลักฐานเดิม",
          )}
        </span>
      </div>
      <div
        className="v3-answer-formats"
        role="group"
        aria-label={t("Answer structure", "รูปแบบคำตอบ")}
      >
        {formats.map((f) => (
          <button
            key={f}
            aria-pressed={format === f}
            onClick={() => setFormat(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <label className="v3-answer-editor">
        <span>
          {t(
            "Editable answer / your own words",
            "คำตอบที่แก้ไขได้ / คำพูดของคุณ",
          )}
        </span>
        <textarea
          aria-label={t("Editable interview answer", "ร่างคำตอบสัมภาษณ์")}
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setSaved(false);
          }}
          rows={13}
          placeholder={t(
            "Choose your evidence, then build a local outline or write your answer.",
            "เลือกหลักฐานแล้วสร้างโครงร่าง หรือเขียนคำตอบด้วยตัวเอง",
          )}
        />
      </label>
      <div className="v3-answer-actions">
        <Button
          disabled={!answer.trim()}
          onClick={() =>
            void navigator.clipboard
              .writeText(answer)
              .then(() => s.toast(t("Copied", "คัดลอกแล้ว")))
              .catch(() =>
                setError(
                  t("Clipboard unavailable", "ไม่สามารถใช้คลิปบอร์ดได้"),
                ),
              )
          }
        >
          <Copy size={16} />
          {t("Copy", "คัดลอก")}
        </Button>
        <Button disabled={!canSpeak || !answer.trim()} onClick={read}>
          {speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
          {speaking
            ? t("Stop reading", "หยุดอ่าน")
            : t("Read aloud", "อ่านออกเสียง")}
        </Button>
        <Button disabled={!question.trim()} onClick={() => void saveQuestion()}>
          <BookOpen size={16} />
          {t("Save question", "เก็บคำถาม")}
        </Button>
      </div>
      <p className="v3-mini-note">
        {t(
          "Local structure, not AI inference. Missing facts remain placeholders. Read aloud uses browser TTS; mascot movement is illustrative, not audio lip sync.",
          "เป็นโครงสร้าง local ไม่ใช่ผล AI ข้อมูลที่ขาดคงเป็น placeholder การอ่านใช้เสียงของเบราว์เซอร์ การเคลื่อนไหว mascot เป็นภาพประกอบ",
        )}
      </p>
    </>
  );
  return (
    <div className="page v3-copilot-page">
      <PageHead
        index={
          practice
            ? "PRACTICE / YOUR OWN EVIDENCE"
            : "LIVE CONVERSATION / EVIDENCE FIRST"
        }
        title={
          practice
            ? t("Practice with purpose", "ฝึกตอบอย่างมีเป้าหมาย")
            : t("Speak smarter", "สื่อสารอย่างมั่นใจ")
        }
        description={t(
          "Your questions. Your experience. A clearer answer.",
          "คำถามของคุณ ประสบการณ์จริงของคุณ และคำตอบที่ชัดเจนขึ้น",
        )}
        action={
          <Button variant="primary" onClick={() => void saveSession()}>
            <Save size={17} />
            {t("Save session", "บันทึก session")}
          </Button>
        }
      />
      <div className="v3-copilot-session">
        <label>
          {t("Session title", "ชื่อการสัมภาษณ์")}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={180}
          />
        </label>
        <span className="state-badge">
          {saved
            ? t("SAVED LOCALLY", "บันทึกแล้ว")
            : t("BROWSER DRAFT", "ร่างในเบราว์เซอร์")}
        </span>
        <Button
          onClick={() =>
            download(
              title + ".json",
              JSON.stringify(
                {
                  title,
                  transcript: turns,
                  question,
                  answer,
                  evidenceIds: selected,
                  notes,
                },
                null,
                2,
              ),
            )
          }
        >
          {t("Export session", "ส่งออก session")}
        </Button>
      </div>
      {error && (
        <p className="v2-error" role="alert">
          {error}
        </p>
      )}
      <div className="v3-interview-grid">
        <section className="v3-conversation-panel">
          <header>
            <div>
              <span className="eyebrow">01 / CONVERSATION</span>
              <h2>{t("Live conversation", "บทสนทนา")}</h2>
            </div>
            <span className="state-badge">
              {listening
                ? t("LISTENING", "กำลังฟัง")
                : t("MANUAL INPUT READY", "พร้อมรับข้อความ")}
            </span>
          </header>
          <div className="v3-wave-panel">
            <canvas ref={canvas} aria-hidden="true" />
            <span>
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:
              {String(seconds % 60).padStart(2, "0")}
            </span>
            <Arcyca
              state={listening ? "listening" : speaking ? "thinking" : "idle"}
            />
          </div>
          <div
            className="v3-transcript"
            role="log"
            aria-label={t("Interview transcript", "ข้อความบทสนทนา")}
          >
            {turns.length ? (
              turns.map((turn) => (
                <article key={turn.id} className={turn.speaker}>
                  <header>
                    <strong>
                      {turn.speaker === "you"
                        ? t("You", "คุณ")
                        : t("Interviewer", "ผู้สัมภาษณ์")}
                    </strong>
                    <time>
                      {new Date(turn.at).toLocaleTimeString(s.locale, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </header>
                  <p>{turn.text}</p>
                  {turn.speaker === "interviewer" && (
                    <button
                      className="v3-text-link"
                      onClick={() => setQuestion(turn.text)}
                    >
                      {t("Use as question", "ใช้เป็นคำถาม")}
                      <ArrowUpRight size={14} />
                    </button>
                  )}
                </article>
              ))
            ) : (
              <div className="v3-transcript-empty">
                <MessageSquare size={30} />
                <h3>
                  {t("Start with a real question.", "เริ่มด้วยคำถามจริง")}
                </h3>
                <p>
                  {t(
                    "Add a turn below, or start browser speech recognition when supported.",
                    "เพิ่มบทสนทนาด้านล่าง หรือเริ่มการถอดเสียงเมื่อเบราว์เซอร์รองรับ",
                  )}
                </p>
              </div>
            )}
            {interim && (
              <p className="v3-interim" role="status">
                {interim}
              </p>
            )}
          </div>
          <div className="v3-transcript-input">
            <label>
              {t("Speaker / manual label", "ผู้พูด / เลือกเอง")}
              <select
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value as any)}
              >
                <option value="interviewer">
                  {t("Interviewer", "ผู้สัมภาษณ์")}
                </option>
                <option value="you">{t("You", "คุณ")}</option>
              </select>
            </label>
            <label>
              {t("Add transcript text", "เพิ่มข้อความบทสนทนา")}
              <textarea
                aria-label={t("Transcript input", "ข้อความที่ต้องการเพิ่ม")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
                maxLength={16000}
              />
            </label>
            <div className="button-row">
              <Button
                variant="primary"
                disabled={!input.trim()}
                onClick={addTurn}
              >
                <Plus size={16} />
                {t("Add turn", "เพิ่มบทสนทนา")}
              </Button>
              <Button
                disabled={status === "permission"}
                onClick={() => (listening ? stop() : setReview(true))}
              >
                {listening ? <Square size={16} /> : <Mic size={16} />}
                {listening
                  ? t("Stop microphone", "หยุดไมโครโฟน")
                  : t("Start microphone", "เริ่มไมโครโฟน")}
              </Button>
            </div>
            <p className="v3-mini-note">
              {t(
                "Speech recognition may use your browser’s online service. Speaker labels are manual. Manual text always works.",
                "การถอดเสียงอาจใช้บริการออนไลน์ของเบราว์เซอร์ เลือกผู้พูดเอง และใช้ข้อความแทนได้เสมอ",
              )}
            </p>
          </div>
        </section>
        <section className="v3-evidence-panel">
          <span className="eyebrow">02 / QUESTION & CONTEXT</span>
          <h2>{t("Ground it in you.", "เชื่อมกับประสบการณ์จริง")}</h2>
          <label>
            {t("Current question", "คำถามปัจจุบัน")}
            <textarea
              aria-label={t(
                "Current interview question",
                "คำถามสัมภาษณ์ปัจจุบัน",
              )}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={16000}
              rows={4}
            />
          </label>
          <div className="v3-topic-tags">
            {detected.topics.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <p className="v3-mini-note">
            {t(
              "Topics use local keyword rules, not model confidence.",
              "จัดหมวดด้วยกฎคำสำคัญ local ไม่ใช่ค่าความมั่นใจของ AI",
            )}
          </p>
          <h3>{t("Your evidence bank", "หลักฐานของคุณ")}</h3>
          <p className="v3-mini-note">
            {t(
              "Select saved Research notes. Suggested matches use keyword overlap.",
              "เลือกโน้ต Research ที่บันทึกไว้ รายการแนะนำใช้คำที่ตรงกัน",
            )}
          </p>
          <div className="v3-evidence-list">
            {evidence.length ? (
              evidence.map((e) => (
                <label key={e.id}>
                  <input
                    type="checkbox"
                    checked={selected.includes(e.id)}
                    onChange={(v) =>
                      setSelected((old) =>
                        v.target.checked
                          ? [...old, e.id]
                          : old.filter((x) => x !== e.id),
                      )
                    }
                  />
                  <span>
                    <strong>{e.title}</strong>
                    <small>
                      {e.body.slice(0, 130) || t("Empty note", "โน้ตว่าง")}
                    </small>
                    {matches.some((m) => m.id === e.id) && (
                      <em>{t("Keyword match", "คำสำคัญตรงกัน")}</em>
                    )}
                  </span>
                </label>
              ))
            ) : (
              <div className="v3-evidence-empty">
                <BookOpen size={25} />
                <p>{t("No evidence saved yet.", "ยังไม่มีหลักฐานที่บันทึก")}</p>
                <a href="#/research">
                  {t("Add a Research note", "เพิ่มโน้ต Research")}
                  <ArrowUpRight size={15} />
                </a>
              </div>
            )}
          </div>
          <Button
            variant="primary"
            disabled={!question.trim()}
            onClick={outline}
          >
            <Link2 size={17} />
            {t("Build local outline", "สร้างโครงร่าง local")}
          </Button>
          <Button
            disabled={!question.trim()}
            onClick={() => {
              const prompt = `Tone: ${tone}\nQuestion: ${question}\nEvidence:\n${chosen.map((e, i) => `[${i + 1}] ${e.title}\n${e.body}`).join("\n\n")}\nUse only the supplied evidence; mark missing facts as [ใส่ข้อมูลจริง]. Include source references. Format: ${format}`;
              localStorage.setItem(
                "av-draft:v2:agent:prompt",
                JSON.stringify(prompt),
              );
              go("agents");
            }}
          >
            {t("Continue in Agent Studio", "ไปต่อใน Agent Studio")}
            <ArrowUpRight size={16} />
          </Button>
          {practice && (
            <label>
              {t(
                "Self-review / improvements",
                "ทบทวนด้วยตัวเอง / สิ่งที่อยากปรับ",
              )}
              <textarea
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
          )}
          <div className="v3-pipeline-mini">
            <span className="eyebrow">ACTUAL LOCAL FLOW</span>
            {[
              [
                t("Input captured", "รับข้อมูล"),
                turns.length > 0 || !!question.trim(),
              ],
              [t("Question selected", "เลือกคำถาม"), !!question.trim()],
              [t("Evidence selected", "เลือกหลักฐาน"), selected.length > 0],
              [t("Outline prepared", "เตรียมโครงร่าง"), !!answer.trim()],
            ].map(([label, done], i) => (
              <div key={i}>
                <i className={done ? "complete" : ""}>
                  {done ? <Check size={13} /> : i + 1}
                </i>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="v3-answer-panel">{answerPanel}</section>
      </div>
      <button className="v3-answer-dock" onClick={() => setSheet(true)}>
        <MessageSquare size={19} />
        {t("Open answer workspace", "เปิดพื้นที่คำตอบ")}
        <ChevronDown size={17} />
      </button>
      {sheet && (
        <Modal
          wide
          title={t("Your answer workspace", "พื้นที่คำตอบของคุณ")}
          onClose={() => setSheet(false)}
        >
          <div className="v3-answer-sheet">{answerPanel}</div>
        </Modal>
      )}
      {review && (
        <Modal
          title={t(
            "Start browser speech recognition?",
            "เริ่มการถอดเสียงของเบราว์เซอร์?",
          )}
          onClose={() => setReview(false)}
        >
          <p>
            {t(
              "This requests microphone access. Recognition may send audio to your browser’s speech service. Obtain permission from participants before recording. You can use manual text instead.",
              "ระบบจะขอใช้ไมโครโฟน การถอดเสียงอาจส่งเสียงไปยังบริการของเบราว์เซอร์ ควรแจ้งผู้ร่วมสนทนาก่อนเริ่ม คุณใช้ข้อความแทนได้",
            )}
          </p>
          <div className="modal-actions">
            <Button onClick={() => setReview(false)}>
              {t("Use text instead", "ใช้ข้อความแทน")}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setReview(false);
                void listen();
              }}
            >
              <Mic size={17} />
              {t("Start recognition", "เริ่มถอดเสียง")}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
