"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string | null;
  user_metadata: any;
  created_at: string;
  last_sign_in_at: string | null;
};

const DashboardPage = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/sign-in');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch('/api/users');
          const json = await res.json();
          if (res.ok) {
            setUsers(json.users);
          } else {
            setError(json.error || 'Failed to fetch users');
          }
        } catch (err: any) {
          setError(err.message);
        }
        setLoading(false);
      };
      fetchUsers();
    }
  }, [user]);

  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      setError("Email and password are required to create a user.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newUserEmail, password: newUserPassword }),
      });
      const json = await res.json();
      if (res.ok) {
        setNewUserEmail('');
        setNewUserPassword('');
        setUsers((prev) => [...prev, json.user]);
      } else {
        setError(json.error || 'Failed to create user');
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });
      const json = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        setError(json.error || 'Failed to delete user');
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser.id,
          email: editingUser.email,
          user_metadata: editingUser.user_metadata,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setEditingUser(null);
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? editingUser : u))
        );
      } else {
        setError(json.error || 'Failed to update user');
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Create New User</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded flex-grow"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded flex-grow"
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleCreateUser}
            disabled={loading}
          >
            Create
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Email</th>
                <th className="border border-gray-300 p-2 text-left">Created At</th>
                <th className="border border-gray-300 p-2 text-left">Last Sign In</th>
                <th className="border border-gray-300 p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) =>
                editingUser && editingUser.id === user.id ? (
                  <tr key={user.id}>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="email"
                        value={editingUser.email || ""}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, email: e.target.value })
                        }
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">{user.created_at}</td>
                    <td className="border border-gray-300 p-2">
                      {user.last_sign_in_at || "Never"}
                    </td>
                    <td className="border border-gray-300 p-2 space-x-2">
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        onClick={handleSaveEdit}
                        disabled={loading}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                        onClick={handleCancelEdit}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={user.id}>
                    <td className="border border-gray-300 p-2">{user.email}</td>
                    <td className="border border-gray-300 p-2">{user.created_at}</td>
                    <td className="border border-gray-300 p-2">
                      {user.last_sign_in_at || "Never"}
                    </td>
                    <td className="border border-gray-300 p-2 space-x-2">
                      <button
                        className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
                        onClick={() => handleEditUser(user)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
};

export default DashboardPage;
