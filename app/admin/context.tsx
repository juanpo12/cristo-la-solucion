'use client'

import { createContext, useContext } from 'react'

export interface AdminUser {
  id: string
  email: string
  role: string
  username?: string
}

export const AdminUserContext = createContext<AdminUser | null>(null)

export function useAdminUser(): AdminUser {
  const user = useContext(AdminUserContext)
  if (!user) throw new Error('useAdminUser must be used inside AdminUserContext.Provider')
  return user
}
