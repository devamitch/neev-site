import React from "react";

export const GoogleCalendarIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
    <path fill="#4285F4" d="M16 114v90c0 19.882 16.118 36 36 36h52V114H16z" />
    <path fill="#34A853" d="M104 240h100c19.882 0 36-16.118 36-36v-90H104v126z" />
    <path fill="#EA4335" d="M240 114V52c0-19.882-16.118-36-36-36H104v98h136z" />
    <path fill="#FBBC04" d="M104 114V16H52C32.118 16 16 32.118 16 52v62h88z" />
    <path fill="#FFF" d="M68 68h120v120H68z" />
    <text
      x="128"
      y="148"
      fontFamily="Arial, sans-serif"
      fontSize="52"
      fontWeight="bold"
      fill="#4285F4"
      textAnchor="middle"
    >
      31
    </text>
  </svg>
);

export const GoogleGmailIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
    <path fill="#4285F4" d="M42 226h42V155.602l-84-59.57v87.968C0 207.2 18.8 226 42 226z" />
    <path fill="#34A853" d="M214 226h42c0-23.2-18.8-42-42-42v-28.398l-84-59.57V226h84z" />
    <path
      fill="#EA4335"
      d="M202.949 32.996C186.6 21.002 163.6 22 148 33L128 47.164 108 33C92.4 22 69.4 21.002 53.051 32.996 34.2 46.855 24 68.613 24 92.406l84 64.992 84-64.992c0-23.793-10.2-45.551-29.051-59.41z"
    />
    <path fill="#FBBC04" d="M256 92.406c0-17.797-6.2-34.598-17.051-48.414L172 96h84v-3.594z" />
    <path fill="#C5221F" d="M0 92.406v3.594h84V96L17.051 43.992C6.2 57.808 0 74.609 0 92.406z" />
  </svg>
);

export const GoogleDriveIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
    <path fill="#EA4335" d="M84.99 15L13.79 138h71.22L156.23 15H84.99z" />
    <path fill="#34A853" d="M171.01 15L242.21 138h-71.21L99.77 15h71.24z" />
    <path fill="#4285F4" d="M49.4 196.5L120.61 73.5H249.4L178.19 196.5H49.4z" />
    <path fill="#FBBC04" d="M49.4 196.5L13.79 138h164.4L142.59 196.5H49.4z" />
  </svg>
);

export const GooglePhotosIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
    <path fill="#EA4335" d="M128 0C57.308 0 0 57.308 0 128h128V0z" />
    <path fill="#4285F4" d="M256 128c0-70.692-57.308-128-128-128v128h128z" />
    <path fill="#FBBC04" d="M128 256c70.692 0 128-57.308 128-128H128v128z" />
    <path fill="#34A853" d="M0 128c0 70.692 57.308 128 128 128V128H0z" />
  </svg>
);
