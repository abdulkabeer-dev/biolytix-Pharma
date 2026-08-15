import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const isAuth = sessionStorage.getItem('biolytix_admin_auth') === 'true'
  const location = useLocation()

  if (!isAuth) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
