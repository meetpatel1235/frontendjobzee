import { Link } from "react-router-dom";

export default function AdminNavbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <div>
        <Link to="/admin/dashboard" className="px-4 py-2">Dashboard</Link>
        <Link to="/admin/manage-jobseekers" className="px-4 py-2">Job Seekers</Link>
        <Link to="/admin/manage-employers" className="px-4 py-2">Employers</Link>
        <button 
          className="bg-red-500 px-4 py-2 rounded"
          onClick={() => {
            localStorage.removeItem("userRole");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
