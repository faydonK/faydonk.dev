# Translation System Documentation

## Overview

This project uses **react-i18next** for internationalization (i18n). The system supports multiple languages through URL routing and automatically detects the user's browser language on first visit.

## Project Structure

```
src/
├── locales/              # Translation files
│   ├── en.json          # English translations
│   └── fr.json          # French translations
├── utils/
│   └── i18n.ts          # i18n configuration
└── hooks/
    └── useLanguage.ts   # Custom language management hook
```

---

## How It Works

### 1. URL-Based Language Routing

The app uses language prefixes in URLs:
- `/en` → English version
- `/fr` → French version
- `/en/terms` → English Terms page
- `/fr/terms` → French Terms page

When a user visits `/` without a language, they are automatically redirected to their browser's language (or `en` as fallback).

### 2. Translation Files

Translations are stored in JSON files under `src/locales/`:

**`en.json` (English)**
```json
{
  "nav": {
    "about": "About",
    "skills": "Skills",
    "projects": "Projects"
  },
  "hero": {
    "greeting": "Hi, I'm",
    "title": "Hello World!"
  }
}
```

**`fr.json` (French)**
```json
{
  "nav": {
    "about": "À propos",
    "skills": "Compétences",
    "projects": "Projets"
  },
  "hero": {
    "greeting": "Salut, je suis",
    "title": "Bonjour le monde !"
  }
}
```

### 3. The `useLanguage` Hook

A custom hook that handles:
- Browser language detection
- URL synchronization with i18n
- Language switching

**Location:** `src/hooks/useLanguage.ts`

**Usage:**
```tsx
import { useLanguage } from '../hooks/useLanguage';

const MyComponent = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  
  return (
    <button onClick={() => changeLanguage('fr')}>
      Switch to French
    </button>
  );
};
```

---

## Adding Translations to Components

### Step 1: Import the hook

```tsx
import { useTranslation } from 'react-i18next';
```

### Step 2: Use the `t` function

```tsx
const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('hero.greeting')}</h1>
      <p>{t('hero.title')}</p>
    </div>
  );
};
```

### Step 3: Add translations to JSON files

**`en.json`**
```json
{
  "hero": {
    "greeting": "Hi, I'm",
    "title": "Hello World!"
  }
}
```

**`fr.json`**
```json
{
  "hero": {
    "greeting": "Salut, je suis",
    "title": "Bonjour le monde !"
  }
}
```

---

## Adding a New Page

### 1. Add translations to JSON files

**`en.json`**
```json
{
  "myPage": {
    "title": "My Page Title",
    "content": "Some content here"
  }
}
```

**`fr.json`**
```json
{
  "myPage": {
    "title": "Titre de ma page",
    "content": "Du contenu ici"
  }
}
```

### 2. Create the page component

```tsx
import { useTranslation } from 'react-i18next';

const MyPage = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('myPage.title')}</h1>
      <p>{t('myPage.content')}</p>
    </div>
  );
};

export default MyPage;
```

### 3. Add the route in `App.tsx`

```tsx
<Route path="/:lang/mypage" element={<MyPage />} />
```

---

## Linking Between Pages

Always include the current language in links:

```tsx
import { useLanguage } from '../hooks/useLanguage';

const MyComponent = () => {
  const { currentLanguage } = useLanguage();
  
  return (
    <a href={`/${currentLanguage}/terms`}>
      Terms
    </a>
  );
};
```

---

## Translation Key Naming Convention

Use nested objects for organization:

```json
{
  "section": {
    "subsection": {
      "key": "value"
    }
  }
}
```

**Examples:**
- `nav.about` → Navigation link
- `hero.greeting` → Hero section greeting
- `footer.rights` → Footer copyright text

---

## Supported Languages

Currently supported languages:
- `en` - English
- `fr` - French

To add a new language:
1. Create `src/locales/[lang].json`
2. Update `src/utils/i18n.ts` to include the new language
3. Update `useLanguage.ts` to support the new language code

---

## Common Patterns

### Optional Fields (Projects Example)

```tsx
interface Project {
  name: string;
  role?: string;      // Optional
  description?: string; // Optional
}

// Safe rendering
{project.role && <span>{project.role}</span>}
{project.description && <p>{project.description}</p>}
```

### TypeScript with Arrays

```tsx
const projects: Project[] = [
  { name: 'Project 1', role: 'Lead Dev' },
  { name: 'Project 2' }  // role is optional
];
```

The `Project[]` means "an array of objects that follow the Project type".

---

## Troubleshooting

### Issue: Links don't preserve language
**Solution:** Use `useLanguage` hook and include `currentLanguage` in links:
```tsx
<a href={`/${currentLanguage}/page`}>Link</a>
```

### Issue: Translation not showing
**Solution:** 
1. Check that the key exists in both `en.json` and `fr.json`
2. Verify the key path: `t('section.key')`
3. Ensure `i18n` is imported in `App.tsx`

### Issue: Page redirects to home
**Solution:** Make sure the route includes `/:lang` parameter:
```tsx
<Route path="/:lang/terms" element={<Terms />} />
```

---

## Best Practices

1. **Always use the `t` function** for user-facing text
2. **Keep translation keys organized** by section/component
3. **Include language in all internal links** using `useLanguage`
4. **Add translations for both languages** when adding new keys
5. **Use optional chaining** (`?.`) for optional fields

---

## Example: Complete Component

```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';

const ExampleComponent = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('example.title')}</h1>
      <p>{t('example.description')}</p>
      
      <button onClick={() => changeLanguage('fr')}>
        Français
      </button>
      
      <a href={`/${currentLanguage}/about`}>
        {t('nav.about')}
      </a>
    </div>
  );
};

export default ExampleComponent;
```

---

## Additional Resources

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
