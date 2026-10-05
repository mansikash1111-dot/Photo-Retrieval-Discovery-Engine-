import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Real Google Play Store colored triangle icon
 */
export const GooglePlayIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0, ...style }}
  >
    <path d="M3.609 1.814c-.347.361-.559.867-.559 1.442v17.488c0 .575.212 1.081.56 1.442l10.183-10.186L3.609 1.814z" fill="#00D3FF" />
    <path d="M17.18 8.613l-3.387 3.387 3.387 3.387 3.826-2.174c.915-.52.915-1.373 0-1.893l-3.826-2.707z" fill="#FFCE00" />
    <path d="M3.609 1.814c.861-.668 1.871-.851 2.751-.351l10.82 6.15-3.387 3.387L3.609 1.814z" fill="#00F076" />
    <path d="M13.793 12l3.387 3.387-10.82 6.15c-.879.5-1.889.317-2.75-.351L13.793 12z" fill="#FF3A44" />
  </svg>
);

/**
 * Real Apple App Store icon (iOS blue tile with white App Store geometry)
 */
export const AppleAppStoreIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0, ...style }}
  >
    <rect width="24" height="24" rx="5.5" fill="#0071E3" />
    <path
      d="M12 4.6c.33 0 .63.18.79.47l5.48 9.75c.31.55-.09 1.23-.72 1.23h-1.2l-1.07-1.92H8.72l-1.07 1.92H6.45c-.63 0-1.03-.68-.72-1.23L11.21 5.07c.16-.29.46-.47.79-.47zm0 3.35L9.62 12.2h4.76L12 7.95z"
      fill="#FFFFFF"
    />
    <path
      d="M7 13.75h10c.41 0 .75.34.75.75s-.34.75-.75.75H7c-.41 0-.75-.34-.75-.75s.34-.75.75-.75z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * Real Reddit icon (Official Orange-Red Snoo Alien Logo)
 */
export const RedditIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0, ...style }}
  >
    <circle cx="12" cy="12" r="11" fill="#FF4500" />
    <path
      d="M19.12 11.23a1.44 1.44 0 00-1.44-1.44 1.41 1.41 0 00-.81.25 6.78 6.78 0 00-3.66-1.12l.62-2.93 2.04.44a1.05 1.05 0 10.15-.71l-2.4-.52a.26.26 0 00-.31.2l-.74 3.51a6.83 6.83 0 00-3.72 1.13 1.42 1.42 0 00-.81-.25 1.44 1.44 0 00-.93 2.53 2.87 2.87 0 00-.07.63c0 2.21 2.37 4 5.3 4s5.3-1.79 5.3-4a2.87 2.87 0 00-.07-.63 1.44 1.44 0 00.89-1.09zm-9.37 1.31a1.05 1.05 0 11-1.05-1.05 1.05 1.05 0 011.05 1.05zm4.84 2.45a3.17 3.17 0 01-2.59.7 3.17 3.17 0 01-2.59-.7.24.24 0 01.34-.34 2.7 2.7 0 002.25.6 2.7 2.7 0 002.25-.6.24.24 0 01.34.34zm-.29-1.4a1.05 1.05 0 111.05-1.05 1.05 1.05 0 01-1.05 1.05z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * Real Google Community / Support (Official Google 4-Color 'G' Logo)
 */
export const GoogleCommunityIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0, ...style }}
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

/**
 * Real YouTube logo (Official Red Badge with White Play Button)
 */
export const YouTubeIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0, ...style }}
  >
    <path
      d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
      fill="#FF0000"
    />
    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
  </svg>
);

/**
 * Real Forums / Discourse community chat icon
 */
export const ForumsIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0, ...style }}
  >
    <rect width="24" height="24" rx="5.5" fill="#8B5CF6" />
    <path
      d="M6 7.5c0-.83.67-1.5 1.5-1.5h9c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5H14l-3 2.5V15H7.5c-.83 0-1.5-.67-1.5-1.5v-6z"
      fill="#FFFFFF"
    />
    <circle cx="9.25" cy="10.5" r="1" fill="#8B5CF6" />
    <circle cx="12" cy="10.5" r="1" fill="#8B5CF6" />
    <circle cx="14.75" cy="10.5" r="1" fill="#8B5CF6" />
  </svg>
);

/**
 * Real All Reviews icon (Layered stack collection icon)
 */
export const AllReviewsIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0, ...style }}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#3B82F6" />
    <path d="M2 17l10 5 10-5" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12l10 5 10-5" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
