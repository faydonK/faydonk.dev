import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../utils/i18n';
import './LanguageMenu.css';

const LanguageMenu = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [fromStart, setFromStart] = useState(false); // opens towards the right when there's no room on the left
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const toggle = () => {
    const button = toggleRef.current;
    const drop = dropRef.current;
    if (!open && button && drop) setFromStart(button.getBoundingClientRect().right - drop.offsetWidth < 8);
    setOpen((value) => !value);
  };

  const choose = (language: SupportedLanguage) => {
    setOpen(false);
    toggleRef.current?.focus();
    changeLanguage(language);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      toggleRef.current?.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const options = [...(rootRef.current?.querySelectorAll<HTMLButtonElement>('.lang-menu__option') ?? [])];
    const index = options.indexOf(document.activeElement as HTMLButtonElement);
    const step = event.key === 'ArrowDown' ? 1 : -1;
    options[(index + step + options.length) % options.length]?.focus();
  };

  return (
    <div
      ref={rootRef}
      className={`lang-menu${open ? ' is-open' : ''}${fromStart ? ' lang-menu--start' : ''}`}
      onKeyDown={onKeyDown}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        className="btn btn--bare lang-menu__toggle"
        aria-expanded={open}
        aria-controls="lang-menu-list"
        onClick={toggle}
      >
        <span aria-hidden="true">[</span>
        {currentLanguage.toUpperCase()}
        <span className="sr-only"> — {t('nav.language')}</span>
        <svg className="lang-menu__caret" viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" />
        </svg>
        <span aria-hidden="true">]</span>
      </button>

      <div ref={dropRef} className="lang-menu__drop">
        <ul id="lang-menu-list" className="lang-menu__list">
          {SUPPORTED_LANGUAGES.map((language, i) => (
            <li key={language} style={{ '--i': i } as CSSProperties}>
              <button
                type="button"
                className="lang-menu__option"
                lang={language}
                aria-current={language === currentLanguage ? 'true' : undefined}
                tabIndex={open ? 0 : -1}
                onClick={() => choose(language)}
              >
                <span className="lang-menu__code" aria-hidden="true">
                  {language.toUpperCase()}
                </span>
                {LANGUAGE_NAMES[language]}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LanguageMenu;
