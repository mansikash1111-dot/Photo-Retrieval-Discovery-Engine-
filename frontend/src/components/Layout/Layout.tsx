import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { StatsResponse } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  stats?: StatsResponse;
  isDemoActive?: boolean;
  onSeedDemo?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  stats,
  isDemoActive = false,
  onSeedDemo
}) => {
  return (
    <div className="app-container">
      <Sidebar stats={stats} />
      
      <div className="main-content">
        <Header 
          title={title} 
          isDemoActive={isDemoActive} 
          onSeedDemo={onSeedDemo}
        />

        <main className="page-container">
          {children}
        </main>
      </div>
    </div>
  );
};
