import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
import Profile from './components/Profile'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import AdminRoute from './components/admin/AdminRoute'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminOverview from './components/admin/AdminOverview'
import AdminUsers from './components/admin/AdminUsers'
import AdminContent from './components/admin/AdminContent'
import AdminAnalytics from './components/admin/AdminAnalytics'
import AdminAuditLog from './components/admin/AdminAuditLog'
import BlockedUsers from './components/BlockedUsers'
import { Toaster } from 'react-hot-toast'
//Use either react-router or react-router-dom

const router = createBrowserRouter(
  // routing happens here 
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/blocked' element={<BlockedUsers />} />
      <Route path='/forgotpass' element={<ForgotPassword />} />
      <Route path='/resetpassword/:token' element={<ResetPassword />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminDashboard />}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="audit" element={<AdminAuditLog />} />
        </Route>
      </Route>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>,
)
