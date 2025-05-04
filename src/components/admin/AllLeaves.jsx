import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes, FaComment } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const AllLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false); // New state for modal action loading
    const [filters, setFilters] = useState({
        status: '',
        leaveType: '',
    });
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [comment, setComment] = useState('');
    const [actionType, setActionType] = useState(''); // 'APPROVE' or 'REJECT'
    const { token } = useSelector(state => state.auth)

    const leaveTypes = [
        { value: '', label: 'Select Leave Type' },
        { value: 'ANNUAL', label: 'Annual Leave' },
        { value: 'SICK', label: 'Sick Leave' },
        { value: 'MATERNITY', label: 'Maternity Leave' },
        { value: 'PATERNITY', label: 'Paternity Leave' },
        { value: 'BEREAVEMENT', label: 'Bereavement Leave' },
        { value: 'UNPAID', label: 'Unpaid Leave' },
        { value: 'STUDY', label: 'Study Leave' },
        { value: 'PERSONAL', label: 'Personal Leave' },
    ];

    useEffect(() => {
        fetchLeaves();
    }, [filters]);

    const fetchLeaves = async () => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.leaveType) queryParams.append('leaveType', filters.leaveType);
            if (filters.status) queryParams.append('status', filters.status);

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/leaves/all?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
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

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const openCommentModal = (leave, action) => {
        setSelectedLeave(leave);
        setActionType(action);
        setComment('');
        setShowCommentModal(true);
    };

    const handleStatusChange = async () => {
        setIsActionLoading(true); // Start loading state
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/leaves/${selectedLeave.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: actionType,
                    comment: comment
                }),
            });

            if (!response.ok) throw new Error('Failed to update status');

            toast.success(`Leave request ${actionType === 'APPROVED' ? 'approved' : 'rejected'}`);
            setShowCommentModal(false);
            fetchLeaves();
        } catch (error) {
            toast.error('Failed to update leave status');
        } finally {
            setIsActionLoading(false); // End loading state
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Leave Type</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                </svg>
                            </div>
                            <select
                                name="leaveType"
                                value={filters.leaveType}
                                onChange={handleFilterChange}
                                className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600 bg-white"
                            >
                                {leaveTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600 bg-white"
                            >
                                <option value="">All Statuses</option>
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leaves Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center">
                                    <div className="flex justify-center">
                                        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                </td>
                            </tr>
                        ) : leaves.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No leave requests found</td>
                            </tr>
                        ) : (
                            leaves.map((leave) => (
                                <tr key={leave.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{leave.employeeName}</span>
                                            <span className="text-sm text-gray-500">{leave.employeeEmail}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-700">{leave.leaveType}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-gray-700">From: <span className="font-medium">{formatDate(leave.startDate)}</span></span>
                                            <span className="text-gray-700">To: <span className="font-medium">{formatDate(leave.endDate)}</span></span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-medium ${leave.days < 0 ? 'text-red-600' : leave.days > 20 ? 'text-orange-600' : 'text-gray-900'}`}>
                                            {leave.days}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-700 max-w-xs truncate">{leave.reason}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {leave.status === 'PENDING' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openCommentModal(leave, 'APPROVED')}
                                                    className="p-2 text-green-600 hover:text-green-800 focus:outline-none"
                                                    title="Approve"
                                                >
                                                    <FaCheck className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => openCommentModal(leave, 'REJECTED')}
                                                    className="p-2 text-red-600 hover:text-red-800 focus:outline-none"
                                                    title="Reject"
                                                >
                                                    <FaTimes className="h-5 w-5" />
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

            {/* Improved Comment Modal */}
            {showCommentModal && selectedLeave && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="relative p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
                        <div className="mt-2">
                            <h3 className="text-xl font-medium text-gray-900 mb-4">
                                {actionType === 'APPROVED' ? 'Approve' : 'Reject'} Leave Request
                            </h3>
                            <div className="mt-4">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Enter your comment (optional)..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    rows="4"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowCommentModal(false)}
                                    className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 font-medium"
                                    disabled={isActionLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStatusChange}
                                    disabled={isActionLoading}
                                    className={`px-5 py-2.5 text-white rounded-lg focus:outline-none focus:ring-2 font-medium flex items-center justify-center min-w-[100px] ${actionType === 'APPROVED'
                                        ? 'bg-green-500 hover:bg-green-600 focus:ring-green-400'
                                        : 'bg-red-500 hover:bg-red-600 focus:ring-red-400'
                                        }`}
                                >
                                    {isActionLoading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        actionType === 'APPROVED' ? 'Approve' : 'Reject'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllLeaves;