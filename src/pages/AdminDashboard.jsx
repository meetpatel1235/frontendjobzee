import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({});

    useEffect(() => {
        axios.get('/api/admin/dashboard')
            .then(res => setStats(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Total Users: {stats.users}</p>
            <p>Total Jobs: {stats.jobs}</p>
            <p>Total Applications: {stats.applications}</p>
        </div>
    );
};

export default AdminDashboard;