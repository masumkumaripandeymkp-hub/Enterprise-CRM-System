import { useState, useEffect } from 'react';

function Customers() {
  const API_URL = 'http://localhost:5000/api/customers';

  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get customers from MongoDB
  const fetchCustomers = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Clear form
  const clearForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setEditId(null);
  };

  // Add or Update Customer
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert('Please fill all required fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      alert('Please enter a valid email address');
      return;
    }

    const customerData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim()
    };

    try {
      const response = await fetch(
        editId
          ? `${API_URL}/${editId}`
          : API_URL,
        {
          method: editId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(customerData)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      alert(
        editId
          ? 'Customer updated successfully!'
          : 'Customer added successfully!'
      );

      clearForm();
      fetchCustomers();

    } catch (error) {
      alert(error.message);
    }
  };

  // Edit Customer
  const handleEdit = (customer) => {
    setName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phone);
    setCompany(customer.company || '');
    setEditId(customer._id);
  };

  // Delete Customer
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this customer?'
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

      alert('Customer deleted successfully!');

      if (editId === id) {
        clearForm();
      }

      fetchCustomers();

    } catch (error) {
      alert(error.message);
    }
  };

  // Search Customers
  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.email} ${customer.phone} ${customer.company}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="leads-page">

      <div className="leads-header">
        <h2>Customers Management</h2>
        <p>Manage and organize your customers.</p>

        <div className="total-leads-card">
          <h3>Total Customers</h3>
          <h2>{customers.length}</h2>
          <p>Registered customers</p>
        </div>
      </div>

      {/* Customer Form */}
      <form className="lead-form" onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <button type="submit">
          {editId ? 'Update Customer' : '+ Add Customer'}
        </button>

        {editId && (
          <button type="button" onClick={clearForm}>
            Cancel
          </button>
        )}

      </form>

      {/* Search */}
      <input
        className="leads-search"
        type="text"
        placeholder="Search by name, email, phone or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Customer Table */}
      <div className="leads-table-container">

        <table className="leads-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Loading customers...</td>
              </tr>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.company || '-'}</td>

                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(customer)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(customer._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No customers found</td>
              </tr>
            )}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Customers;
