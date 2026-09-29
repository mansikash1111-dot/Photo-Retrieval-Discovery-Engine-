import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Dashboard } from './pages/Dashboard';
import { Reviews } from './pages/Reviews';
import { GooglePlayReviews } from './pages/GooglePlayReviews';
import { AppStoreReviews } from './pages/AppStoreReviews';
import { RedditReviews } from './pages/RedditReviews';
import { CommunityReviews } from './pages/CommunityReviews';
import { YouTubeReviews } from './pages/YouTubeReviews';
import { ForumReviews } from './pages/ForumReviews';
import { CollectionJobs } from './pages/CollectionJobs';
import { Settings } from './pages/Settings';
import { RetrievalPage } from './pages/MVP/RetrievalPage';
import { AnalyticsPage } from './pages/MVP/AnalyticsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        
        {/* Part 5: AI-Native Photo Retrieval MVP Routes */}
        <Route path="/mvp/retrieval" element={<RetrievalPage />} />
        <Route path="/mvp/analytics" element={<AnalyticsPage />} />

        {/* Part 1: Review Collection Engine Routes */}
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/reviews/google-play" element={<GooglePlayReviews />} />
        <Route path="/reviews/apple-app-store" element={<AppStoreReviews />} />
        <Route path="/reviews/reddit" element={<RedditReviews />} />
        <Route path="/reviews/google-photos-community" element={<CommunityReviews />} />
        <Route path="/reviews/youtube" element={<YouTubeReviews />} />
        <Route path="/reviews/forums" element={<ForumReviews />} />
        <Route path="/collection-jobs" element={<CollectionJobs />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
