import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import ApplyLeaveForm from '../components/ApplyLeaveForm';
import LeaveBalance from '../components/LeaveBalance';
import LeaveHistory from '../components/LeaveHistory';
import { applyForLeave, fetchLeaveBalance, fetchLeaveHistory } from '../features/leave/leaveSlice';
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const leave = useAppSelector((state) => state.leave);

    useEffect(() => {
        dispatch(fetchLeaveBalance());
        dispatch(fetchLeaveHistory());
    }, [dispatch]);

    useEffect(() => {
        if (leave.applyError) {
            toast.error(leave.applyError);
        }
    }, [leave.applyError]);

    const handleApplyLeave = (formData) => {
        dispatch(applyForLeave(formData))
            .unwrap()
            .then(() => {
                toast.success('Leave application submitted successfully!');
                dispatch(fetchLeaveBalance());
                dispatch(fetchLeaveHistory());
            })
            .catch((error) => {
                console.error('Leave application error:', error);
            });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-blue-600">Welcome back, {user?.firstName || 'User'}!</h1>
                    <p className="mt-1 text-sm text-gray-600">Manage your leave applications and view your leave balance</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full">
                            <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Leave Balance
                            </h2>
                            <LeaveBalance
                                balance={leave.balance}
                                loading={leave.balanceLoading}
                                error={leave.balanceError}
                            />
                        </div>
                    </div>


                    <div className="col-span-1 lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Request Leave
                            </h2>
                            <ApplyLeaveForm
                                onSubmit={handleApplyLeave}
                                loading={leave.applyLoading}
                                error={leave.applyError}
                            />
                        </div>
                    </div>


                    <div className="col-span-1 lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                Leave History
                            </h2>
                            <LeaveHistory
                                history={leave.history}
                                loading={leave.historyLoading}
                                error={leave.historyError}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;