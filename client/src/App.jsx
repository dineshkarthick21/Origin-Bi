import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingUserId, setEditingUserId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddUser = (e) => {
    e.preventDefault()
    console.log('Form submitted with data:', formData)
    
    if (formData.name && formData.email) {
      if (editingUserId) {
        // Update existing user
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === editingUserId 
              ? { ...user, name: formData.name, email: formData.email }
              : user
          )
        )
        setEditingUserId(null)
      } else {
        // Add new user
        const newUser = {
          id: Date.now(),
          name: formData.name,
          email: formData.email
        }
        
        setUsers(prevUsers => {
          const updatedUsers = [...prevUsers, newUser]
          return updatedUsers
        })
      }
      
      setFormData({ name: '', email: '' })
      setShowAddForm(false)
    } else {
      console.log('Form validation failed')
    }
  }

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email
    })
    setEditingUserId(user.id)
    setShowAddForm(true)
  }

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', email: '' })
    setEditingUserId(null)
    setShowAddForm(false)
  }

  // Define columns for react-table
  const columns = useMemo(
    () => [
      {
        accessorKey: 'sno',
        header: 'S.No',
        cell: ({ row }) => row.index + 1,
        size: 80,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ getValue }) => getValue(),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ getValue }) => getValue(),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="action-buttons">
            <button 
              className="edit-btn"
              onClick={() => handleEdit(row.original)}
              title="Edit User"
            >
              Edit
            </button>
            <button 
              className="delete-btn"
              onClick={() => handleDelete(row.original.id)}
              title="Delete User"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // Create table instance
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="user-list-container">
      <h1>User List</h1>
      
      <div className="table-container">
        <div className="table-header">
          <button 
            className="add-button"
            onClick={() => setShowAddForm(true)}
          >
            Add User
          </button>
        </div>
        
        <table className="user-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="no-data">
                  No users found. Click "Add User" to add some users.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingUserId ? 'Edit User' : 'Add New User'}</h3>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-button">
                  {editingUserId ? 'Update User' : 'Add User'}
                </button>
                <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
