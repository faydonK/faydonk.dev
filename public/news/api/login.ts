import { Request, Response } from 'express';
import db from '../db';
import { LoginCredentials, User } from '../types';

export default function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { email, password } = req.body as LoginCredentials;

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?')
      .get(email, password) as User | undefined;

    if (user) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Identifiants invalides' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
}