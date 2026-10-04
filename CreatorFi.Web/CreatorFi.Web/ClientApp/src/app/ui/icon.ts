import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      @switch (name()) {
        @case ('sparkles') {
          <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
          <path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14z" />
        }
        @case ('search') {
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        }
        @case ('home') {
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" />
        }
        @case ('users') {
          <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9.5" cy="7" r="3" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 4.13a3 3 0 0 1 0 5.74" />
        }
        @case ('building') {
          <path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" />
          <path d="M14 9h5a1 1 0 0 1 1 1v11" />
          <path d="M3 21h18" />
          <path d="M8 8h2M8 12h2M8 16h2M17 13h1M17 17h1" />
        }
        @case ('target') {
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" />
        }
        @case ('graduation') {
          <path d="M3 9l9-4 9 4-9 4-9-4z" />
          <path d="M7 11.5V16c0 1 2.2 3 5 3s5-2 5-3v-4.5" />
        }
        @case ('shield') {
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
          <path d="M9 12l2 2 4-4" />
        }
        @case ('clipboard') {
          <rect x="6" y="5" width="12" height="16" rx="2" />
          <path d="M9 5.5h6a1 1 0 0 0 1-1V4h-8v.5a1 1 0 0 0 1 1z" />
          <path d="M9 12h6M9 16h4" />
        }
        @case ('crown') {
          <path d="M3 17l2-9 5 4 2-6 2 6 5-4 2 9H3z" />
          <path d="M4 20h16" />
        }
        @case ('chevron') {
          <path d="M6 9l6 6 6-6" />
        }
        @case ('settings') {
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
        }
        @case ('panel') {
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M9 4v16" />
        }
        @case ('message') {
          <path d="M5 6h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9l-4 3v-3H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" />
        }
        @case ('bell') {
          <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16z" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        }
        @case ('trend') {
          <path d="M4 16l5-5 3 3 7-7" />
          <path d="M14 7h5v5" />
        }
        @case ('dollar') {
          <path d="M12 3v18" />
          <path d="M16 7.5c0-1.5-1.8-2.5-4-2.5s-4 1-4 2.5 1.6 2.4 4 2.8 4 1.2 4 2.7-1.8 2.5-4 2.5-4-1-4-2.5" />
        }
        @case ('star') {
          <path d="M12 3.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16l-4.8 2.4.9-5.4L4.2 9.2l5.4-.8L12 3.5z" />
        }
        @case ('plus') {
          <path d="M12 5v14M5 12h14" />
        }
        @case ('check') {
          <path d="M5 12.5l4.5 4.5L19 7" />
        }
        @case ('x') {
          <path d="M6 6l12 12M18 6L6 18" />
        }
        @case ('mail') {
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M4 7l8 6 8-6" />
        }
        @case ('link') {
          <path d="M10 14a4 4 0 0 0 6 0l2-2a4 4 0 0 0-6-6l-1 1" />
          <path d="M14 10a4 4 0 0 0-6 0l-2 2a4 4 0 0 0 6 6l1-1" />
        }
        @case ('file') {
          <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path d="M14 3v6h6" />
        }
        @case ('calendar') {
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4M16 3v4M4 10h16" />
        }
        @case ('eye') {
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        }
        @case ('lock') {
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        }
        @case ('upload') {
          <path d="M12 16V5" />
          <path d="M7 9l5-5 5 5" />
          <path d="M5 19h14" />
        }
        @case ('download') {
          <path d="M12 5v11" />
          <path d="M7 12l5 5 5-5" />
          <path d="M5 19h14" />
        }
        @case ('play') {
          <circle cx="12" cy="12" r="9" />
          <path d="M10 9l6 3-6 3V9z" />
        }
        @case ('wallet') {
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 10h18" />
          <path d="M16 14h2" />
        }
        @case ('chart') {
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M8 16v-4M12 16V8M16 16v-6" />
        }
        @case ('alert') {
          <path d="M12 4l9 16H3L12 4z" />
          <path d="M12 10v4M12 17h.01" />
        }
        @case ('camera') {
          <path d="M4 8h3l2-2h6l2 2h3v11H4V8z" />
          <circle cx="12" cy="13" r="3" />
        }
        @case ('twitter') {
          <path d="M5 19c8 0 12.5-6.7 12.5-12.5v-.5A8.5 8.5 0 0 0 20 4a8 8 0 0 1-2.4.7A4.2 4.2 0 0 0 19.5 2a8.4 8.4 0 0 1-2.7 1A4.2 4.2 0 0 0 6.4 7.5a11.9 11.9 0 0 1-8.6-4.4 4.2 4.2 0 0 0 1.3 5.6A4.2 4.2 0 0 1 2 8.3v.1a4.2 4.2 0 0 0 3.4 4.1 4.2 4.2 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9A8.4 8.4 0 0 1 2 18.4 11.8 11.8 0 0 0 8.3 20" />
        }
        @case ('facebook') {
          <path d="M14 9h3V6h-3c-2 0-3 1.2-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
        }
        @case ('clock') {
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v5l3 2" />
        }
      }
    </svg>
  `,
  host: {
    '[class.icon--sm]': 'size() === "sm"',
    '[class.icon--lg]': 'size() === "lg"',
  },
})
export class Icon {
  readonly name = input.required<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');
}
