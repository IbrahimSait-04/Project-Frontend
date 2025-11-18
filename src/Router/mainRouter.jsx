import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SignUp from '../Common Pages/SignUp'
import Login from '../Common Pages/Login'
import Home from '../Customer/Pages/Home'
import MenuCard from '../Customer/Pages/MenuCard'
import Contact from '../Customer/Pages/Contact'

// Admin Imports
// Renamed AdminHome to AdmiDashboard as per your file structure
import AdmiDashboard from '../Admin/Adminpages/Admin'
import Dashboard from '../Admin/Adminpages/Dashboard'
import CreateMenuItem from '../Admin/Adminpages/CreateMenu'
import CreateStaffs from '../Admin/Adminpages/CreatStaffs'
import GetCustomers from '../Admin/Adminpages/GetCustomers'
import GetStaffs from '../Admin/Adminpages/GetStaff'
import AdminProfile from '../Admin/Adminpages/AdminProfile'

// Customer Imports
import Cart from '../Customer/Pages/cart'
import Dinein from '../Customer/Pages/DineIn'
import CustomerProfile from '../Customer/Pages/profile'
import CustomerSettings from '../Customer/Pages/settings'
import MyReservations from '../Customer/Pages/reservations'
import Order from '../Customer/Pages/order'
import Checkout from '../Customer/Pages/chekout'

// Staff Imports
import StaffHome from '../Staff/Staff Pages/staffHome'
import StaffProfile from '../Staff/Staff Pages/staffProfile'
import StaffDashboard from '../Staff/Staff Pages/staffDashboard'
import CustomerOrders from '../Customer/Pages/order'
import EditMenuItem from '../Admin/Adminpages/EditMenu'
import StaffSettings from '../Staff/Staff Pages/StaffSettings'
import EditMenu from '../Staff/Staff Pages/EditMenu'


const MainRouter = () => {
        return (
                <div>
                        <Routes>
                                {/* --- COMMON & CUSTOMER ROUTES --- */}
                                <Route path='/' element={<Home />} />
                                <Route path='/Signup' element={<SignUp />} />
                                <Route path='/Login' element={<Login />} />
                                <Route path='/menu' element={<MenuCard />} />
                                <Route path='/contact' element={<Contact />} />
                                <Route path='/dinein' element={<Dinein />} />
                                <Route path='/cart' element={<Cart />} />
                                <Route path='/checkout' element={<Checkout />} />

                                {/* Customer Account Routes */}
                                <Route path='/customer/profile' element={<CustomerProfile />} />
                                <Route path='/customer/settings' element={<CustomerSettings />} />
                                <Route path='/customer/reservations' element={<MyReservations />} />
                                <Route path='/customer/order' element={<Order />} />
                                <Route path='/myorders' element={<CustomerOrders />} />


                                {/* --- STAFF ROUTES (NESTED STRUCTURE) --- */}
                                <Route path="/staff" element={<StaffHome />}>
                                        <Route index element={<StaffDashboard />} />
                                        {/* child routes */}
                                        <Route path="profile" element={<StaffProfile />} />
                                        <Route path="editmenu" element={<EditMenu />} />
                                        <Route path="settings" element={<StaffSettings />} />

                                        <Route path="*" element={<StaffDashboard />} />
                                </Route>

                                {/* --- ADMIN ROUTES (NESTED STRUCTURE) --- */}

                                <Route path='/admin' element={<AdmiDashboard />}>
                                        <Route index element={<Dashboard />} />

                                        <Route path='dashboard' element={<Dashboard />} />
                                        <Route path='adminprofile' element={<AdminProfile />} />
                                        <Route path='createmenu' element={<CreateMenuItem />} />
                                        <Route path='createstaff' element={<CreateStaffs />} />
                                        <Route path='getcustomer' element={<GetCustomers />} />
                                        <Route path='getstaff' element={<GetStaffs />} />
                                        <Route path='editmenu' element={<EditMenuItem />} />


                                </Route>

                        </Routes>
                </div>
        )
}

export default MainRouter;