import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  // Eliminar cookie de autenticación
  const logoutCookie = AuthService.createLogoutCookie()
  response.cookies.set(logoutCookie)
  
  return response
}