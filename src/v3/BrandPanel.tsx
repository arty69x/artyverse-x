import { PrismMark } from "./Brand";
import { useT } from "../core/store";
export function BrandPanel() {
  const t = useT();
  return (
    <section
      className="recon-brand-board"
      aria-label={t("Brand identity", "อัตลักษณ์แบรนด์")}
    >
      <div className="recon-brand-primary">
        <span className="eyebrow">01 / PRIMARY LOGO</span>
        <div className="recon-brand-lockup">
          <PrismMark />
          <strong>
            ARTYVERSE<b>X</b>
            <small>VISUAL ENGINEERING STUDIO</small>
          </strong>
        </div>
        <p>
          {t(
            "Artist × Multiverse. Creative power, disciplined clarity.",
            "Artist × Multiverse — พลังสร้างสรรค์ที่ชัดเจนและมีระบบ",
          )}
        </p>
      </div>
      <div className="recon-brand-marks">
        <span className="eyebrow">02 / MONOGRAM & APP MARK</span>
        <div>
          {["dark", "lime", "white"].map((v) => (
            <span className={"recon-appmark " + v} key={v}>
              <PrismMark />
            </span>
          ))}
        </div>
        <p>
          {t(
            "Extract. Compose. Ship.",
            "ถอดแนวคิด ผสานความคิด สร้างให้เกิดขึ้นจริง",
          )}
        </p>
      </div>
    </section>
  );
}
