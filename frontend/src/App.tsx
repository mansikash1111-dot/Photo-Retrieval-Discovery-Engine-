import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { LoginPage } from './pages/Auth/LoginPage';

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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Overview & Auth Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Part 5: AI-Native Photo Retrieval MVP Routes (Protected) */}
          <Route 
            path="/mvp/retrieval" 
            element={
              <ProtectedRoute>
                <RetrievalPage />
              </ProtectedRoute>
            } 
          />
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
    </AuthProvider>
  );
};

export default App;
