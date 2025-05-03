import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const LeaveTypeManagement = () => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentType, setCurrentType] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        defaultDays: 0,
    });

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = currentType
                ? `${import.meta.env.VITE_API_BASE_URL}/api/v1/leaves/admin/types/${currentType.id}`
                : `${import.meta.env.VITE_API_BASE_URL}/api/v1/leaves/admin/types`;

            const response = await fetch(url, {
                method: currentType ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to save leave type');

            toast.success(`Leave type ${currentType ? 'updated' : 'created'} successfully`);
            setIsModalOpen(false);
            fetchLeaveTypes();
        } catch (error) {
            toast.error('Failed to save leave type');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this leave type?')) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/leaves/admin/types/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) throw new Error('Failed to delete leave type');

            toast.success('Leave type deleted successfully');
            fetchLeaveTypes();
        } catch (error) {
            toast.error('Failed to delete leave type');
        }
    };

    const openModal = (type = null) => {
        if (type) {
            setCurrentType(type);
            setFormData({
                name: type.name,
                description: type.description,
                defaultDays: type.defaultDays,
            });
        } else {
            setCurrentType(null);
            setFormData({
                name: '',
                description: '',
                defaultDays: 0,
            });
        }
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Leave Types</h2>
                <button
                    onClick={() => openModal()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    Add New Type
                </button>
            </div>

            {/* Leave Types Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default Days</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {leaveTypes.map((type) => (
                            <tr key={type.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{type.name}</td>
                                <td className="px-6 py-4">{type.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{type.defaultDays}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => openModal(type)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(type.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium mb-4">
                            {currentType ? 'Edit Leave Type' : 'Add Leave Type'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows="3"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Default Days</label>
                                <input
                                    type="number"
                                    value={formData.defaultDays}
                                    onChange={(e) => setFormData({ ...formData, defaultDays: parseInt(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                >
                                    {currentType ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveTypeManagement; 