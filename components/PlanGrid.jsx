


window.PlanGrid = ({ employees, plan, onCellInteraction, dailyNeeds, onDemandChange, validations, ...props }) => {
    const planGridRef = useRef(null);
    
    const year = props.currentDate.getFullYear();
    const month = props.currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const autoPlanShifts = Object.keys(SHIFT_TYPES).filter(k => SHIFT_TYPES[k].autoPlan);

    const dailyCounts = useMemo(() => {
        const counts = {};
        for (const key in plan) {
            const lastDashIndex = key.lastIndexOf('-'); if (lastDashIndex === -1) continue;
            const day = key.substring(lastDashIndex + 1); const shift = plan[key].shift;
            if (shift && /^\d+$/.test(day)) {
                counts[day] = counts[day] || {};
                counts[day][shift] = (counts[day][shift] || 0) + 1;
            }
        }
        return counts;
    }, [plan]);

    return (
        <div className="plan-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Mitarbeiter</th>
                        {Array.from({ length: daysInMonth }, (_, i) => <th key={i} className={new Date(year,month,i+1).getDay()%6===0?"weekend":""}>{WEEKDAYS[new Date(year,month,i+1).getDay()]}<br />{i + 1}</th>)}
                        <th>Soll</th><th>Ist</th><th>&Delta;</th><th>U</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => {
                        const data = props.summaryData[emp.id] || {};
                        return (
                            <tr key={emp.id}>
                                <td><div className="employee-name">{emp.name}</div><div className="employee-info">{emp.percentage}%</div></td>
                                {Array.from({ length: daysInMonth }, (_, i) => {
                                    const day = i + 1;
                                    const planKey = `${emp.id}-${day}`;
                                    const shift = (plan[planKey] && plan[planKey].shift) || '';
                                    const validation = validations[planKey] || {};
                                    const isWeekend = new Date(year, month, day).getDay() % 6 === 0;
                                    const className = `plan-cell ${isWeekend ? "weekend" : ""} ${validation.type === 'error' ? 'validation-error' : ''} ${validation.type === 'warning' ? 'validation-warning' : ''}`;
                                    
                                    // Robuste Farb-Logik
                                    const shiftKey = shift || '';
                                    const shiftColor = (props.settings.shiftColors && props.settings.shiftColors[shiftKey]) || (SHIFT_TYPES[shiftKey] ? SHIFT_TYPES[shiftKey].color : 'var(--schicht-leer)');
                                    const textColor = (props.settings.shiftColors && props.settings.shiftColors[shiftKey]) ? getTextColor(props.settings.shiftColors[shiftKey]) : ((SHIFT_TYPES[shiftKey] ? SHIFT_TYPES[shiftKey].textColor : 'var(--schicht-leer-text)'));
                                    const style = { backgroundColor: shiftColor, color: textColor };

                                    return <td key={day} style={style} className={className} 
                                        data-tooltip={validation.message}
                                        onMouseDown={(e) => onCellInteraction('down', emp.id, day, e)}
                                        onMouseOver={(e) => onCellInteraction('over', emp.id, day, e)}
                                    >{shift || '-'}</td>;
                                })}
                                <td>{data.soll ? data.soll.toFixed(1) : '0.0'}</td>
                                <td>{data.ist ? data.ist.toFixed(1) : '0.0'}</td>
                                <td style={{color: Math.abs(data.delta)<0.1?'var(--color-success)':'var(--color-danger)'}}>{data.delta ? data.delta.toFixed(1) : '0.0'}</td>
                                <td>{data.u || 0}</td>
                            </tr>
                        );
                    })}
                    <tr className="demand-row" style={{height: '1rem'}}>{/* Spacing row */}</tr>
                    <tr className="demand-row">
                        <td>Besetzung (Ist)</td>
                        {Array.from({ length: daysInMonth }, (_, i) => { const day = i + 1; return <td key={day}>{autoPlanShifts.map(s => { const soll = (dailyNeeds[day] && dailyNeeds[day][s]) || 0; const ist = (dailyCounts[day] && dailyCounts[day][s]) || 0; let color='var(--color-success)'; if(ist < soll) color = 'var(--color-danger)'; else if (ist > soll) color = 'var(--color-warning)'; return <div key={s} style={{color: color}}>{s}: {ist}</div> })}</td>; })}
                        <td colSpan="4"></td>
                    </tr>
                    <tr className="demand-row">
                        <td>Bedarf (Soll)</td>
                        {Array.from({ length: daysInMonth }, (_, i) => (<td key={i}>{autoPlanShifts.map(s => <div key={s}>{s}: <input type="number" min="0" className="demand-input" value={(dailyNeeds[i+1] && dailyNeeds[i+1][s]) || 0} onChange={e => onDemandChange(i+1, s, e.target.value)} /></div>)}</td>))}
                        <td colSpan="4"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

try{ if (typeof PlanGrid !== "undefined") window.PlanGrid = PlanGrid; }catch(e){}
