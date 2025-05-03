import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const TeamLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchTeamLeaves();
    }, []);

    const fetchTeamLeaves = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/leaves/team`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch team leaves');
            const data = await response.json();
            setLeaves(data);
        } catch (error) {
            toast.error('Failed to load team leaves');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (leaveId, newStatus) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/leaves/${leaveId}/${newStatus.toLowerCase()}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) throw new Error('Failed to update status');

            toast.success(`Leave request ${newStatus.toLowerCase()}`);
            fetchTeamLeaves();
        } catch (error) {
            toast.error('Failed to update leave status');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Team Leave Requests</h2>

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

export default TeamLeaves; 