/**
 * /lib/utils.js
 * Helfer-Funktionen für Datums- und Berechnungslogik.
 */

/**
 * Erzeugt eine eindeutige ID für einen Monat im Format YYYY-MM.
 * @param {Date} date - Das Datumsobjekt.
 * @returns {string} - Die Monats-ID (z.B. "2025-10").
 */
function getMonthId(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
}

/**
 * Prüft, ob ein gegebenes Datum ein Arbeitstag (Mo-Fr) ist.
 * @param {Date} date - Das zu prüfende Datum.
 * @returns {boolean} - True, wenn Mo-Fr, sonst false.
 */
function isWorkday(date) {
    const day = date.getDay(); // 0 = Sonntag, 1 = Montag, ..., 6 = Samstag
    return day >= 1 && day <= 5;
}

/**
 * Zählt die Arbeitstage (Mo-Fr) in einem gegebenen Monat und Jahr.
 * @param {number} year - Das Jahr (z.B. 2025).
 * @param {number} month - Der Monat (0-basiert, 0=Jan, 11=Dez).
 * @returns {number} - Die Anzahl der Arbeitstage.
 */
function countWorkdaysInMonth(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let workdays = 0;
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        if (isWorkday(date)) {
            workdays++;
        }
    }
    return workdays;
}

/**
 * Berechnet die Soll-Stunden für einen Mitarbeiter in einem Monat.
 * Annahme: 7.8 Stunden pro Tag bei 100%.
 * @param {number} percentage - Der Prozentsatz des Mitarbeiters (z.B. 100, 50).
 * @param {number} year - Das Jahr.
 * @param {number} month - Der Monat (0-basiert).
 * @returns {number} - Die berechneten Soll-Stunden.
 */
function calculateSollStunden(percentage, year, month) {
    // Annahme: Eine 100%-Stelle basiert auf einer 39-Stunden-Woche (7.8h/Tag)
    const FULL_TIME_DAILY_HOURS = 7.8;
    
    const workdays = countWorkdaysInMonth(year, month);
    const percentageFactor = percentage / 100;
    
    const totalSoll = workdays * FULL_TIME_DAILY_HOURS * percentageFactor;
    return parseFloat(totalSoll.toFixed(2)); // Auf 2 Nachkommastellen runden
}
/**
 * Wandelt eine Hex-Farbe in ein RGB-Objekt um.
 * @param {string} hex - Der Hex-Farbcode (z.B. "#FF0000").
 * @returns {object} - Ein Objekt {r, g, b} oder null.
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Ermittelt, ob Text auf einem bestimmten Hintergrund 'hell' oder 'dunkel' sein sollte.
 * @param {string} backgroundColor - Der Hex-Farbcode des Hintergrunds.
 * @returns {string} - Entweder '#000000' (dunkel) oder '#FFFFFF' (hell).
 */
function getTextColor(backgroundColor) {
    if (!backgroundColor || backgroundColor.toLowerCase() === '#ffffff') {
      return '#000000'; // Dunkler Text auf sehr hellem/weißem Grund
    }
    
    const rgb = hexToRgb(backgroundColor);
    if (!rgb) {
        return '#FFFFFF'; // Standard: Weißer Text, wenn Farbe ungültig
    }

    // Formel zur Berechnung der Helligkeit (Luminanz)
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    // Wenn Helligkeit > 0.5 (eher hell), dunklen Text verwenden, sonst weißen
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
try{ if (typeof UTILS !== "undefined") window.UTILS = UTILS; }catch(e){}
