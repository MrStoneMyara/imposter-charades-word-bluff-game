export type HapticKind = 'tap' | 'move' | 'success';

const PATTERNS: Record<HapticKind, number | number[]> = {
  tap: 10,
  move: 18,
  success: [12, 30, 16],
};

export function haptic(kind: HapticKind = 'tap') {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try {
    navigator.vibrate(PATTERNS[kind]);
  } catch {
    // Vibration is unsupported or blocked on this device.
  }
}

function hapticTargetFromEvent(event: Event): HTMLElement | null {
  const target = event.target;
  if (!(target instanceof Element)) return null;
  const el = target.closest('button, [role="button"]');
  return el instanceof HTMLElement ? el : null;
}

function shouldSkipHaptic(el: HTMLElement): boolean {
  if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return true;
  if (el.dataset.haptic === 'none') return true;
  return false;
}

export function installButtonHaptics() {
  if (typeof document === 'undefined') return;

  const onPointerDown = (event: Event) => {
    const el = hapticTargetFromEvent(event);
    if (!el || shouldSkipHaptic(el)) return;
    const kind = el.dataset.haptic === 'move' || el.dataset.haptic === 'success'
      ? (el.dataset.haptic as HapticKind)
      : 'tap';
    haptic(kind);
  };

  document.addEventListener('pointerdown', onPointerDown, true);
}
