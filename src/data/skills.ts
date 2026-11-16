import discord from '../assets/logos/discord.svg';
import go from '../assets/logos/go.svg';
import claudecode from '../assets/logos/claudecode.svg';
import docker from '../assets/logos/docker.svg';
import express from '../assets/logos/express.svg';
import git from '../assets/logos/git.svg';
import insomnia from '../assets/logos/insomnia.svg';
import javascript from '../assets/logos/javascript.svg';
import nodejs from '../assets/logos/nodejs.svg';
import postman from '../assets/logos/postman.svg';
import react from '../assets/logos/react.svg';
import sqlite from '../assets/logos/sqlite.svg';
import typescript from '../assets/logos/typescript.svg';
import ubuntu from '../assets/logos/ubuntu.svg';
import vite from '../assets/logos/vite.svg';
import vscode from '../assets/logos/vscode.svg';
import xampp from '../assets/logos/xampp.svg';
import claude from '../assets/logos/claude.svg';
import supabase from '../assets/logos/supabase.svg';
import nextjs from '../assets/logos/nextjs.svg';
import windowsserver from '../assets/logos/windowsserver.svg';
import fastapi from '../assets/logos/fastapi.svg';
import githubdesktop from '../assets/logos/githubdesktop.svg';
import mysql from '../assets/logos/mysql.svg';
import shopifyhydrogen from '../assets/logos/shopifyhydrogen.svg';
import radixui from '../assets/logos/radixui.svg';
import python from '../assets/logos/python.svg';


export interface Skill {
  name: string;
  logo: string;
}

export const TECHNOLOGIES: Skill[] = [
  { name: 'JavaScript', logo: javascript },
  { name: 'TypeScript', logo: typescript },
  { name: 'Python (learning)', logo: python },
  { name: 'Go (Learning)', logo: go },
  { name: 'Vite', logo: vite },
  { name: 'React', logo: react },
  { name: 'Next.js', logo: nextjs },
  { name: 'Shopify Hydrogen', logo: shopifyhydrogen },
  { name: 'Radix UI', logo: radixui },
  { name: 'Express', logo: express },
  { name: 'FastAPI', logo: fastapi },
  { name: 'Discord.js', logo: discord },
  { name: 'SQLite', logo: sqlite },
  { name: 'MySQL', logo: mysql },
  { name: 'Node.js', logo: nodejs },  
];

export const TOOLS: Skill[] = [
  { name: 'Visual Studio Code', logo: vscode },
  { name: 'Git', logo: git },
  { name: 'Docker', logo: docker },
  { name: 'Ubuntu', logo: ubuntu },
  { name: 'Postman', logo: postman },
  { name: 'Insomnia', logo: insomnia },
  { name: 'XAMPP', logo: xampp },
  { name: 'Claude', logo: claude },
  { name: 'Claude Code', logo: claudecode },
  { name: 'Supabase', logo: supabase },
  { name: 'Windows Server', logo: windowsserver },
  { name: 'GitHub Desktop', logo: githubdesktop },
];
