import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { clearLastOpened } from '../store/slices/previewSlice';

export default function OpeningToast() {
  const dispatch   = useAppDispatch();
  const lastOpened = useAppSelector((s) => s.preview.lastOpened);

  useEffect(() => {
    if (!lastOpened) return;
    const t = setTimeout(() => dispatch(clearLastOpened()), 1500);
    return () => clearTimeout(t);
  }, [lastOpened, dispatch]);

  if (!lastOpened) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 inset-x-0 mx-auto w-fit rounded-full bg-neutral-900 text-white px-4 py-2 text-xs shadow-lg/40 shadow-black/40 dark:bg-neutral-800 z-50"
    >
      Opening:&nbsp;<span className="font-medium">{lastOpened}</span>
    </div>
  );
}