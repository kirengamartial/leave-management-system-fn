import { useState } from 'react';
import LeaveTypeManagement from './LeaveTypeManagement';
import LeaveBalanceAdjustment from './LeaveBalanceAdjustment';
import LeaveReports from './LeaveReports';
import AllLeaves from './AllLeaves';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('all-leaves');

    const tabs = [
        {
            id: 'all-leaves', label: 'All Leaves', icon: (
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
            )
        },

        {
            id: 'balance-adjustment', label: 'Balance Adjustment', icon: (
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            id: 'reports', label: 'Reports', icon: (
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            )
        },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md">
                <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-blue-600">Leave Management</h2>
                </div>
                <div className="p-4">
                    <p className="text-sm text-gray-500 mb-4">Admin Portal</p>
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg
                                    ${activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }
                                `}
                            >
                                <span className={`mr-3 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'}`}>
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm">
                    <div className="px-6 py-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {tabs.find(tab => tab.id === activeTab)?.label}
                        </h1>
                    </div>
                </header>

                <main className="p-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        {activeTab === 'all-leaves' && <AllLeaves />}
                        {activeTab === 'balance-adjustment' && <LeaveBalanceAdjustment />}
                        {activeTab === 'reports' && <LeaveReports />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;