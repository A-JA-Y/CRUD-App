"use client"

import { useState, useEffect } from 'react'
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [newUser, setNewUser] = useState({ name: '', email: '' })
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const createUser = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      const data = await response.json()
      setUsers([...users, { ...data, id: users.length + 1 }])
      setNewUser({ name: '', email: '' })
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  const updateUser = async () => {
    if (!editingUser) return
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${editingUser.id}`, {
        method: 'PUT',
        body: JSON.stringify(editingUser),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      const data = await response.json()
      setUsers(users.map(user => user.id === editingUser.id ? { ...user, ...data } : user))
      setEditingUser(null)
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const deleteUser = async (id) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'DELETE',
      })
      setUsers(users.filter(user => user.id !== id))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleEditClick = (user) => {
    setEditingUser({ ...user })
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
  }

  return (
    

    <div className="container mx-auto   p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Add New User</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border rounded px-2 py-1 flex-grow"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border rounded px-2 py-1 flex-grow"
          />
          <button
            onClick={createUser}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add User
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white text-black">
        <thead>
          <tr>
            <th className="text-left py-2 px-3 bg-gray-100 font-semibold text-gray-600 border-b border-gray-200">Name</th>
            <th className="text-left py-2 px-3 bg-gray-100 font-semibold text-gray-600 border-b border-gray-200">Email</th>
            <th className="text-left py-2 px-3 bg-gray-100 font-semibold text-gray-600 border-b border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-3">
                {editingUser?.id === user.id ? (
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  user.name
                )}
              </td>
              <td className="py-2 px-3">
                {editingUser?.id === user.id ? (
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="py-2 px-3">
                {editingUser?.id === user.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={updateUser}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  )
}