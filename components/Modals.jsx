window.Modals = ({ modal, setModal, ...props }) => {
    if (!modal.name) return null;

    const EmployeeOverview = () => (
        <div className="modal show">
            <div className="modal-content">
                <div className="modal-header"><h2>Mitarbeiterübersicht</h2><button className="close-btn" onClick={() => setModal({name: null})}>&times;</button></div>
                <button className="btn btn-primary" style={{ marginBottom: '1rem' }} onClick={() => setModal({ name: 'employeeEdit', data: null })}>Neuen Mitarbeiter anlegen</button>
                <table>
                    <thead><tr><th>Name</th><th>Vertrag</th><th>Soll/Woche</th><th>Max/Woche</th><th>Aktion</th></tr></thead>
                    <tbody>
                        {props.employees.map(emp => (
                            <tr key={emp.id}>
                                <td>{emp.name}</td><td>{emp.percentage}%</td><td>{emp.sollWochenstunden}h</td><td>{emp.maxWochenstunden}h</td>
                                <td><button className="btn" onClick={() => setModal({ name: 'employeeEdit', data: emp })}>✏️</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
    const EmployeeEdit = () => {
        const [employee, setEmployee] = useState(modal.data || { name: '', percentage: 100, sollWochenstunden: 39, maxWochenstunden: 48 });
        const handleChange = e => setEmployee(prev => ({ ...prev, [e.target.name]: e.target.value }));
        const handleSubmit = e => { e.preventDefault(); props.onSaveEmployee(employee); };
        return (
            <div className="modal show">
                <div className="modal-content" style={{maxWidth: '500px'}}>
                    <div className="modal-header"><h2>{modal.data ? 'Mitarbeiter bearbeiten' : 'Neuer Mitarbeiter'}</h2><button className="close-btn" onClick={() => setModal({name: null})}>&times;</button></div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group"><label>Name</label><input type="text" name="name" value={employee.name || ''} onChange={handleChange} required /></div>
                        <div className="two-columns">
                            <div className="form-group"><label>Vertrag (%)</label><input type="number" name="percentage" value={employee.percentage || ''} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Monats-Soll (auto)</label><input type="text" value={`~${calculateSollStunden(employee.percentage || 0, new Date().getFullYear(), new Date().getMonth()).toFixed(1)}h`} disabled /></div>
                        </div>
                        <div className="two-columns">
                            <div className="form-group"><label>Soll-Stunden / Woche</label><input type="number" name="sollWochenstunden" value={employee.sollWochenstunden || ''} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Max-Stunden / Woche</label><input type="number" name="maxWochenstunden" value={employee.maxWochenstunden || ''} onChange={handleChange} required /></div>
                        </div>
                        <button type="submit" className="btn btn-primary">Speichern</button>
                        {employee.id && <button type="button" className="btn btn-danger" style={{ float: 'right' }} onClick={() => props.onDeleteEmployee(employee.id)}>Löschen</button>}
                    </form>
                </div>
            </div>
        );
    };

    const Settings = () => {
        const [localSettings, setLocalSettings] = useState(props.settings);
        const handleSettingChange = (key, value) => setLocalSettings(s => ({...s, [key]: value}));
        const handleHoursChange = (shift, hours) => {
             setLocalSettings(s => ({
                ...s,
                shiftHours: {
                    ...(s.shiftHours || {}), // Robustheit
                    [shift]: parseFloat(hours) || 0
                }
            }));
        };
        const handleMasterDemandChange = (shift, value) => {
            setLocalSettings(s => ({
                ...s,
                masterDemand: {
                    ...(s.masterDemand || {}), // Robustheit
                    [shift]: parseInt(value, 10) || 0
                }
            }));
        };
         const handleColorChange = (shift, color) => {
             setLocalSettings(s => ({
                ...s,
                shiftColors: {
                    ...(s.shiftColors || {}), // Robustheit
                    [shift]: color
                }
            }));
        };
        const handleSave = () => { props.onSettingsSave(localSettings); setModal({name: null}); };
        const autoPlanShifts = Object.keys(SHIFT_TYPES).filter(k => SHIFT_TYPES[k].autoPlan);
        return (
             <div className="modal show">
                <div className="modal-content">
                    <div className="modal-header"><h2>Einstellungen</h2><button className="close-btn" onClick={() => setModal({name:null})}>&times;</button></div>
                    <div className="form-group"><label>Design</label><select value={localSettings.theme} onChange={e => handleSettingChange('theme', e.target.value)}><option value="light">Hell</option><option value="dark">Dunkel</option></select></div>
                    <hr/>
                    <h3>Stammbedarf</h3>
                    <p>Legen Sie hier den Standard-Personalbedarf für den Monat fest.</p>
                    <div className="four-columns">
                        {autoPlanShifts.map(s => (
                            <div className="form-group" key={s}>
                                <label>{s}</label>
                                <input type="number" min="0" value={(localSettings.masterDemand && localSettings.masterDemand[s]) || 0} onChange={e => handleMasterDemandChange(s, e.target.value)} />
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-secondary" onClick={() => { props.onApplyMasterDemand(localSettings.masterDemand); setModal({name: null}); }}>Auf Monat anwenden</button>
                    <hr/>
                    <h3>Schichtstunden</h3>
                    <div className="four-columns">
                        {Object.entries(SHIFT_TYPES).filter(([k,v])=>k!=='').map(([key, value]) => (
                            <div className="form-group" key={key}>
                                <label>{value.name} ({key})</label>
                                <input type="number" step="0.5" value={localSettings.shiftHours[key] !== undefined ? localSettings.shiftHours[key] : value.hours} onChange={e => handleHoursChange(key, e.target.value)} />
                            </div>
                        ))}
                    </div>
                    <hr/>
                    <h3>Schichtfarben</h3>
                    <div className="four-columns">
                        {Object.entries(SHIFT_TYPES).filter(([k,v])=>k!=='').map(([key, value]) => (
                            <div className="form-group" key={key} style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <input type="color" value={(localSettings.shiftColors && localSettings.shiftColors[key]) || value.color} onChange={e => handleColorChange(key, e.target.value)} style={{width: '40px', height: '40px', padding: '0', border: 'none', cursor: 'pointer'}} />
                                <label>{value.name} ({key})</label>
                            </div>
                        ))}
                    </div>
                    <hr/>
                    <button onClick={handleSave} className="btn btn-primary" style={{marginTop: '1rem'}}>Einstellungen speichern</button>
                </div>
            </div>
        );
    };
    
    if (modal.name === 'employeeOverview') return <EmployeeOverview />;
    if (modal.name === 'employeeEdit') return <EmployeeEdit />;
    if (modal.name === 'settings') return <Settings />;
    return null;
};

try{ if (typeof Modals !== "undefined") window.Modals = Modals; }catch(_e){}
