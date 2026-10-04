import { TestBed } from '@angular/core/testing';
import { ShellLayout } from './shell-layout';

interface MatchMediaMock {
  matches: boolean;
  dispatch(matches: boolean): void;
}

function installMatchMedia(matches: boolean): MatchMediaMock {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const media: MatchMediaMock = {
    matches,
    dispatch(next: boolean) {
      media.matches = next;
      const event = { matches: next, media: '(max-width: 767px)' } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };

  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return media.matches;
    },
    media: '(max-width: 767px)',
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    },
  }));

  return media;
}

describe('ShellLayout', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    TestBed.resetTestingModule();
  });

  it('starts open as a column on a wide screen and hides completely when toggled', () => {
    installMatchMedia(false);
    const layout = TestBed.inject(ShellLayout);

    expect(layout.presentation()).toBe('column');
    expect(layout.sidebarOpen()).toBe(true);

    layout.toggle();
    expect(layout.sidebarOpen()).toBe(false);
    expect(layout.presentation()).toBe('column');

    layout.toggle();
    expect(layout.sidebarOpen()).toBe(true);
  });

  it('starts closed on a narrow screen and slides open over the page', () => {
    installMatchMedia(true);
    const layout = TestBed.inject(ShellLayout);

    expect(layout.presentation()).toBe('overlay');
    expect(layout.sidebarOpen()).toBe(false);

    layout.toggle();
    expect(layout.sidebarOpen()).toBe(true);
    expect(layout.presentation()).toBe('overlay');

    layout.closeOverlay();
    expect(layout.sidebarOpen()).toBe(false);
  });

  it('keeps a wide-screen collapse when the window becomes narrow', () => {
    const media = installMatchMedia(false);
    const layout = TestBed.inject(ShellLayout);

    layout.toggle();
    media.dispatch(true);

    expect(layout.presentation()).toBe('overlay');
    expect(layout.sidebarOpen()).toBe(false);
  });

  it('does not close a wide sidebar when the overlay dismiss runs', () => {
    installMatchMedia(false);
    const layout = TestBed.inject(ShellLayout);

    layout.closeOverlay();

    expect(layout.sidebarOpen()).toBe(true);
  });
});
