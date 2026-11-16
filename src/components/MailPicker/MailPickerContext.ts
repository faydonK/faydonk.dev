import { createContext, useCallback, useContext, type MouseEvent } from 'react';

export const MailPickerContext = createContext<(trigger?: HTMLElement) => void>(() => undefined);

export const useMailPicker = () => {
  const open = useContext(MailPickerContext);
  return useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; // modifier key: plain mailto: link
      event.preventDefault();
      open(event.currentTarget);
    },
    [open]
  );
};
