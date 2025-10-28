function Header({
  currentDate,
  onMonthChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onOpenModal,
  onSettingChange,
  settings,
  onAutoPlan,
  onClearPlan,
  onImport,
  onExport,
  onBackup,
  onExportPDF,
  onSyncUpload,
  onSyncDownload
}) {
  return (
    <header>
      <h1>🧭 Dienstplan Pro (React)</h1>

      <div className="navigation">
        <button className="btn" onClick={() => onMonthChange(-1)}>◄</button>

        <div className="month-year-display">
          {currentDate
            ? `${currentDate.toLocaleString("de-DE", {
                month: "long",
              })} ${currentDate.getFullYear()}`
            : "Lädt..."}
        </div>

        <button className="btn" onClick={() => onMonthChange(1)}>►</button>
      </div>

      <div className="controls">
        <button className="btn" onClick={onUndo} disabled={!canUndo}>↩️</button>
        <button className="btn" onClick={onRedo} disabled={!canRedo}>↪️</button>
        <button
          className="btn btn-primary"
          onClick={() => onOpenModal("employeeOverview")}
        >
          👥 Mitarbeiter
        </button>
      </div>

      <div className="tools no-print">
        <select
          className="btn"
          value={settings.planungsmodell}
          onChange={(e) => onSettingChange("planungsmodell", e.target.value)}
        >
          <option value="standard">Modell: Standard</option>
          <option value="erkrath">Modell: Erkrath</option>
        </select>

        <button className="btn" onClick={onAutoPlan}>✨ Auto-Plan</button>
        <button className="btn btn-danger" onClick={onClearPlan}>🗑️ Alles löschen</button>
        <button className="btn" onClick={onImport}>📥 Import</button>
        <button className="btn" onClick={onExport}>📤 Export</button>
        <button className="btn" onClick={onBackup}>💾 Backup</button>
        <button className="btn" onClick={onExportPDF}>📄 PDF Export</button>
        <button className="btn" onClick={() => onOpenModal("settings")}>⚙️</button>
        <div className="toolbar">
        <button onClick={() => onSyncUpload("default")}>Hochladen</button>
        <button onClick={() => onSyncDownload("default")}>Vom Server laden</button>


</div>

      </div>
    </header>
  );
}

try{ if (typeof Header !== "undefined") window.Header = Header; }catch(_e){}
