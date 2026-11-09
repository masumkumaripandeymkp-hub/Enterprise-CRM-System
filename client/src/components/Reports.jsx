import { useEffect, useState } from 'react';
import './Leads.css';
import './Reports.css';

function Reports() {
const [leads, setLeads] = useState([]);
const [customers, setCustomers] = useState([]);
const [deals, setDeals] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
    const fetchReports = async () => {
        try {
            setLoading(true);
            setError('');

            const [leadsResponse, customersResponse, dealsResponse] =
                await Promise.all([
                    fetch('http://localhost:5000/api/leads'),
                    fetch('http://localhost:5000/api/customers'),
                    fetch('http://localhost:5000/api/deals')
                ]);

            if (!leadsResponse.ok || !customersResponse.ok || !dealsResponse.ok) {
                throw new Error('Unable to load report data.');
            }

            const leadsData = await leadsResponse.json();
            const customersData = await customersResponse.json();
            const dealsData = await dealsResponse.json();

            setLeads(leadsData);
            setCustomers(customersData);
            setDeals(dealsData);
        } catch (err) {
            console.error('Reports Error:', err);
            setError('Unable to load reports. Please check your backend server.');
        } finally {
            setLoading(false);
        }
    };

    fetchReports();
}, []);

const wonDeals = deals.filter((deal) => deal.stage === 'Won');

const totalRevenue = wonDeals.reduce(
    (total, deal) => total + Number(deal.value || 0),
    0
);

const salesData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));

    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    const monthlySales = deals
        .filter((deal) => {
            if (deal.stage !== 'Won' || !deal.createdAt) return false;

            const dealDate = new Date(deal.createdAt);

            return (
                dealDate.getMonth() === date.getMonth() &&
                dealDate.getFullYear() === year
            );
        })
        .reduce((total, deal) => total + Number(deal.value || 0), 0);

    return {
        month,
        year,
        sales: monthlySales
    };
});

const maxSales = Math.max(...salesData.map((item) => item.sales), 1);

const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);

if (loading) {
    return (
        <div className="leads-page reports-page">
            <h2>Loading Reports...</h2>
        </div>
    );
}

if (error) {
    return (
        <div className="leads-page reports-page">
            <h2>Reports & Analytics</h2>
            <p>{error}</p>
        </div>
    );
}

return (
    <div className="leads-page reports-page">

        <div className="leads-header">
            <h2>Reports & Analytics</h2>
            <p>Monitor business performance and sales activities.</p>
        </div>

        <div className="report-cards">

            <div className="report-card">
                <h3>Total Revenue</h3>
                <h2>{formatCurrency(totalRevenue)}</h2>
                <p>Revenue from won deals</p>
            </div>

            <div className="report-card">
                <h3>Total Leads</h3>
                <h2>{leads.length}</h2>
                <p>All registered leads</p>
            </div>

            <div className="report-card">
                <h3>Total Customers</h3>
                <h2>{customers.length}</h2>
                <p>All registered customers</p>
            </div>

            <div className="report-card">
                <h3>Deals Won</h3>
                <h2>{wonDeals.length}</h2>
                <p>Successfully completed deals</p>
            </div>

        </div>

        <div className="report-chart">
            <h3>Monthly Sales Report</h3>

            <div className="chart">

                {salesData.map((item) => (
                    <div
                        className="chart-column"
                        key={`${item.month}-${item.year}`}
                    >
                        <span>{formatCurrency(item.sales)}</span>

                        <div
                            className="chart-bar"
                            style={{
                                height: `${(item.sales / maxSales) * 180}px`
                            }}
                        />

                        <small>{item.month}</small>
                    </div>
                ))}

            </div>
        </div>

        <div className="report-table">
            <h3>Sales Performance</h3>

            <table className="leads-table">

                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Sales</th>
                        <th>Performance</th>
                    </tr>
                </thead>

                <tbody>
                    {salesData.map((item) => (
                        <tr key={`${item.month}-${item.year}`}>
                            <td>{item.month} {item.year}</td>

                            <td>{formatCurrency(item.sales)}</td>

                            <td>
                                {item.sales === 0
                                    ? 'No Sales'
                                    : item.sales >= totalRevenue / 6
                                        ? 'Good'
                                        : 'Average'}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>

    </div>
);

}

export default Reports;