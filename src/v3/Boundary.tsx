import { Component, type ReactNode } from "react";
export class WorkspaceBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <section className="v3-system-error" role="alert">
        <h1>เปิดพื้นที่ทำงานนี้ไม่สำเร็จ / Workspace interrupted</h1>
        <p>
          งานที่บันทึกยังอยู่ครบ ลองโหลดหน้าใหม่
          หรือกลับไปคลังงานเพื่อตรวจรายการ / Saved records are retained. Reload
          or return to Library.
        </p>
        <div className="button-row">
          <button className="button primary" onClick={() => location.reload()}>
            โหลดใหม่ / Reload
          </button>
          <a className="button" href="#/library">
            คลังงาน / Library
          </a>
        </div>
      </section>
    ) : (
      this.props.children
    );
  }
}
