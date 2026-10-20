import React from 'react';

// Official Google product brand icons as SVG components

export function GoogleGIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export function GmailIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.907 1.528-1.147C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
    </svg>
  );
}

export function GoogleCalendarIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" fill="#4285F4"/>
      <rect x="7" y="10" width="3" height="3" fill="#EA4335"/>
      <rect x="11" y="10" width="3" height="3" fill="#FBBC05"/>
      <rect x="15" y="10" width="3" height="3" fill="#34A853"/>
      <rect x="7" y="14" width="3" height="3" fill="#34A853"/>
      <rect x="11" y="14" width="3" height="3" fill="#4285F4"/>
    </svg>
  );
}

export function GoogleDriveIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.28 3h11.44l4.72 8.17-2.16 3.74-4.72-8.17H4.44z" fill="#FBBC05"/>
      <path d="m7.28 21 2.16-3.74H21.44l2.16 3.74z" fill="#0F9D58"/>
      <path d="M0 21 4.72 12.83l2.16 3.74L2.16 24.5z" fill="#4285F4"/>
      <path d="m7.28 21 4.72-8.17-2.16-3.74-4.72 8.17z" fill="#EA4335"/>
      <path d="m16.72 21-4.72-8.17 2.16-3.74 4.72 8.17z" fill="#34A853"/>
    </svg>
  );
}

export function GooglePhotosIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="5" r="4" fill="#EA4335"/>
      <circle cx="19" cy="12" r="4" fill="#FBBC05"/>
      <circle cx="12" cy="19" r="4" fill="#4285F4"/>
      <circle cx="5" cy="12" r="4" fill="#34A853"/>
    </svg>
  );
}

export function GoogleFitIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#EA4335"/>
      <path d="M16 8h-2V6h-4v2H8v4h2v2h4v-2h2V8z" fill="white"/>
    </svg>
  );
}

export function GoogleContactsIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#4285F4"/>
      <rect x="0" y="3" width="3" height="18" rx="1.5" fill="#34A853"/>
      <rect x="21" y="3" width="3" height="18" rx="1.5" fill="#34A853"/>
    </svg>
  );
}

export function GoogleTasksIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#4285F4"/>
    </svg>
  );
}

export function GoogleMapsIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335"/>
      <ellipse cx="12" cy="21" rx="4" ry="1.5" fill="#FBBC05" opacity="0.5"/>
    </svg>
  );
}

// Unified Google service icon map
export const GOOGLE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  gmail: GmailIcon,
  calendar: GoogleCalendarIcon,
  drive: GoogleDriveIcon,
  photos: GooglePhotosIcon,
  fitness: GoogleFitIcon,
  fit: GoogleFitIcon,
  contacts: GoogleContactsIcon,
  tasks: GoogleTasksIcon,
  maps: GoogleMapsIcon,
  location: GoogleMapsIcon,
};
