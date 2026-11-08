import { useState } from "react";
import { Download, ArrowUpRight } from "lucide-react";
import { designSystem } from "../../shared/design";
import { download, useDraft, useT } from "../core/store";
export function TypographyLab() {
  const t = useT(),
    [text, setText] = useDraft(
      "typography-specimen",
      "Where ideas come alive. / พื้นที่สำหรับทุกความคิด",
    ),
    [weight, setWeight] = useState("800"),
    [effect, setEffect] = useState("marker");
  return (
    <div className="type-lab">
      <div className="type-lab-head">
        <div>
          <span className="eyebrow">// TYPE IN FOCUS</span>
          <h3>
            <span className="type-thin" lang="en">
              Make it{" "}
            </span>
            <strong className="type-underline" lang="en">
              unmistakable.
            </strong>
          </h3>
          <p>
            {t(
              "Thin to bold. One deliberate detail.",
              "บางสลับหนา เน้นรายละเอียดอย่างตั้งใจ",
            )}
          </p>
        </div>
        <button
          className="button"
          onClick={() =>
            download(
              "ARTYVERSE-TYPOGRAPHY.json",
              JSON.stringify(
                { schemaVersion: 1, type: designSystem.type },
                null,
                2,
              ),
            )
          }
        >
          <Download size={16} />
          {t("Export type tokens", "ส่งออกค่าตัวอักษร")}
        </button>
      </div>
      <div className="type-lab-controls">
        <label>
          {t("Preview text", "ข้อความตัวอย่าง")}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
          />
        </label>
        <label>
          {t("Weight", "น้ำหนัก")}
          <select value={weight} onChange={(e) => setWeight(e.target.value)}>
            {Object.entries(designSystem.type.weights).map(([k, v]) => (
              <option key={k} value={v}>
                {k} · {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("Emphasis", "การเน้นคำ")}
          <select value={effect} onChange={(e) => setEffect(e.target.value)}>
            {[
              ["plain", "Plain / ปกติ"],
              ["underline", "Underline / เส้นใต้"],
              ["marker", "Color block / แถบสี"],
              ["outline", "Outline / เส้นกรอบ"],
              ["chromatic", "Chromatic / เหลือบสี"],
            ].map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div
        className="type-lab-stage"
        aria-label={t("Typography preview", "ตัวอย่างตัวอักษร")}
      >
        <span
          className={"type-effect type-" + effect}
          style={{ fontWeight: Number(weight) }}
        >
          {text || t("Your words here.", "ข้อความของคุณ")}
        </span>
        <small>
          DM Sans / IBM Plex Sans Thai · {weight} · {effect}
        </small>
      </div>
      <div className="type-weight-strip">
        {[
          ["200", "Thin"],
          ["400", "Regular"],
          ["800", "Bold"],
        ].map(([v, l]) => (
          <div key={v}>
            <span style={{ fontWeight: Number(v) }} lang="en">
              Aa
            </span>
            <small>
              {v} / {l}
            </small>
          </div>
        ))}
      </div>
      <div className="type-focus-demo">
        <p>
          {t(
            "Keyboard focus: Tab to the link and field.",
            "ทดลอง focus: กด Tab ไปยังลิงก์และช่องข้อความ",
          )}
        </p>
        <a href="#/builder" className="type-focus-link">
          {t("Open Website Studio", "เปิด Website Studio")}
          <ArrowUpRight size={16} />
        </a>
        <label>
          {t("Focus field", "ช่องทดลอง focus")}
          <input placeholder={t("Type something…", "ลองพิมพ์…")} />
        </label>
      </div>
      <div
        className="type-contract-table"
        role="region"
        aria-label={t("Typography values", "ค่าตัวอักษร")}
        tabIndex={0}
      >
        <table>
          <thead>
            <tr>
              {[
                "Role",
                "Size / line",
                "Weight",
                "Tracking",
                "Family",
                "Fluid CSS",
              ].map((v) => (
                <th key={v} scope="col">
                  {v}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {designSystem.type.scale.map((v) => (
              <tr key={v.role}>
                <th scope="row">{v.role}</th>
                <td>
                  {v.size} / {v.line}px
                </td>
                <td>{v.weight}</td>
                <td>
                  {v.tracking}
                  em
                </td>
                <td>
                  {v.family === "display"
                    ? "Syne"
                    : v.family === "mono"
                      ? "JetBrains Mono"
                      : "DM Sans"}{" "}
                  / Thai fallback
                </td>
                <td>{v.fluid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dl className="type-emphasis-values">
        {Object.entries(designSystem.type.emphasis).map(([key, value]) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>
              {value}
              {key.startsWith("focus") ? "px" : "em"}
            </dd>
          </div>
        ))}
      </dl>
      <p className="v3-mini-note">
        {t(
          "Reference-derived hierarchy; responsive sizes are proposed adaptations. Thai tracking stays at 0; thin weights are for display, body copy stays regular. Underlines skip ink and sit below the glyphs.",
          "ลำดับตัวอักษรอ้างอิงจากบอร์ด ขนาด responsive เป็นค่าปรับใช้ ภาษาไทยไม่บีบระยะตัวอักษร น้ำหนักบางใช้เฉพาะ display ส่วนเนื้อหาใช้ regular เส้นใต้วางต่ำและเว้นส่วนตัวอักษร",
        )}
      </p>
    </div>
  );
}
