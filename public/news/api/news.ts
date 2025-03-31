import { Request, Response } from 'express';
import db from '../db';
import { News } from '../types';

export default function handler(req: Request, res: Response) {
  try {
    const news = db.prepare('SELECT * FROM news ORDER BY date DESC').all() as News[];
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des news' });
  }
}