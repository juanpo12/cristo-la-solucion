// This file is deprecated - admin users are now managed through Supabase Auth
// Admin users should be created directly in Supabase with user_metadata.role = 'admin' or 'superadmin'

export class AdminService {
  // This service is deprecated - use Supabase Auth instead
  static async deprecatedNotice() {
    console.warn('AdminService is deprecated. Use Supabase Auth with user_metadata.role instead.')
  }
}