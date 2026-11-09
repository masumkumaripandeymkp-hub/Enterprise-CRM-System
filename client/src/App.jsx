
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Navbar from './Navbar';

import Leads from './components/Leads';
import Customers from './components/Customers';
import SalesPipeline from './components/SalesPipeline';
import Activities from './components/Activities';
import Reports from './components/Reports';

import Login from './components/Login';
import Register from './components/Register';

import './App.css';


// Dashboard Component
function Dashboard() {

    const [leads, setLeads] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [deals, setDeals] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch Dashboard Data from MongoDB
    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                setLoading(true);
                setError('');

                const [
                    leadsResponse,
                    customersResponse,
                    dealsResponse
                ] = await Promise.all([

                    fetch('http://localhost:5000/api/leads'),
                    fetch('http://localhost:5000/api/customers'),
                    fetch('http://localhost:5000/api/deals')

                ]);

                if (
                    !leadsResponse.ok ||
                    !customersResponse.ok ||
                    !dealsResponse.ok
                ) {
                    throw new Error('Unable to fetch dashboard data');
                }

                const leadsData = await leadsResponse.json();
                const customersData = await customersResponse.json();
                const dealsData = await dealsResponse.json();

                setLeads(leadsData);
                setCustomers(customersData);
                setDeals(dealsData);

            } catch (error) {

                console.error('Dashboard Error:', error);

                setError(
                    'Unable to load dashboard data. Please check backend.'
                );

            } finally {

                setLoading(false);

            }

        };

        fetchDashboardData();

    }, []);


    // Calculate Total Sales from Won Deals
    const totalSales = deals
        .filter(deal => deal.stage === 'Won')
        .reduce(
            (total, deal) => total + Number(deal.value || 0),
            0
        );


    // Calculate Pending Deals
    const pendingDeals = deals.filter(
        deal => deal.stage !== 'Won' && deal.stage !== 'Lost'
    ).length;


    // Get Latest 5 Leads
    const recentLeads = [...leads]
        .sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 5);


    // Currency Format
    const formatCurrency = (amount) => {

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);

    };


    
return (

    <>

        <section className="dashboard-cards">

            <div className="card">
                <h3>Total Leads</h3>
                <h1>{loading ? '...' : leads.length}</h1>
                <p>Leads available</p>
            </div>

            <div className="card">
                <h3>Total Customers</h3>
                <h1>{loading ? '...' : customers.length}</h1>
                <p>Registered customers</p>
            </div>

            <div className="card">
                <h3>Total Sales</h3>
                <h1>
                    {loading ? '...' : formatCurrency(totalSales)}
                </h1>
                <p>Total revenue from won deals</p>
            </div>

            <div className="card">
                <h3>Pending Deals</h3>
                <h1>{loading ? '...' : pendingDeals}</h1>
                <p>Deals in progress</p>
            </div>

        </section>


        <section className="recent-leads">

            <h2>Recent Leads</h2>

            {loading && <p>Loading leads...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && (

                <table>

                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {recentLeads.length > 0 ? (

                            recentLeads.map((lead) => (

                                <tr key={lead._id}>
                                    <td>{lead.name}</td>
                                    <td>{lead.email}</td>
                                    <td>{lead.status}</td>
                                </tr>

                            ))

                        ) : (

                            <tr>
                                <td colSpan="3">
                                    No leads available
                                </td>
                            </tr>

                        )}

                    </tbody>

                </table>

            )}

        </section>

    </>

);
}

// Main App Component
function App() {

    const token = localStorage.getItem('token');

    return (

        <Routes>

            <Route
                path="/login"
                element={
                    token
                        ? <Navigate to="/" replace />
                        : <Login />
                }
            />

            <Route
                path="/register"
                element={
                    token
                        ? <Navigate to="/" replace />
                        : <Register />
                }
            />

            <Route
                path="/*"
                element={

                    token ? (

                        <div className="crm-container">

                            <Sidebar />

                            <main className="main-content">

                                <Navbar />

                                <Routes>

                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/leads" element={<Leads />} />
                                    <Route path="/customers" element={<Customers />} />
                                    <Route path="/sales-pipeline" element={<SalesPipeline />} />
                                    <Route path="/activities" element={<Activities />} />
                                    <Route path="/reports" element={<Reports />} />

                                    <Route
                                        path="*"
                                        element={<Navigate to="/" replace />}
                                    />

                                </Routes>

                            </main>

                        </div>

                    ) : (

                        <Navigate to="/login" replace />

                    )

                }
            />

        </Routes>

    );

}

export default App;