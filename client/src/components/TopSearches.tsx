import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TopSearches.css';

interface TopSearch {
  term: string;
  count: number;
}

const TopSearches: React.FC = () => {
  const [topSearches, setTopSearches] = useState<TopSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopSearches();
  }, []);

  const fetchTopSearches = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/top-searches`);
      setTopSearches(response.data);
    } catch (error) {
      console.error('Error fetching top searches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="top-searches-banner">
        <div className="banner-content">
          <span>Loading top searches...</span>
        </div>
      </div>
    );
  }

  if (topSearches.length === 0) {
    return (
      <div className="top-searches-banner">
        <div className="banner-content">
          <span className="banner-title">🔥 Top Searches:</span>
          <span className="no-searches">No searches yet. Be the first to search!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="top-searches-banner">
      <div className="banner-content">
        <span className="banner-title">🔥 Top Searches:</span>
        <div className="search-tags">
          {topSearches.map((search, index) => (
            <span key={index} className="search-tag">
              {search.term} <span className="search-count">({search.count})</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopSearches;
