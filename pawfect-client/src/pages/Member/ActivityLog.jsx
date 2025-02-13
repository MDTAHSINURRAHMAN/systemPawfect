import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaEye } from 'react-icons/fa';

const ActivityLog = () => {
    const [applications, setApplications] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/trainer-applications/${user?.email}`);
                const data = await response.json();
                // Filter out approved applications
                const pendingAndRejectedApplications = data.filter(app => app.status !== 'approved');
                setApplications(pendingAndRejectedApplications);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching applications:', error);
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchApplications();
        }
    }, [user]);

    const handleViewFeedback = (feedback) => {
        setSelectedFeedback(feedback);
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-6 text-center">My Trainer Applications</h2>
            
            {applications.length === 0 ? (
                <p className="text-center text-gray-600">No pending or rejected applications found</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-base-200">
                                <th>Application Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((application) => (
                                <tr key={application._id}>
                                    <td>{new Date(application.appliedDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${
                                            application.status === 'pending' ? 'badge-warning' : 'badge-error'
                                        }`}>
                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                        </span>
                                    </td>
                                    <td>
                                        {application.status === 'rejected' && (
                                            <button 
                                                className="btn btn-ghost btn-sm"
                                                title="View Feedback"
                                                onClick={() => handleViewFeedback(application.feedback)}
                                            >
                                                <FaEye className="text-xl" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Feedback Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">Admin Feedback</h3>
                        <p className="text-gray-700">{selectedFeedback || "No feedback provided"}</p>
                        <button 
                            className="btn btn-primary mt-4"
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityLog;