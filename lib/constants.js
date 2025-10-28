// Konstanten, die global genutzt werden

// FIX: 'export' wurde zu jeder Konstante hinzugefügt, damit sie einzeln importiert werden können.
export const SHIFT_TYPES = {
    'TR': { name: 'Tagschicht', showInBrush: true, hours: 12, autoPlan: true, color: '#cfe2ff', textColor: '#052c65' },
    'VT': { name: 'Verfüger Tag', showInBrush: true, hours: 0.15, autoPlan: true, color: '#e9d8fd', textColor: '#483d8b' },
    'NR': { name: 'Nachtschicht', showInBrush: true, hours: 12, autoPlan: true, color: '#fff3cd', textColor: '#664d03' },
    'VN': { name: 'Verfüger Nacht', showInBrush: true, hours: 0.15, autoPlan: true, color: '#ffdac2', textColor: '#8c5324' },
    'AVT': { name: 'Aktivierter V-Tag', showInBrush: true, hours: 12.15, autoPlan: false, color: '#cfe2ff', textColor: '#052c65' },
    'AVN': { name: 'Aktivierter V-Nacht', showInBrush: true, hours: 12.15, autoPlan: false, color: '#f5e8d7', textColor: '#6e5b41' },
    'F': { name: 'Frei', showInBrush: true, hours: 0, autoPlan: false, color: '#f8f9fa', textColor: '#495057' },
    'U': { name: 'Urlaub', showInBrush: true, hours: 8, autoPlan: false, color: '#f8d7da', textColor: '#58151a' },
    'FW': { name: 'Freiwunsch', hours: 0, autoPlan: false, color: '#d1e7dd', textColor: '#0f5132' },
    'T39': { name: 'Tagdienst 39', showInBrush: true, hours: 8, autoPlan: false, color: '#cff4fc', textColor: '#055160' },
    'V39': { name: 'Verfüger 39', showInBrush: true, hours: 8, autoPlan: false, color: '#d2f4ea', textColor: '#1e7e34' },
    'LR': { name: 'Lehrgang Rettungsdienst', showInBrush: true, hours: 8, autoPlan: false, color: '#e2d9f3', textColor: '#483d8b' },
    '': { name: 'Keine Schicht', showInBrush: true, hours: 0, autoPlan: false, color: '#ffffff', textColor: '#ced4da' }
};

export const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

export const DB_NAME = `dienstplanDB_React_v2`;

export const DEFAULT_SETTINGS = { 
    theme: 'light', 
    planungsmodell: 'standard', 
    shiftHours: {}, 
    masterDemand: {}, 
    shiftColors: {} 
};

