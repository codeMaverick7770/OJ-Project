import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
      {user ? (
        <div className="glass p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
          <h2 className="text-xl font-semibold mb-2">Welcome, {user.name} 👋</h2>
          <p className="text-sm text-gray-300 mb-1"><strong>Email:</strong> {user.email}</p>
          <p className="text-sm text-gray-300"><strong>Role:</strong> {user.role}</p>
        </div>
      ) : (
        <p className="text-red-400">No user data found.</p>
      )}
    </div>
  );
}
