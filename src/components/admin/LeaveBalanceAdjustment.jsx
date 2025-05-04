import { useState, useEffect } from 'react';
import { ClipboardEdit, RefreshCw, Check, AlertCircle } from 'lucide-react';

const LeaveBalanceAdjustment = () => {
    const [employees, setEmployees] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [adjustmentAmount, setAdjustmentAmount] = useState(0);
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetchEmployees();
        fetchLeaveTypes();
    }, []);

    const fetchEmployees = async () => {
        setIsLoading(true);
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
            showToast('Failed to load employees', 'error');
        } finally {
            setIsLoading(false);
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
            showToast('Failed to load leave types', 'error');
        }
    };

    const showToast = (message, type = 'success') => {
        // This is a placeholder for toast functionality
        console.log(`${type}: ${message}`);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!selectedEmployee || !selectedType) {
            showToast('Please select both employee and leave type', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/leaves/admin/balance/adjust`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    employeeId: selectedEmployee,
                    leaveTypeId: selectedType,
                    adjustmentAmount,
                    reason,
                }),
            });

            if (!response.ok) throw new Error('Failed to adjust balance');

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);

            // Reset form
            setSelectedEmployee('');
            setSelectedType('');
            setAdjustmentAmount(0);
            setReason('');
        } catch (error) {
            showToast('Failed to adjust leave balance', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedEmployee('');
        setSelectedType('');
        setAdjustmentAmount(0);
        setReason('');
    };

    return (
        <div className="max-w-4xl mx-auto">
            {showSuccess && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                    <Check className="text-green-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
                    <div>
                        <h3 className="font-medium text-green-800">Success!</h3>
                        <p className="text-green-700 text-sm mt-1">The leave balance has been adjusted successfully.</p>
                    </div>
                </div>
            )}

            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-t-xl p-6 shadow-lg">
                <div className="flex items-center">
                    <div className="bg-white/20 p-3 rounded-lg mr-4">
                        <ClipboardEdit className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Leave Balance Adjustment</h2>
                        <p className="text-indigo-100 mt-1">Manage employee leave allocation</p>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-xl rounded-b-xl p-8 border border-gray-100">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Employee</label>
                            <div className="relative">
                                <select
                                    value={selectedEmployee}
                                    onChange={(e) => setSelectedEmployee(e.target.value)}
                                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                                    disabled={isLoading}
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map((employee) => (
                                        <option key={employee.id} value={employee.id}>
                                            {employee.name} ({employee.email})
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                            <div className="relative">
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                                    disabled={isLoading}
                                >
                                    <option value="">Select Leave Type</option>
                                    {leaveTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Adjustment Amount</label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <input
                                type="number"
                                value={adjustmentAmount}
                                onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                                className="block w-full rounded-lg border border-gray-300 pl-4 pr-16 py-3 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-gray-700"
                                placeholder="0"
                                disabled={isLoading}
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <span className="text-gray-500">days</span>
                            </div>
                        </div>
                        <div className="flex items-center mt-2">
                            <AlertCircle size={16} className="text-indigo-500 mr-2" />
                            <p className="text-sm text-gray-600">
                                Use positive numbers to add days, negative to subtract
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Reason for Adjustment</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows="4"
                            className="w-full rounded-lg border border-gray-300 p-4 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-gray-700"
                            placeholder="Please provide a reason for this adjustment..."
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleReset}
                            className="mr-4 px-5 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                            disabled={isLoading}
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex items-center justify-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="animate-spin mr-2" size={18} />
                                    Processing...
                                </>
                            ) : (
                                'Adjust Balance'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveBalanceAdjustment;