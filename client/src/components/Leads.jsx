import { useState, useEffect } from 'react';
import './Leads.css';

function Leads() {
  const API_URL = 'http://localhost:5000/api/leads';

  const [leads, setLeads] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('New');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get all leads from MongoDB
  const fetchLeads = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }

      const data = await response.json();
      setLeads(data);

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Clear form
  const clearForm = () => {
    setName('');
    setEmail('');
    setStatus('New');
    setEditId(null);
  };

  // Add or Update Lead
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert('Please enter name and email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      alert('Please enter a valid email address');
      return;
    }

    const leadData = {
      name: name.trim(),
      email: email.trim(),
      status
    };

    try {
      const response = await fetch(
        editId ? `${API_URL}/${editId}` : API_URL,
        {
          method: editId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(leadData)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      alert(
        editId
          ? 'Lead updated successfully!'
          : 'Lead added successfully!'
      );

      clearForm();
      await fetchLeads();

    } catch (error) {
      alert(error.message);
    }
  };

  // Edit Lead
  const handleEdit = (lead) => {
    setName(lead.name);
    setEmail(lead.email);
    setStatus(lead.status);
    setEditId(lead._id);
  };

  // Delete Lead
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this lead?'
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Delete failed');
      }

      alert('Lead deleted successfully!');

      if (editId === id) {
        clearForm();
      }

      await fetchLeads();

    } catch (error) {
      alert(error.message);
    }
  };

  // Search Leads
  const filteredLeads = leads.filter((lead) =>
    `${lead.name} ${lead.email} ${lead.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="leads-page">

      {/* Page Heading */}
      <div className="leads-header">
        <h2>Leads Management</h2>
        <p>Manage your business leads here.</p>

        <div className="total-leads-card">
          <h3>Total Leads</h3>
          <h2>{leads.length}</h2>
          <p>Registered leads</p>
        </div>
      </div>

      {/* Add or Update Lead Form */}
      <form className="lead-form" onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Won">Won</option>
        </select>

        <button type="submit">
          {editId ? 'Update Lead' : '+ Add Lead'}
        </button>

        {editId && (
          <button type="button" onClick={clearForm}>
            Cancel
          </button>
        )}

      </form>

      {/* Search Input */}
      <input
        className="leads-search"
        type="text"
        placeholder="Search by name, email or status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Leads Table */}
      <div className="leads-table-container">

        <table className="leads-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">Loading leads...</td>
              </tr>
            ) : filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr key={lead._id}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.status}</td>

                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(lead)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(lead._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No leads found</td>
              </tr>
            )}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Leads;