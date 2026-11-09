import { useState, useEffect } from 'react';
import './SalesPipeline.css';

const API_URL = 'http://localhost:5000/api/deals';

function SalesPipeline() {
const [deals, setDeals] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState('');
const [editingId, setEditingId] = useState(null);

const [formData, setFormData] = useState({
    title: '',
    customerName: '',
    value: '',
    stage: 'New',
    expectedCloseDate: '',
    description: ''
});

const stages = [
    'New',
    'Qualified',
    'Proposal',
    'Negotiation',
    'Won',
    'Lost'
];

// 1. Fetch All Deals
const fetchDeals = async () => {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch deals');
        }

        const data = await response.json();
        setDeals(data);

    } catch (error) {
        console.error('Error fetching deals:', error);
        alert('Unable to load deals. Please check your backend server.');
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchDeals();
}, []);

// 2. Handle Form Input
const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
        ...formData,
        [name]: value
    });
};

// 3. Add or Update Deal
const handleSubmit = async (e) => {
    e.preventDefault();

    if (
        !formData.title.trim() ||
        !formData.customerName.trim() ||
        formData.value === '' ||
        Number(formData.value) < 0
    ) {
        alert('Please enter valid deal details.');
        return;
    }

    const dealData = {
        ...formData,
        value: Number(formData.value),
        expectedCloseDate: formData.expectedCloseDate || null
    };

    try {
        const url = editingId
            ? `${API_URL}/${editingId}`
            : API_URL;

        const response = await fetch(url, {
            method: editingId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dealData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Unable to save deal');
        }

        alert(
            editingId
                ? 'Deal updated successfully!'
                : 'Deal added successfully!'
        );

        resetForm();
        fetchDeals();

    } catch (error) {
        console.error('Error saving deal:', error);
        alert(error.message);
    }
};

// 4. Edit Deal
const handleEdit = (deal) => {
    setEditingId(deal._id);

    setFormData({
        title: deal.title,
        customerName: deal.customerName,
        value: deal.value,
        stage: deal.stage,
        expectedCloseDate: deal.expectedCloseDate
            ? deal.expectedCloseDate.substring(0, 10)
            : '',
        description: deal.description || ''
    });

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// 5. Delete Deal
const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
        'Are you sure you want to delete this deal?'
    );

    if (!confirmDelete) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Unable to delete deal');
        }

        alert('Deal deleted successfully!');
        fetchDeals();

    } catch (error) {
        console.error('Error deleting deal:', error);
        alert(error.message);
    }
};

// 6. Update Deal Stage
const handleStageChange = async (deal, newStage) => {
    try {
        const response = await fetch(`${API_URL}/${deal._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                stage: newStage
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Unable to update stage');
        }

        fetchDeals();

    } catch (error) {
        console.error('Error updating stage:', error);
        alert(error.message);
    }
};

// 7. Reset Form
const resetForm = () => {
    setEditingId(null);

    setFormData({
        title: '',
        customerName: '',
        value: '',
        stage: 'New',
        expectedCloseDate: '',
        description: ''
    });
};

// 8. Search Deals
const filteredDeals = deals.filter((deal) =>
    deal.title.toLowerCase().includes(search.toLowerCase()) ||
    deal.customerName.toLowerCase().includes(search.toLowerCase()) ||
    deal.stage.toLowerCase().includes(search.toLowerCase())
);

// 9. Calculate Total Deal Value
const totalDealValue = deals.reduce(
    (total, deal) => total + Number(deal.value || 0),
    0
);

// 10. Calculate Won Deals
const wonDeals = deals.filter(
    (deal) => deal.stage === 'Won'
).length;

return (
    <div className="pipeline-page">

        <div className="pipeline-header">
            <div>
                <h2>Sales Pipeline</h2>
                <p>Track and manage your business deals.</p>
            </div>
        </div>

        {/* Summary Cards */}
        <div className="pipeline-summary">

            <div className="pipeline-card">
                <h3>Total Deals</h3>
                <h2>{deals.length}</h2>
            </div>

            <div className="pipeline-card">
                <h3>Total Deal Value</h3>
                <h2>₹{totalDealValue.toLocaleString('en-IN')}</h2>
            </div>

            <div className="pipeline-card">
                <h3>Won Deals</h3>
                <h2>{wonDeals}</h2>
            </div>

        </div>

        {/* Add Deal Form */}
        <div className="pipeline-form-container">

            <h3>{editingId ? 'Edit Deal' : 'Add New Deal'}</h3>

            <form className="pipeline-form" onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="title"
                    placeholder="Deal Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="customerName"
                    placeholder="Customer Name"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="value"
                    placeholder="Deal Value (₹)"
                    value={formData.value}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                >
                    {stages.map((stage) => (
                        <option key={stage} value={stage}>
                            {stage}
                        </option>
                    ))}
                </select>

                <label className="pipeline-date-label">
                    Expected Close Date
                    <input
                        type="date"
                        name="expectedCloseDate"
                        value={formData.expectedCloseDate}
                        onChange={handleChange}
                    />
                </label>

                <textarea
                    name="description"
                    placeholder="Deal Description"
                    value={formData.description}
                    onChange={handleChange}
                />

                <div className="pipeline-form-buttons">

                    <button type="submit">
                        {editingId ? 'Update Deal' : '+ Add Deal'}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            className="cancel-deal-btn"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>
                    )}

                </div>

            </form>
        </div>

        {/* Deals List */}
        <div className="pipeline-list-container">

            <div className="pipeline-list-header">
                <h3>All Deals</h3>

                <input
                    type="text"
                    placeholder="Search deals..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <p>Loading deals...</p>
            ) : (

                <div className="pipeline-table-container">

                    <table className="pipeline-table">

                        <thead>
                            <tr>
                                <th>Deal Title</th>
                                <th>Customer</th>
                                <th>Value</th>
                                <th>Stage</th>
                                <th>Expected Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredDeals.length > 0 ? (

                                filteredDeals.map((deal) => (

                                    <tr key={deal._id}>

                                        <td>{deal.title}</td>

                                        <td>{deal.customerName}</td>

                                        <td>
                                            ₹{Number(deal.value).toLocaleString('en-IN')}
                                        </td>

                                        <td>
                                            <select
                                                value={deal.stage}
                                                onChange={(e) =>
                                                    handleStageChange(
                                                        deal,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                {stages.map((stage) => (
                                                    <option
                                                        key={stage}
                                                        value={stage}
                                                    >
                                                        {stage}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        <td>
                                            {deal.expectedCloseDate
                                                ? new Date(
                                                    deal.expectedCloseDate
                                                ).toLocaleDateString('en-IN')
                                                : 'Not set'}
                                        </td>

                                        <td>
                                            <button
                                                className="edit-deal-btn"
                                                onClick={() => handleEdit(deal)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-deal-btn"
                                                onClick={() =>
                                                    handleDelete(deal._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td colSpan="6">
                                        No deals found.
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    </div>
);

}

export default SalesPipeline;