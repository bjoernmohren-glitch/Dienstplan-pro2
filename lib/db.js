// /src/lib/db.js
import { openDB } from 'idb';

/**
 * Dienstplan Pro – IndexedDB Modul (Version 2)
 * --------------------------------------------
 * Enthält:
 * - Employees, Plans, Settings (bestehend)
 * - Backups (neu)
 * - Sicheres Initialisieren, Transaktionen, Restore
 */

const DB_NAME = 'DienstplanDB';
const DB_VERSION = 2; // erhöhte Version für Migration

let db;

/**
 * Initialisiert oder migriert die Datenbank.
 */
export async function init() {
  if (db) return db;

  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      console.log(`Upgrade IndexedDB von Version ${oldVersion} auf ${DB_VERSION}`);

      // Mitarbeiter
      if (!db.objectStoreNames.contains('employees')) {
        db.createObjectStore('employees', { keyPath: 'id' });
      }

      // Dienstpläne
      if (!db.objectStoreNames.contains('plans')) {
        db.createObjectStore('plans', { keyPath: 'monthId' });
      }

      // Einstellungen
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }

      // NEU: Backups
      if (!db.objectStoreNames.contains('backups')) {
        db.createObjectStore('backups', { keyPath: 'timestamp' });
      }
    },
  });

  console.log('IndexedDB erfolgreich initialisiert.');
  return db;
}

/**
 * Stellt sicher, dass die Datenbank geöffnet ist.
 */
async function getDb() {
  if (!db) {
    await init();
  }
  return db;
}

/* ------------------------------------------------------------
 * CRUD-Operationen
 * ---------------------------------------------------------- */

/**
 * Einzelnen Eintrag holen.
 */
export async function get(storeName, key) {
  const db = await getDb();
  return db.get(storeName, key);
}

/**
 * Alle Einträge aus einem Store holen.
 */
export async function getAll(storeName) {
  const db = await getDb();
  return db.getAll(storeName);
}

/**
 * Eintrag hinzufügen oder aktualisieren.
 */
export async function put(storeName, value) {
  const db = await getDb();
  return db.put(storeName, value);
}

/**
 * Eintrag löschen.
 */
export async function deleteEntry(storeName, key) {
  const db = await getDb();
  return db.delete(storeName, key);
}
export { deleteEntry as delete };

/**
 * Store leeren.
 */
export async function clear(storeName) {
  const db = await getDb();
  return db.clear(storeName);
}

/* ------------------------------------------------------------
 * Backup-System
 * ---------------------------------------------------------- */

/**
 * Erstellt ein Backup-Objekt mit allen Daten.
 */
export async function createBackupObject() {
  const database = await getDb();
  const snapshot = {
    ts: new Date().toISOString(),
    employees: await database.getAll('employees'),
    plans: await database.getAll('plans'),
    settings: await database.getAll('settings'),
  };
  return snapshot;
}

/**
 * Speichert ein Backup in der IndexedDB.
 */
export async function saveBackup() {
  const database = await getDb();
  const data = await createBackupObject();
  await database.put('backups', { timestamp: Date.now(), data });
  console.log('Backup gespeichert:', new Date().toLocaleString());
}

/**
 * Liste aller gespeicherten Backups abrufen.
 */
export async function listBackups() {
  const database = await getDb();
  const all = await database.getAll('backups');
  return all.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Stellt ein Backup anhand eines Timestamps wieder her.
 */
export async function restoreBackup(timestamp) {
  const database = await getDb();
  const backup = await database.get('backups', timestamp);
  if (!backup) throw new Error('Backup nicht gefunden.');

  const { employees, plans, settings } = backup.data;
  const tx = database.transaction(['employees', 'plans', 'settings'], 'readwrite');

  // Bestehende Daten löschen
  await Promise.all([
    tx.objectStore('employees').clear(),
    tx.objectStore('plans').clear(),
    tx.objectStore('settings').clear(),
  ]);

  // Wiederherstellen
  await Promise.all([
    ...employees.map((e) => tx.objectStore('employees').put(e)),
    ...plans.map((p) => tx.objectStore('plans').put(p)),
    ...settings.map((s) => tx.objectStore('settings').put(s)),
  ]);

  await tx.done;
  console.log('Backup wiederhergestellt.');
}

/* ------------------------------------------------------------
 * Transaktionale Speicherung
 * ---------------------------------------------------------- */

/**
 * Führt mehrere DB-Operationen atomar (in einer Transaktion) aus.
 * Beispiel:
 * await atomicWrite(async (tx) => {
 *   tx.objectStore('employees').put(newEmp);
 *   tx.objectStore('plans').put(updatedPlan);
 * });
 */
export async function atomicWrite(callback) {
  const database = await getDb();
  const tx = database.transaction(['employees', 'plans', 'settings'], 'readwrite');
  try {
    await callback(tx);
    await tx.done;
  } catch (err) {
    tx.abort();
    console.error('Transaktion abgebrochen:', err);
    throw err;
  }
}

/* ------------------------------------------------------------
 * Automatisches Backup (optional)
 * ---------------------------------------------------------- */

/**
 * Startet ein automatisches Backup-Intervall (z. B. alle 30 Minuten).
 * Gibt eine Funktion zurück, um das Intervall zu stoppen.
 */
export function startAutoBackup(intervalMinutes = 30) {
  const ms = intervalMinutes * 60 * 1000;
  const id = setInterval(() => {
    saveBackup().catch((err) => console.error('Auto-Backup fehlgeschlagen:', err));
  }, ms);
  console.log(`Auto-Backup aktiviert (alle ${intervalMinutes} Minuten).`);
  return () => clearInterval(id);
}
