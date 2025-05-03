import React from 'react';

const LeaveHistory = ({ history, loading, error }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Leave History</h3>
            {loading ? (
                <div className="text-gray-500">Loading...</div>
            ) : error ? (
                <div className="text-red-500 text-sm">{error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-blue-100">
                                <th className="px-4 py-2 text-left">Type</th>
                                <th className="px-4 py-2 text-left">Start</th>
                                <th className="px-4 py-2 text-left">End</th>
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-left">Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history && history.length > 0 ? (
                                history.map((leave) => (
                                    <tr key={leave.id} className="border-b">
                                        <td className="px-4 py-2 capitalize">{leave.leaveType?.toLowerCase()}</td>
                                        <td className="px-4 py-2">{leave.startDate?.slice(0, 10)}</td>
                                        <td className="px-4 py-2">{leave.endDate?.slice(0, 10)}</td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${leave.status === 'APPROVED' ? 'bg-green-100 text-green-700' : leave.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{leave.status}</span>
                                        </td>
                                        <td className="px-4 py-2">{leave.reason}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center text-gray-400 py-4">No leave history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LeaveHistory; 