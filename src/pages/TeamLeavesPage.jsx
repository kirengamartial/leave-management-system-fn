import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchTeamLeaves, approveLeave, rejectLeave } from '../features/leave/leaveSlice';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const TeamLeavesPage = () => {
    const dispatch = useAppDispatch();
    const { teamLeaves, teamLoading, teamError } = useAppSelector((state) => state.leave);

    useEffect(() => {
        dispatch(fetchTeamLeaves());
    }, [dispatch]);

    const handleApprove = (leaveId) => {
        dispatch(approveLeave(leaveId)).then((action) => {
            if (action.type.endsWith('fulfilled')) {
                toast.success('Leave approved!');
                dispatch(fetchTeamLeaves());
            }
        });
    };

    const handleReject = (leaveId) => {
        dispatch(rejectLeave(leaveId)).then((action) => {
            if (action.type.endsWith('fulfilled')) {
                toast.success('Leave rejected!');
                dispatch(fetchTeamLeaves());
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <Navbar />
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mt-4">
                <h1 className="text-2xl font-bold text-indigo-700 mb-6">Team Leave Requests</h1>
                {teamLoading ? (
                    <div className="text-gray-500">Loading...</div>
                ) : teamError ? (
                    <div className="text-red-500 text-sm">{teamError}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-blue-100">
                                    <th className="px-4 py-2 text-left">User</th>
                                    <th className="px-4 py-2 text-left">Type</th>
                                    <th className="px-4 py-2 text-left">Start</th>
                                    <th className="px-4 py-2 text-left">End</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Reason</th>
                                    <th className="px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teamLeaves && teamLeaves.length > 0 ? (
                                    teamLeaves.map((leave) => (
                                        <tr key={leave.id} className="border-b">
                                            <td className="px-4 py-2">{leave.userName || leave.userId}</td>
                                            <td className="px-4 py-2 capitalize">{leave.leaveType?.toLowerCase()}</td>
                                            <td className="px-4 py-2">{leave.startDate?.slice(0, 10)}</td>
                                            <td className="px-4 py-2">{leave.endDate?.slice(0, 10)}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${leave.status === 'APPROVED' ? 'bg-green-100 text-green-700' : leave.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{leave.status}</span>
                                            </td>
                                            <td className="px-4 py-2">{leave.reason}</td>
                                            <td className="px-4 py-2 space-x-2">
                                                <button
                                                    onClick={() => handleApprove(leave.id)}
                                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                                                    disabled={leave.status === 'APPROVED'}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(leave.id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                                    disabled={leave.status === 'REJECTED'}
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center text-gray-400 py-4">No team leave requests found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamLeavesPage; 