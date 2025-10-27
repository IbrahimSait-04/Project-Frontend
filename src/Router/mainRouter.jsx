import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SignUp from '../Common Pages/SignUp'
import Login from '../Common Pages/Login'
import Home from '../Customer/Pages/Home'
import MenuCard from '../Customer/Pages/MenuCard'
import Contact from '../Customer/Pages/Contact'
import AdminHome from '../Admin/Adminpages/Admin'
import Dashboard from '../Admin/Adminpages/Dashboard'
import CreateMenuItem from '../Common Pages/CreateMenu'
import CreateStaffs from '../Admin/Adminpages/CreatStaffs'
import GetCustomers from '../Admin/Adminpages/GetCustomers'
import Cart from '../Customer/Pages/cart'
import StaffHome from '../Staff/Staff Pages/staffHome'
import StaffProfile from '../Staff/Staff Pages/staffProfile'
import Dinein from '../Customer/Pages/DineIn'
import CustomerProfile from '../Customer/Pages/profile'
import CustomerSettings from '../Customer/Pages/settings'
import MyReservations from '../Customer/Pages/reservations'
import StaffDashboard from '../Staff/Staff Pages/staffDashboard'
import Order from '../Customer/Pages/order'
import Checkout from '../Customer/Pages/chekout'
import GetStaffs from '../Admin/Adminpages/GetStaff'

const MainRouter = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/Signup' element={<SignUp />}/>
        <Route path='/Login' element={<Login />}/>
        <Route path='/menu' element={<MenuCard />}/>
        <Route path='/contact' element={<Contact />}/>
        <Route path='/admin' element={<AdminHome />}/>
        <Route path='/dinein' element={<Dinein />}/>
        <Route path='/admin/dashboard' element={<Dashboard />}/>
        <Route path='/admin/createmenu' element={<CreateMenuItem />}/>
        <Route path='/admin/createstaff' element={<CreateStaffs />}/>
        <Route path='/admin/getcustomer' element={<GetCustomers />}/>
         <Route path='/staff/createmenu' element={<CreateMenuItem />}/>
         <Route path='/staff' element={<StaffHome />} />
         <Route path='/cart' element={<Cart />}/>
        <Route path='/staff/profile' element={<StaffProfile />}/>
        <Route path='/cart' element={<Cart />} />
        <Route path='/customer/profile' element={<CustomerProfile />}/>
        <Route path='/customer/settings' element={<CustomerSettings />}/>
        <Route path='/customer/reservations' element={<MyReservations />} />
        <Route path='/staff/dashboard' element={<StaffDashboard />} />
        <Route path='/customer/order' element={<Order />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/admin/getstaff' element={<GetStaffs />} />
        <Route path='/myorders' element={<Order />} />
      </Routes>
    </div>
  )
}

export default MainRouter;
