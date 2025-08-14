"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash,
  Save,
  XCircle,
  PlusCircle,
} from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/../types_db";

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
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* User Management Section */}
      <section className="mb-8 p-6 bg-card border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-input bg-transparent px-4 py-2 rounded-md flex-grow"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-input bg-transparent px-4 py-2 rounded-md flex-grow"
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
          />
          <button
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center"
            onClick={handleCreateUser}
            disabled={loading}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Create
          </button>
        </div>
      </section>

      <section className="p-6 bg-card border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted">
                <tr>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Created At</th>
                  <th scope="col" className="px-6 py-3">Last Sign In</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) =>
                  editingUser && editingUser.id === user.id ? (
                    <tr key={user.id} className="border-b">
                      <td className="px-6 py-4">
                        <input
                          type="email"
                          value={editingUser.email || ""}
                          onChange={(e) =>
                            setEditingUser({ ...editingUser, email: e.target.value })
                          }
                          className="border border-input bg-transparent px-2 py-1 rounded-md w-full"
                        />
                      </td>
                      <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "Never"}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          className="text-primary p-1 rounded-md hover:bg-primary/10 transition-colors"
                          onClick={handleSaveEdit}
                          disabled={loading}
                        >
                          <Save className="h-5 w-5" />
                        </button>
                        <button
                          className="text-muted-foreground p-1 rounded-md hover:bg-muted/90 transition-colors"
                          onClick={handleCancelEdit}
                          disabled={loading}
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={user.id} className="border-b">
                      <td className="px-6 py-4 font-medium text-foreground">{user.email}</td>
                      <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "Never"}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          className="text-secondary-foreground p-1 rounded-md hover:bg-secondary/10 transition-colors"
                          onClick={() => handleEditUser(user)}
                          disabled={loading}
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          className="text-destructive p-1 rounded-md hover:bg-destructive/10 transition-colors"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={loading}
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default DashboardPage;
