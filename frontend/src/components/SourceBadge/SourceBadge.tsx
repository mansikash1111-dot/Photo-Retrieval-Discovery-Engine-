import React from 'react';
import { 
  GooglePlayIcon, 
  AppleAppStoreIcon, 
  RedditIcon, 
  GoogleCommunityIcon, 
  YouTubeIcon, 
  ForumsIcon 
} from '../Icons/BrandIcons';

interface SourceBadgeProps {
  slug: string;
  name?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ slug, name }) => {
  const getSourceDetails = (sourceSlug: string) => {
    switch (sourceSlug) {
      case 'google-play':
        return { label: name || 'Google Play', icon: GooglePlayIcon, className: 'source-badge-google-play' };
      case 'apple-app-store':
        return { label: name || 'App Store', icon: AppleAppStoreIcon, className: 'source-badge-apple-app-store' };
      case 'reddit':
        return { label: name || 'Reddit', icon: RedditIcon, className: 'source-badge-reddit' };
      case 'google-photos-community':
        return { label: name || 'Google Community', icon: GoogleCommunityIcon, className: 'source-badge-google-photos-community' };
      case 'youtube':
        return { label: name || 'YouTube', icon: YouTubeIcon, className: 'source-badge-youtube' };
      case 'forums':
        return { label: name || 'Forums', icon: ForumsIcon, className: 'source-badge-forums' };
      default:
        return { label: name || slug, icon: ForumsIcon, className: 'source-badge-forums' };
    }
  };

  const details = getSourceDetails(slug);
  const IconComponent = details.icon;

  return (
    <span className={`badge ${details.className}`}>
      <IconComponent size={12} />
      <span>{details.label}</span>
    </span>
  );
};
