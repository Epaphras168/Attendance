import React, { useState, useEffect } from "react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import { supabase } from "../lib/supabaseClient";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const { students, classes, attendance } = useData();

  const [users, setUsers] = useState([]);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
    role: "teacher",
    phone: "",
    profile_img: "",
    class_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance.filter((record) => record.date === today);
  const presentToday = new Set(todayAttendance.map((record) => record.studentId)).size;

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (!error) setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (signupError) throw signupError;

      const { error: insertError } = await supabase.from("users").insert([
        {
          auth_id: signupData.user.id,
          username: formData.username || formData.email,
          email: formData.email,
          role: formData.role,
          name: formData.name,
          phone: formData.phone || null,
          profile_img: formData.profile_img || null,
          class_name: formData.class_id || null,
        },
      ]);
      if (insertError) throw insertError;

      setFormData({
        name: "",
        email: "",
        password: "",
        username: "",
        role: "teacher",
        phone: "",
        profile_img: "",
        class_id: "",
      });
      setShowCreateUser(false);
      fetchUsers();
      alert("User created successfully! They must confirm their email before logging in.");
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error: updateError } = await supabase
        .from("users")
        .update({
          name: formData.name,
          username: formData.username,
          role: formData.role,
          phone: formData.phone,
          profile_img: formData.profile_img,
          class_id: formData.role === "teacher" ? formData.class_id : null,
        })
        .eq("id", showEditUser.id);
      if (updateError) throw updateError;

      setShowEditUser(null);
      fetchUsers();
      alert("User updated successfully!");
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (!error) fetchUsers();
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 w-full max-w-full">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
      <p className="mt-1 text-sm sm:text-base text-gray-600">Welcome back, {currentUser.name}</p>

      {/* Create User */}
      <div className="mt-4">
        <Button onClick={() => setShowCreateUser(true)} variant="primary">+ Create User</Button>
      </div>

      {/* Create User Modal */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
              <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
              <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              <input name="profile_img" placeholder="Profile Image URL" value={formData.profile_img} onChange={handleChange} className="w-full px-3 py-2 border rounded" />

              <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>

              {formData.role === "teacher" && (
                <select name="class_id" value={formData.class_id} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.name}>{cls.name}</option>
                  ))}
                </select>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex flex-col sm:flex-row justify-end sm:space-x-2 space-y-2 sm:space-y-0">
                <Button type="button" variant="secondary" onClick={() => setShowCreateUser(false)}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={loading}>{loading ? "Creating..." : "Create User"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dashboard cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
            <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">{students.length}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Classes</dt>
            <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">{classes.length}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Students Present Today</dt>
            <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">{presentToday} / {students.length}</dd>
          </div>
        </div>
      </div>

      {/* Manage Users Table */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm sm:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border text-left">Name</th>
                <th className="px-4 py-2 border text-left">Email</th>
                <th className="px-4 py-2 border text-left">Role</th>
                <th className="px-4 py-2 border text-left">Class</th>
                <th className="px-4 py-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="text-center sm:text-left">
                  <td className="px-4 py-2 border">{user.name}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">{user.role}</td>
                  <td className="px-4 py-2 border">{user.class_name || "-"}</td>
                  <td className="px-4 py-2 border flex flex-col sm:flex-row justify-center sm:justify-start space-y-1 sm:space-y-0 sm:space-x-2">
                    <Button variant="secondary" onClick={() => { setFormData(user); setShowEditUser(user); }}>Edit</Button>
                    <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-2 border text-gray-500 text-center">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
