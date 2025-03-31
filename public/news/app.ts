import { News, LoginCredentials } from './types';

class NewsApp {
  private loginBtn: HTMLButtonElement;
  private loginModal: HTMLDivElement;
  private closeModal: HTMLButtonElement;
  private loginForm: HTMLFormElement;
  private newsFeed: HTMLDivElement;
  private newPostBtn: HTMLDivElement;
  private userSection: HTMLDivElement;
  private isLoggedIn: boolean = false;
  private userEmail: string = '';

  constructor() {
    this.loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
    this.loginModal = document.getElementById('loginModal') as HTMLDivElement;
    this.closeModal = document.getElementById('closeModal') as HTMLButtonElement;
    this.loginForm = document.getElementById('loginForm') as HTMLFormElement;
    this.newsFeed = document.getElementById('news-feed') as HTMLDivElement;
    this.newPostBtn = document.getElementById('newPostBtn') as HTMLDivElement;
    this.userSection = document.getElementById('userSection') as HTMLDivElement;

    this.initializeEventListeners();
    this.loadNews();
    this.checkCurrentPath();
  }

  private checkCurrentPath(): void {
    if (window.location.pathname === '/news/login') {
      this.loginModal.classList.remove('hidden');
    }
  }

  private initializeEventListeners(): void {
    this.loginBtn.addEventListener('click', () => {
      if (!this.isLoggedIn) {
        window.history.pushState({}, '', '/news/login');
        this.loginModal.classList.remove('hidden');
      }
    });

    this.closeModal.addEventListener('click', () => {
      window.history.pushState({}, '', '/news');
      this.loginModal.classList.add('hidden');
    });

    this.loginModal.addEventListener('click', (e) => {
      if (e.target === this.loginModal) {
        window.history.pushState({}, '', '/news');
        this.loginModal.classList.add('hidden');
      }
    });

    this.loginForm.addEventListener('submit', this.handleLogin.bind(this));

    window.addEventListener('popstate', () => {
      if (window.location.pathname === '/news/login') {
        this.loginModal.classList.remove('hidden');
      } else {
        this.loginModal.classList.add('hidden');
      }
    });
  }

  private updateUserSection(): void {
    if (this.isLoggedIn) {
      this.userSection.innerHTML = `
        <div class="flex items-center gap-2 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
          </svg>
          <span>${this.userEmail}</span>
        </div>
      `;
      this.newPostBtn.classList.remove('hidden');
    } else {
      this.userSection.innerHTML = `
        <button id="loginBtn" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
          Connexion
        </button>
      `;
      this.newPostBtn.classList.add('hidden');
      this.loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
      this.loginBtn.addEventListener('click', () => {
        window.history.pushState({}, '', '/news/login');
        this.loginModal.classList.remove('hidden');
      });
    }
  }

  private async loadNews(): Promise<void> {
    try {
      const response = await fetch('/api/news');
      const news = await response.json() as News[];
      
      this.newsFeed.innerHTML = news.map(item => `
        <div class="news-card">
          <h2>${item.title}</h2>
          <p>${item.content}</p>
          <div class="date">${new Date(item.date).toLocaleDateString()}</div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Erreur lors du chargement des news:', error);
    }
  }

  private async handleLogin(e: Event): Promise<void> {
    e.preventDefault();
    
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    
    const credentials: LoginCredentials = {
      email: emailInput.value,
      password: passwordInput.value
    };

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) throw new Error('Identifiants invalides');

      this.isLoggedIn = true;
      this.userEmail = credentials.email;
      window.history.pushState({}, '', '/news');
      this.loginModal.classList.add('hidden');
      this.updateUserSection();
      this.loginForm.reset();
      
    } catch (error) {
      alert('Erreur de connexion: ' + (error as Error).message);
    }
  }
}

// Initialiser l'application
new NewsApp();