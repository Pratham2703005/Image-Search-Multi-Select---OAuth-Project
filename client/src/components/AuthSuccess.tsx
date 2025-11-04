import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Make a request to verify the session cookie was set
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/user`,
          { withCredentials: true }
        );

        if (response.data?.user) {
          // Session is valid, redirect to home
          navigate('/', { replace: true });
        } else {
          // Session not found, redirect to home anyway
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        // Redirect to home even on error
        navigate('/', { replace: true });
      }
    };

    // Small delay to ensure cookie is set
    setTimeout(verifyAuth, 500);
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.2rem',
      color: '#666'
    }}>
      Completing sign in...
    </div>
  );
}
