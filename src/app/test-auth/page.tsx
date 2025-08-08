"use client";

import { useState } from "react";

export default function TestAuthPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
      const url = `${API_BASE_URL}/api/auth/login`;
      
      console.log('Testing auth with URL:', url);
      console.log('NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'bruceoz@gmail.com',
          password: 'admin123'
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const text = await response.text();
      console.log('Response text:', text);
      
      try {
        const data = JSON.parse(text);
        setResult(data);
      } catch (e) {
        setError({ message: 'Invalid JSON response', responseText: text });
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError({ message: err.message, stack: err.stack });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      
      <div className="mb-4">
        <p><strong>NEXT_PUBLIC_BACKEND_URL:</strong> {process.env.NEXT_PUBLIC_BACKEND_URL || 'Not set'}</p>
        <p><strong>Expected URL:</strong> {(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001') + '/api/auth/login'}</p>
      </div>

      <button
        onClick={testAuth}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Auth'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
          <h3 className="font-bold text-red-700">Error:</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
          <h3 className="font-bold text-green-700">Success:</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}