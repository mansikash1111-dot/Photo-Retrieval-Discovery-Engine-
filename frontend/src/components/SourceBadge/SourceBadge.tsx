import React from 'react';
import { Smartphone, Apple, MessageSquare, HelpCircle, Youtube, Globe } from 'lucide-react';

interface SourceBadgeProps {
  slug: string;
  name?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ slug, name }) => {
  const getSourceDetails = (sourceSlug: string) => {
    switch (sourceSlug) {
      case 'google-play':
        return { label: name || 'Google Play', icon: Smartphone, className: 'source-badge-google-play' };
      case 'apple-app-store':
        return { label: name || 'App Store', icon: Apple, className: 'source-badge-apple-app-store' };
      case 'reddit':
        return { label: name || 'Reddit', icon: MessageSquare, className: 'source-badge-reddit' };
      case 'google-photos-community':
        return { label: name || 'Google Community', icon: HelpCircle, className: 'source-badge-google-photos-community' };
      case 'youtube':
        return { label: name || 'YouTube', icon: Youtube, className: 'source-badge-youtube' };
      case 'forums':
        return { label: name || 'Forums', icon: Globe, className: 'source-badge-forums' };
      default:
        return { label: name || slug, icon: Globe, className: 'source-badge-forums' };
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
