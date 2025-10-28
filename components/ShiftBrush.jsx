// Wichtig für Textfarbe

// 'export const' ist korrekt
window.ShiftBrush = ({ activeBrush, onBrushChange, shiftColors }) => {
    
    const brushableShifts = Object.keys(SHIFT_TYPES).filter(
        key => SHIFT_TYPES[key].showInBrush
    );

    const getBrushColor = (shiftKey) => {
        if (shiftColors && shiftColors[shiftKey]) {
            return shiftColors[shiftKey];
        }
        if (SHIFT_TYPES[shiftKey] && SHIFT_TYPES[shiftKey].color) {
            return SHIFT_TYPES[shiftKey].color;
        }
        return '#777';
    };

    return (
        <div className="shift-brush-container" role="radiogroup" aria-label="Schicht-Pinsel Auswahl">
            <div className="shift-brush-grid">
                {brushableShifts.map(key => {
                    const type = SHIFT_TYPES[key];
                    const isActive = activeBrush === key;
                    const color = getBrushColor(key);
                    
                    // Ermittelt, ob Text hell oder dunkel sein muss
                    const textColor = getTextColor(color); 
                    const label = key === '' ? 'Leer' : key;
                    
                    // Der "Leer"-Button (Farbe #ffffff) braucht Sonderbehandlung
                    const emptyStyleFix = color.toLowerCase() === '#ffffff';

                    return (
                        <button
                            key={key}
                            type="button"
                            // Die 'active' Klasse wird gesetzt, damit CSS den Rahmen steuern kann
                            className={`brush-button ${isActive ? 'active' : ''}`}
                            onClick={() => onBrushChange(key)}
                            aria-pressed={isActive}
                            role="radio"
                            aria-checked={isActive}
                            title={type.label}
                            
                            /* KORREKTUR:
                             * Wir setzen IMMER die Hintergrundfarbe und die Textfarbe.
                             * Der Rahmen wird über CSS gesteuert.
                             */
                            style={{ 
                                backgroundColor: color,
                                color: emptyStyleFix ? '#000' : textColor,
                                // Standard-Rahmen (wird bei 'active' von CSS überschrieben)
                                // 'Leer' braucht einen sichtbaren Rahmen, andere nicht.
                                borderColor: emptyStyleFix ? '#ccc' : color 
                            }}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
try{ if (typeof ShiftBrush !== "undefined") window.ShiftBrush = ShiftBrush; }catch(_e){}
