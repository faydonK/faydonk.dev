import gmail from '../assets/mail/gmail.svg';
import outlook from '../assets/mail/outlook.svg';
import proton from '../assets/mail/proton.svg';
import applemail from '../assets/mail/applemail.svg';

export interface MailProvider {
  name: string;
  logo: string; // SVG in src/assets/mail/
  compose: (to: string) => string; // "new message" URL, recipient filled in
}

export const MAIL_PROVIDERS: MailProvider[] = [
  {
    name: 'Gmail',
    logo: gmail,
    compose: (to) => `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}`,
  },
  {
    name: 'Outlook',
    logo: outlook,
    compose: (to) => `https://outlook.live.com/mail/deeplink/compose?to=${encodeURIComponent(to)}`,
  },
  {
    name: 'Proton Mail',
    logo: proton,
    compose: (to) => `https://mail.proton.me/inbox/#mailto=${encodeURIComponent(`mailto:${to}`)}`, // Proton's own mailto: handler URL
  },
  {
    name: 'Apple Mail',
    logo: applemail,
    compose: (to) => `mailto:${to}`, // no web version: the device's mail app (Apple Mail on Mac/iPhone)
  },
];
