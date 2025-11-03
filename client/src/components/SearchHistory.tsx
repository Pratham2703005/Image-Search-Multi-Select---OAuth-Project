import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/SearchHistory.css';

interface HistoryItem {
  term: string;
  timestamp: string;
}

interface User {
  id: string;
  displayName: string;
  email: string;
  photo: string;
  provider: string;
}

interface SearchHistoryProps {
  refresh: number;
  user?: User | null;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ refresh, user }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch history when a user is present
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }
    fetchHistory();
  }, [refresh, user]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/history', {
        withCredentials: true
      });
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="search-history">
        <h3>Your Search History</h3>
        <p className="loading-text">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="search-history">
      <h3>
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
        </svg>
        Your Search History
      </h3>
      {history.length === 0 ? (
        <p className="no-history">No search history yet. Start searching!</p>
      ) : (
        <ul className="history-list">
          {history.map((item, index) => (
            <li key={index} className="history-item">
              <span className="history-term">{item.term}</span>
              <span className="history-time">{formatDate(item.timestamp)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchHistory;
