import { useEffect, useState } from "react";
import api from "../../api/adminApi";

export default function Dashboard() {
  const [stats, setStats] = useState({ jobSeekers: 0, employers: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const jobSeekers = await api.fetchJobSeekers();
        const employers = await api.fetchEmployers();
        
        setStats({
          jobSeekers: jobSeekers.length,
          employers: employers.length,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 bg-blue-500 text-white rounded-lg">
          <h3 className="text-lg">Total Job Seekers</h3>
          <p className="text-3xl font-bold">{stats.jobSeekers}</p>
        </div>
        <div className="p-4 bg-green-500 text-white rounded-lg">
          <h3 className="text-lg">Total Employers</h3>
          <p className="text-3xl font-bold">{stats.employers}</p>
        </div>
      </div>
    </div>
  );
}
