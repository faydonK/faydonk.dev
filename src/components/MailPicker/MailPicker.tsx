import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Corners from '../Corners/Corners';
import { MailPickerContext } from './MailPickerContext';
import { MAIL_PROVIDERS } from '../../data/mail';
import { SITE } from '../../data/site';
import './MailPicker.css';

const QUERY = 'openchannel'; // faydonk.dev/en?openchannel opens the window on arrival

const hasQuery = (search: string) => [...new URLSearchParams(search).keys()].some((key) => key.toLowerCase() === QUERY);

const removeQuery = () => {
  const url = new URL(window.location.href);
  [...url.searchParams.keys()].filter((key) => key.toLowerCase() === QUERY).forEach((key) => url.searchParams.delete(key));
  window.history.replaceState(window.history.state, '', url); // a reload won't open it again
};

interface MailPickerProps {
  ready: boolean; // false while the intro plays
  children: ReactNode;
}

const MailPicker = ({ ready, children }: MailPickerProps) => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const [clicked, setClicked] = useState(false);
  const [dismissed, setDismissed] = useState<string | null>(null); // the router keeps the old search after replaceState
  const open = clicked || (ready && hasQuery(search) && dismissed !== search);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const show = useCallback((trigger?: HTMLElement) => {
    triggerRef.current = trigger ?? null;
    setClicked(true);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  const close = () => dialogRef.current?.close();

  return (
    <MailPickerContext.Provider value={show}>
      {children}
      {open && (
        <dialog
          ref={dialogRef}
          className="mail-picker"
          aria-labelledby="mail-picker-title"
          onClose={() => {
            setClicked(false);
            if (hasQuery(search)) {
              setDismissed(search);
              removeQuery();
            }
            triggerRef.current?.focus();
          }}
          onClick={(event) => event.target === event.currentTarget && close()}
        >
          <div className="mail-picker__window">
            <Corners />
            <div className="mail-picker__head">
              <p id="mail-picker-title" className="mail-picker__title">
                <span aria-hidden="true">// </span>
                {t('mail.title')}
              </p>
              <button type="button" className="mail-picker__close" onClick={close} aria-label={t('mail.close')}>
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <ul className="mail-picker__list">
              {MAIL_PROVIDERS.map((provider) => {
                const href = provider.compose(SITE.email);
                const app = href.startsWith('mailto:'); // opens the mail app, not a new tab
                return (
                  <li key={provider.name}>
                    <a
                      className="mail-picker__option"
                      href={href}
                      target={app ? undefined : '_blank'}
                      rel={app ? undefined : 'noopener noreferrer'}
                      onClick={close}
                    >
                      <img src={provider.logo} alt="" width={30} height={30} />
                      {provider.name}
                      <span className="sr-only"> — {t(app ? 'mail.app' : 'mail.newTab')}</span>
                      <span className="mail-picker__arrow" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </dialog>
      )}
    </MailPickerContext.Provider>
  );
};

export default MailPicker;
