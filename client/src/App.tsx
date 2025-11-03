import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import TopSearches from './components/TopSearches';
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';
import SearchHistory from './components/SearchHistory';
import LoginPanel from './components/LoginPanel';
import './App.css';

interface User {
  id: string;
  displayName: string;
  email: string;
  photo: string;
  provider: string;
}

interface Image {
  id: string;
  url: string;
  thumb: string;
  description: string;
  photographer: string;
  photographerUrl: string;
}

interface SearchResult {
  term: string;
  total: number;
  results: Image[];
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [showLoginPanel, setShowLoginPanel] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/user`, {
        withCredentials: true
      });
      if (response.data?.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    if (!user) {
      setShowLoginPanel(true);
      return;
    }
    
    setSearching(true);
    setSelectedImages(new Set());
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/search`,
        { term },
        { withCredentials: true }
      );
      setSearchResult(response.data);
      setHistoryRefresh(prev => prev + 1);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search images. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`, {
        withCredentials: true
      });
      setUser(null);
      setSearchResult(null);
      setSelectedImages(new Set());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleSelectImage = (id: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="app">
      <Header 
        user={user} 
        onLogout={handleLogout}
        onLoginClick={() => setShowLoginPanel(true)}
      />
      <TopSearches />
      
      <main className="main-content">
        <div className="search-section">
          <SearchBar onSearch={handleSearch} loading={searching} />
          
          {searchResult && user && (
            <div className="results-section">
              <div className="results-header">
                <h2>
                  You searched for "{searchResult.term}" — {searchResult.total} results
                </h2>
                {selectedImages.size > 0 && (
                  <div className="selection-counter">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    Selected: {selectedImages.size} {selectedImages.size === 1 ? 'image' : 'images'}
                  </div>
                )}
              </div>
              
              <ImageGrid 
                images={searchResult.results}
                selectedImages={selectedImages}
                onToggleSelect={toggleSelectImage}
              />
            </div>
          )}

          {!searchResult && !searching && (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" width="64" height="64">
                <path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              <h3>Start Searching</h3>
              <p>Enter a search term above to discover amazing images</p>
            </div>
          )}
        </div>

        {user && (
          <aside className="sidebar">
            <SearchHistory refresh={historyRefresh} user={user} />
          </aside>
        )}
      </main>

      {showLoginPanel && (
        <LoginPanel onClose={() => setShowLoginPanel(false)} />
      )}
    </div>
  )
}
export default App
