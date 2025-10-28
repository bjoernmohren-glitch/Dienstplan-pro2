window.PlanGrid = ({ employees, plan, summaryData, stats, currentDate }) => {
  const y=currentDate.getFullYear(), m=currentDate.getMonth();
  const daysInMonth=new Date(y,m+1,0).getDate();
  const minToH=(m)=>m?(m/60).toFixed(1):"0.0";
  const deltaClass=(i,s)=>i-s>60?"over":i-s<-60?"under":"ok";

  return (<div className="plan-wrapper"><table><thead><tr>
    <th>Mitarbeiter</th>{Array.from({length:daysInMonth},(_,i)=><th key={i}>{WEEKDAYS[new Date(y,m,i+1).getDay()]}<br/>{i+1}</th>)}
    <th>Monat Soll</th><th>Monat Ist</th><th>Δ</th><th>Jahr Soll</th><th>Jahr Ist</th>
  </tr></thead><tbody>
  {employees.map(e=>{const d=summaryData[e.id]||{},s=stats[e.id]||{};
    return(<tr key={e.id}><td>{e.name}</td>
      {Array.from({length:daysInMonth},(_,i)=>{const k=`${e.id}-${i+1}`;const sh=plan[k]?.shift||"";const bg=SHIFT_TYPES[sh]?.color||"#fff";const tc=getTextColor(bg);return(<td key={i} style={{background:bg,color:tc}}>{sh||"-"}</td>);})}
      <td>{d.soll?.toFixed(1)||"0.0"}</td><td>{d.ist?.toFixed(1)||"0.0"}</td><td>{d.delta?.toFixed(1)||"0.0"}</td>
      <td className={`sum ${deltaClass(s.istYearMin,s.sollYearMin)}`}>{minToH(s.sollYearMin)}</td>
      <td className={`sum ${deltaClass(s.istYearMin,s.sollYearMin)}`}>{minToH(s.istYearMin)}</td></tr>);
  })}
  </tbody></table></div>);
};
try{ if (typeof PlanGrid !== "undefined") window.PlanGrid = PlanGrid; }catch(_e){}
