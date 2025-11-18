import React, { useState, useEffect } from 'react';
import api from '../../services/api.js'; 
import { toast } from 'react-toastify';
import { Loader2, Edit3, Save, XCircle, X } from 'lucide-react';

const BASE_SERVER_URL = 'http://localhost:5000'; 

const MenuManager = () => {
    
    const getAbsoluteImageUrl = (imagePath) => {
        if (!imagePath) {
            return "https://via.placeholder.com/150?text=No+Image";
        }
        if (imagePath.startsWith("http")) {
            return imagePath;
        }
        const normalizedPath = imagePath.startsWith("/uploads") ? imagePath : "/uploads/" + imagePath;
        return `${BASE_SERVER_URL}${normalizedPath}`;
    };

    const [menuItems, setMenuItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null); 

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(''); 

    const [loadingList, setLoadingList] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [listError, setListError] = useState(null);

    const fetchItems = async () => {
        setLoadingList(true);
        setListError(null);
        try {
            const response = await api.get('/menu'); 
            setMenuItems(response.data || []);
        } catch (err) {
            console.error('Error fetching menu items:', err);
            setListError('Failed to load menu list. Check the API server.');
            toast.error('Failed to load menu list.');
        } finally {
            setLoadingList(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);
    
    const handleEditClick = async (itemId) => {
        const itemToEdit = menuItems.find(item => item._id === itemId);

        if (!itemToEdit) {
            toast.error('Item not found in list.');
            return;
        }

        setEditingItem(itemToEdit);
        setFormData({
            name: itemToEdit.name,
            description: itemToEdit.description, 
            price: itemToEdit.price.toString(),
            category: itemToEdit.category,
        });
        setImageUrl(itemToEdit.image); 
        setImageFile(null);
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setFormData({ name: '', description: '', price: '', category: '' });
        setImageUrl('');
        setImageFile(null);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editingItem) return;

        setIsSubmitting(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description); 
        data.append('price', formData.price);
        data.append('category', formData.category);       
        
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            const response = await api.put(`/menu/${editingItem._id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            });
            
            toast.success('Menu item updated successfully! 🎉');
            
            setMenuItems(prevItems => 
                prevItems.map(item => 
                    item._id === editingItem._id ? response.data : item
                )
            );
            handleCancelEdit(); 
        } catch (err) {
            console.error('Error updating menu item:', err);
            toast.error(err.response?.data?.message || 'Update failed. Please check inputs.');
        } finally {
            setIsSubmitting(false);
        }
    };


    if (loadingList) {
        return (
            <div className="flex justify-center items-center min-h-60 mt-10">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                <p className="ml-2 text-gray-600">Loading menu...</p>
            </div>
        );
    }

    if (listError) {
        return (
            <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg m-8">
                <XCircle className="w-8 h-8 text-red-500 mx-auto" />
                <h2 className="text-xl font-semibold text-red-700 mt-3">{listError}</h2>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className={`lg:col-span-2 bg-white shadow-2xl rounded-xl p-6 ${editingItem ? 'opacity-60 pointer-events-none lg:opacity-100 lg:pointer-events-auto' : ''}`}>
                <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3 flex justify-between items-center">
                    📋 Full Menu List 
                </h1>
                
                {menuItems.length === 0 ? (
                    <p className="text-center text-gray-500 p-10 border border-dashed rounded-lg">No menu items found.</p>
                ) : (
                    <div className="space-y-4">
                        {menuItems.map(item => (
                            <div key={item._id} className={`flex items-center justify-between p-4 rounded-lg transition duration-200 ${
                                    editingItem && editingItem._id === item._id 
                                    ? 'bg-orange-100 shadow-xl border-2 border-orange-500' 
                                    : 'bg-white shadow-md hover:shadow-lg'
                                }`}>
                                <div className="flex items-center space-x-4">
                                    <img 
                                        src={getAbsoluteImageUrl(item.image)} 
                                        alt={item.name} 
                                        className="w-16 h-16 object-cover rounded-md border" 
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150" }} 
                                    />
                                    <div>
                                        <p className="text-xl font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.category} | ₹{item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => handleEditClick(item._id)}
                                    disabled={isSubmitting}
                                    className="flex items-center text-orange-600 hover:text-orange-700 font-medium transition duration-150 p-2 rounded-full bg-orange-50 hover:bg-orange-200 disabled:opacity-50"
                                >
                                    <Edit3 className="w-5 h-5 mr-1" />
                                    Edit
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="lg:col-span-1">
                {editingItem ? (
                    <div className="bg-white shadow-2xl rounded-xl p-6 sticky top-6 border-t-4 border-green-500">
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <h2 className="text-2xl font-bold text-green-700">✏️ Edit: {editingItem.name}</h2>
                            <button onClick={handleCancelEdit} className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Item Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Item Image</label>
                                {imageUrl && !imageFile && (
                                    <img 
                                        src={getAbsoluteImageUrl(imageUrl)} 
                                        alt="Current item" 
                                        className="w-20 h-20 object-cover rounded-md mb-2 border"
                                    />
                                )}
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-1"
                                />
                                <p className="mt-1 text-xs text-gray-500">New file will replace existing.</p>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white transition duration-200 ${
                                        isSubmitting 
                                            ? 'bg-green-400 cursor-not-allowed' 
                                            : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-5 h-5 mr-2" />
                                    )}
                                    {isSubmitting ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white shadow-lg rounded-xl p-6 sticky top-6 text-center border-t-4 border-gray-300">
                        <Edit3 className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <h2 className="text-xl font-semibold text-gray-700">Select an Item</h2>
                        <p className="text-sm text-gray-500 mt-2">
                            Click the Edit button next to any menu item to load its details here for updating.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuManager;