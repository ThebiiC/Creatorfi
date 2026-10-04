import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

const emptyWorkspace = {
  influencers: [],
  applications: [],
  coaching: [],
  vetting: [],
  activity: [],
  brands: [],
  campaigns: [],
  currentPlan: 'Starter',
  plans: [],
};

const emptyCreator = {
  profile: { name: '', handle: '', avatar: '', plan: 'Free', location: '', idVerified: false, idMasked: '' },
  platforms: [],
  posts: [],
  brands: [],
  payments: [],
  steps: [],
  coaching: null,
  courses: [],
};

function flushApi(): void {
  const http = TestBed.inject(HttpTestingController);
  for (const request of http.match(() => true)) {
    if (request.request.url.includes('/workspace')) {
      request.flush(emptyWorkspace);
    } else {
      request.flush(emptyCreator);
    }
  }
}

describe('App', () => {
  beforeEach(async () => {
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      media: '(max-width: 767px)',
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }));

    localStorage.setItem(
      'creatorfi.manager',
      JSON.stringify({ token: 'test', name: 'Test Manager', email: 'manager@example.com', role: 'Manager' }),
    );

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.removeItem('creatorfi.manager');
    TestBed.inject(HttpTestingController).verify();
    vi.unstubAllGlobals();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    flushApi();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('hides the sidebar completely when the toolbar control is used', () => {
    const fixture = TestBed.createComponent(App);
    flushApi();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const sidebar = compiled.querySelector('#app-sidebar');
    const toggle = compiled.querySelector<HTMLButtonElement>('.sidebar-toggle');

    expect(sidebar).not.toBeNull();
    expect(toggle?.getAttribute('aria-expanded')).toBe('true');
    expect(sidebar?.getAttribute('aria-hidden')).toBe('false');

    toggle?.click();
    fixture.detectChanges();

    expect(sidebar?.getAttribute('aria-hidden')).toBe('true');
    expect(toggle?.getAttribute('aria-expanded')).toBe('false');

    toggle?.click();
    fixture.detectChanges();

    expect(sidebar?.getAttribute('aria-hidden')).toBe('false');
    expect(toggle?.getAttribute('aria-expanded')).toBe('true');
  });
});
