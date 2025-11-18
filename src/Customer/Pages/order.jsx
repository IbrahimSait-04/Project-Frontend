import React, { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Package, Clock, CheckCircle, XCircle, Utensils, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderDetailModal = ({ order, onClose }) => {
 
    if (!order) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all border-t-4 border-orange-500">
                <div className="p-6">
                    <h3 className="text-2xl font-bold text-orange-700 mb-4 flex items-center">
                        <Utensils className="mr-2" /> Order Details
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Order ID: <span className="font-mono text-gray-700">{order._id.slice(-8)}</span>
                    </p>
                    
                    <div className="space-y-2 mb-6">
                        <p><strong>Type:</strong> {order.type ? (order.type.charAt(0).toUpperCase() + order.type.slice(1)) : 'N/A'}</p>
                        <p><strong>Payment:</strong> {order.method ? (order.method.charAt(0).toUpperCase() + order.method.slice(1)) : 'N/A'}</p>
                        <p>
                            <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>

                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Items ({order.items?.length || 0})</h4>
                    <ul className="space-y-3">
                        {order.items?.map((item, index) => (
                            <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-700">{item.product?.name || 'Unknown Item'}</span>
                                <span className="text-sm text-gray-600">
                                    {item.quantity} x ₹{item.product?.price || '0.00'}
                                </span>
                            </li>
                        ))}
                        {(!order.items || order.items.length === 0) && (
                            <li className="text-gray-500 text-center py-2">No items listed.</li>
                        )}
                    </ul>

                    <div className="mt-6 pt-4 border-t border-orange-200">
                        <p className="text-xl font-bold text-orange-600 flex justify-between">
                            Total Amount: <span className="text-2xl">₹{order.totalAmount?.toFixed(2) || '0.00'}</span>
                        </p>
                    </div>

                </div>
                <div className="px-6 pb-6">
                    <button
                        onClick={onClose}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg transition duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};


const CustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderFilter, setOrderFilter] = useState("current");
    const [selectedOrder, setSelectedOrder] = useState(null); 

    const token = localStorage.getItem("customerToken");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            toast.error("Please login to view orders");
            navigate("/login");
            return;
        }
        fetchOrders();
    }, [token, navigate]); 

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get("/orders/my-orders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(res.data.orders || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch orders. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const CURRENT_STATUSES = useMemo(() => ["pending", "confirmed"], []);
    const PAST_STATUSES = useMemo(() => ["completed", "cancelled"], []);
    
    const isPastOrder = (order) => {
        const status = order.status ? order.status.toLowerCase() : '';
        return PAST_STATUSES.includes(status);
    };

    const handleViewDetails = (order) => {
        if (isPastOrder(order)) {
            toast.info("Order details are restricted for past transactions.");
            setSelectedOrder(null); 
        } else {
            setSelectedOrder(order);
        }
    };


    const getStatusStyles = (status) => {
        const lowerStatus = status.toLowerCase();
        switch (lowerStatus) {
            case "pending":
                return "text-yellow-700 bg-yellow-100 border border-yellow-300";
            case "confirmed": 
                return "text-blue-700 bg-blue-100 border border-blue-300";
            case "completed": 
                return "text-green-700 bg-green-100 border border-green-300";
            case "cancelled":
                return "text-red-700 bg-red-100 border border-red-300";
            default:
                return "text-gray-700 bg-gray-100 border border-gray-300";
        }
    };

    const getStatusIcon = (status) => {
        const lowerStatus = status.toLowerCase();
        switch (lowerStatus) {
            case "pending":
                return <Clock size={18} className="text-yellow-600" />;
            case "confirmed":
                return <Package size={18} className="text-blue-600" />;
            case "completed":
                return <CheckCircle size={18} className="text-green-600" />;
            case "cancelled":
                return <XCircle size={18} className="text-red-600" />;
            default:
                return <Clock size={18} />;
        }
    };

    const formattedStatus = (status) => {
        if (!status) return 'Unknown';
        const s = status.toLowerCase();
        return s.charAt(0).toUpperCase() + s.slice(1);
    };
    
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const status = order.status ? order.status.toLowerCase() : '';
            if (orderFilter === 'current') {
                return CURRENT_STATUSES.includes(status);
            } else {
                return PAST_STATUSES.includes(status);
            }
        });
    }, [orders, orderFilter, CURRENT_STATUSES, PAST_STATUSES]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-4 md:p-6">
            
            <h1 className="text-3xl font-extrabold text-orange-700 mb-6 flex items-center gap-2">
                🍽️ My Orders
            </h1>
            
            <div className="bg-white shadow-2xl rounded-2xl p-4 border border-orange-200">
                
                <div className="flex justify-start mb-4 space-x-3 border-b pb-3">
                    <button
                        onClick={() => setOrderFilter('current')}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
                            orderFilter === 'current'
                                ? 'bg-orange-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
                        }`}
                    >
                        Current Orders
                    </button>
                    <button
                        onClick={() => setOrderFilter('past')}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
                            orderFilter === 'past'
                                ? 'bg-orange-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
                        }`}
                    >
                        Past Orders
                    </button>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        {orderFilter === 'current' ? '⏳ Orders In Progress' : '✅ Completed & Cancelled Orders'}
                </h2>

                {loading && (
                    <p className="text-center py-6 text-orange-700 font-medium">
                        Loading your orders...
                    </p>
                )}

                {!loading && filteredOrders.length > 0 && (
                    <div className="grid grid-cols-6 font-semibold text-sm text-orange-700 bg-amber-100 px-4 py-2 rounded-md mt-3">
                        <span>ID</span>
                        <span className="hidden md:inline">Date</span>
                        <span>Items</span>
                        <span>Total</span>
                        <span className="text-center">Status</span>
                        <span className="text-center">Details</span>
                    </div>
                )}

                {/* Orders */}
                {!loading && filteredOrders.length === 0 && (
                    <p className="text-gray-600 text-center py-6">
                        {orderFilter === 'current' 
                            ? '🎉 All caught up! No active orders right now.' 
                            : '😕 No past orders found. Start your first order!'}
                    </p>
                )}

                {!loading &&
                    filteredOrders.map((order) => {
                        const isPast = isPastOrder(order);
                        
                        return (
                            <div
                                key={order._id}
                                className="grid grid-cols-6 items-center px-4 py-3 bg-white hover:bg-amber-50 rounded-lg shadow-sm mt-2 border border-gray-100 transition duration-150"
                            >
                                <span className="truncate font-medium text-sm">#{order._id.slice(-6)}</span>
                                <span className="text-sm hidden md:inline">{new Date(order.createdAt).toLocaleDateString()}</span>
                                <span className="text-sm">{order.items?.length || 0} items</span>
                                <span className="font-bold text-green-700">₹{order.totalAmount?.toFixed(2) || '0.00'}</span>

                                <span
                                    className={`flex items-center gap-1 justify-center text-xs md:text-sm px-3 py-1 mx-auto rounded-full font-medium ${getStatusStyles(
                                        order.status
                                    )}`}
                                >
                                    {getStatusIcon(order.status)}
                                    {formattedStatus(order.status)}
                                </span>
                                
                                <button
                                    onClick={() => handleViewDetails(order)} 
                                    className={`flex justify-center transition ${
                                        isPast 
                                            ? 'text-gray-400 cursor-not-allowed' 
                                            : 'text-orange-500 hover:text-orange-700'
                                    }`}
                                    disabled={isPast} 
                                    aria-label={`View details for order ${order._id.slice(-6)}`}
                                >
                                    <Info size={20} />
                                </button>
                            </div>
                        );
                    })}
            </div>
            
            
            {selectedOrder && !isPastOrder(selectedOrder) && (
                 <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
           
        </div>
    );
};

export default CustomerOrders;