import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AllLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        employeeId: '',
        leaveTypeId: '',
    });
    const [employees, setEmployees] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);

    useEffect(() => {
        fetchLeaves();
        fetchEmployees();
        fetchLeaveTypes();
    }, [filters]);

    const fetchLeaves = async () => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/leaves/all?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch leaves');
            const data = await response.json();
            setLeaves(data);
        } catch (error) {
            toast.error('Failed to load leaves');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/leaves/admin/employees`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch employees');
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            toast.error('Failed to load employees');
        }
    };

    const fetchLeaveTypes = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/leaves/admin/types`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch leave types');
            const data = await response.json();
            setLeaveTypes(data);
        } catch (error) {
            toast.error('Failed to load leave types');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStatusChange = async (leaveId, newStatus) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/leaves/${leaveId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update status');

            toast.success(`Leave request ${newStatus.toLowerCase()}`);
            fetchLeaves();
        } catch (error) {
            toast.error('Failed to update leave status');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">All Leave Requests</h2>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Employee</label>
                        <select
                            name="employeeId"
                            value={filters.employeeId}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">All Employees</option>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                        <select
                            name="leaveTypeId"
                            value={filters.leaveTypeId}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">All Types</option>
                            {leaveTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Leaves Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center">Loading...</td>
                                </tr>
                            ) : leaves.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center">No leave requests found</td>
                                </tr>
                            ) : (
                                leaves.map((leave) => (
                                    <tr key={leave.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{leave.employeeName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{leave.leaveTypeName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(leave.startDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(leave.endDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{leave.days}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${leave.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    leave.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {leave.status === 'PENDING' && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleStatusChange(leave.id, 'APPROVED')}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(leave.id, 'REJECTED')}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllLeaves; 