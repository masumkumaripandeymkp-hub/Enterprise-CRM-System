import { useState, useEffect } from 'react';
import './Leads.css';

const API_URL = 'http://localhost:5000/api/activities';

function Activities() {
const [activities, setActivities] = useState([]);
const [title, setTitle] = useState('');
const [type, setType] = useState('Meeting');
const [relatedTo, setRelatedTo] = useState('');
const [date, setDate] = useState('');
const [notes, setNotes] = useState('');
const [status, setStatus] = useState('Pending');
const [search, setSearch] = useState('');
const [editId, setEditId] = useState(null);
const [loading, setLoading] = useState(false);

// Fetch activities from MongoDB
const fetchActivities = async () => {
    try {
        setLoading(true);

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch activities');
        }

        const data = await response.json();
        setActivities(data);

    } catch (error) {
        console.error('Fetch Error:', error);
        alert('Unable to load activities. Check backend server.');
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchActivities();
}, []);

// Clear form
const clearForm = () => {
    setTitle('');
    setType('Meeting');
    setRelatedTo('');
    setDate('');
    setNotes('');
    setStatus('Pending');
    setEditId(null);
};

// Add or Update Activity
const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !relatedTo.trim() || !date) {
        alert('Please fill all required fields');
        return;
    }

    const activityData = {
        title: title.trim(),
        type,
        relatedTo: relatedTo.trim(),
        date: new Date(date).toISOString(),
        notes: notes.trim(),
        status
    };

    try {
        const url = editId
            ? `${API_URL}/${editId}`
            : API_URL;

        const method = editId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(activityData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Operation failed');
        }

        alert(
            editId
                ? 'Activity updated successfully!'
                : 'Activity added successfully!'
        );

        clearForm();
        fetchActivities();

    } catch (error) {
        console.error('Submit Error:', error);
        alert(error.message || 'Unable to save activity');
    }
};

// Edit Activity
const handleEdit = (activity) => {
    setTitle(activity.title);
    setType(activity.type);
    setRelatedTo(activity.relatedTo);

    const localDate = new Date(activity.date);

    const formattedDate = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000
    )
        .toISOString()
        .slice(0, 16);

    setDate(formattedDate);
    setNotes(activity.notes || '');
    setStatus(activity.status);
    setEditId(activity._id);
};

// Delete Activity
const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Delete failed');
        }

        alert('Activity deleted successfully!');

        if (editId === id) {
            clearForm();
        }

        fetchActivities();

    } catch (error) {
        console.error('Delete Error:', error);
        alert(error.message || 'Unable to delete activity');
    }
};

// Search Activities
const filteredActivities = activities.filter((activity) =>
    `${activity.title} ${activity.type} ${activity.relatedTo} ${activity.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
);

// Completed Activities Count
const completedCount = activities.filter(
    (activity) => activity.status === 'Completed'
).length;

return (
    <div className="leads-page">

        <div className="leads-header">
            <h2>Activities Management</h2>

            <p>
                Manage meetings, calls, emails and follow-up activities.
            </p>

            <div className="total-leads-card">
                <h3>Total Activities</h3>
                <h2>{activities.length}</h2>
                <p>{completedCount} Completed</p>
            </div>
        </div>

        <form className="lead-form" onSubmit={handleSubmit}>

            <input
                type="text"
                placeholder="Activity Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
            >
                <option value="Meeting">Meeting</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Email">Email</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Other">Other</option>
            </select>

            <input
                type="text"
                placeholder="Related Customer / Lead"
                value={relatedTo}
                onChange={(e) => setRelatedTo(e.target.value)}
            />

            <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
            </select>

            <input
                type="text"
                placeholder="Notes (Optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />

            <button type="submit" disabled={loading}>
                {editId
                    ? 'Update Activity'
                    : '+ Add Activity'}
            </button>

            {editId && (
                <button type="button" onClick={clearForm}>
                    Cancel
                </button>
            )}

        </form>

        <input
            className="leads-search"
            type="text"
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        <div className="leads-table-container">

            <table className="leads-table">

                <thead>
                    <tr>
                        <th>Activity</th>
                        <th>Type</th>
                        <th>Related To</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {loading ? (
                        <tr>
                            <td colSpan="7">Loading activities...</td>
                        </tr>
                    ) : filteredActivities.length > 0 ? (

                        filteredActivities.map((activity) => (

                            <tr key={activity._id}>

                                <td>{activity.title}</td>
                                <td>{activity.type}</td>
                                <td>{activity.relatedTo}</td>

                                <td>
                                    {new Date(activity.date).toLocaleString()}
                                </td>

                                <td>
                                    <span className="status-badge">
                                        {activity.status}
                                    </span>
                                </td>

                                <td>{activity.notes || '-'}</td>

                                <td>
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(activity)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(activity._id)}
                                    >
                                        Delete
                                    </button>
                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>
                            <td colSpan="7">No activities found</td>
                        </tr>

                    )}

                </tbody>

            </table>

        </div>

    </div>
);

}

export default Activities;