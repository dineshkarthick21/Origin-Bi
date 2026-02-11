import { useState } from 'react'
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
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">No users found. Click "Add User" to add some users.</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="action-buttons">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(user)}
                      title="Edit User"
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(user.id)}
                      title="Delete User"
                    >
                      Delete
                    </button>
                  </td>
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
