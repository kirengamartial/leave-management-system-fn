import { useState } from 'react';
import LeaveTypeManagement from './LeaveTypeManagement';
import LeaveBalanceAdjustment from './LeaveBalanceAdjustment';
import LeaveReports from './LeaveReports';
import AllLeaves from './AllLeaves';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('all-leaves');

    const tabs = [
        { id: 'all-leaves', label: 'All Leaves' },
        { id: 'leave-types', label: 'Leave Types' },
        { id: 'balance-adjustment', label: 'Balance Adjustment' },
        { id: 'reports', label: 'Reports' },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'all-leaves' && <AllLeaves />}
                {activeTab === 'leave-types' && <LeaveTypeManagement />}
                {activeTab === 'balance-adjustment' && <LeaveBalanceAdjustment />}
                {activeTab === 'reports' && <LeaveReports />}
            </div>
        </div>
    );
};

export default AdminDashboard; 