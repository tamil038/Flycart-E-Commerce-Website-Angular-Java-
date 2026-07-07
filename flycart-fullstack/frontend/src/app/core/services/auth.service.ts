import { Injectable, signal } from '@angular/core';

export interface UserProfile {
  name: string;
  email: string;
  address: string;
}

const AUTH_KEY = 'flycart.auth';
const PROFILE_KEY = 'flycart.profile';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isLoggedIn = signal<boolean>(this.readAuth());
  readonly profile = signal<UserProfile>(this.readProfile());

  private readAuth(): boolean {
    try { return localStorage.getItem(AUTH_KEY) === 'true'; } catch { return false; }
  }

  private readProfile(): UserProfile {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null') || { name: '', email: '', address: '' };
    } catch {
      return { name: '', email: '', address: '' };
    }
  }

  login(email: string, name?: string): void {
    localStorage.setItem(AUTH_KEY, 'true');
    this.isLoggedIn.set(true);
    if (email && !this.profile().email) {
      this.saveProfile({ name: name || this.profile().name || 'Flycart Shopper', email, address: this.profile().address });
    }
  }

  logout(): void {
    localStorage.setItem(AUTH_KEY, 'false');
    this.isLoggedIn.set(false);
  }

  saveProfile(profile: UserProfile): void {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    this.profile.set(profile);
  }
}
