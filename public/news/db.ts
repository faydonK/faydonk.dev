import Database from 'better-sqlite3';
import { News, User } from '/types';

const db = new Database(':memory:');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

const insertAdmin = db.prepare(`
  INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)
`);

insertAdmin.run('admin@faydonk.dev', 'test1234');


const insertNews = db.prepare(`
  INSERT OR IGNORE INTO news (id, title, content) VALUES
    (1, 'Nouveau Stream ce Soir!', 'Je serai en live ce soir à 21h pour une session spéciale!'),
    (2, 'Mise à jour du Site', 'Le site a été mis à jour avec une nouvelle section News!'),
    (3, 'Événement Communautaire', 'Un événement spécial sera organisé le weekend prochain!')
`);

insertNews.run();

export default db;