// This file is deprecated - admin users are now managed through Supabase Auth.
// The role lives in app_metadata.role ('admin' | 'superadmin'), which is only
// writable with the service-role key (never by the user). Use /api/admin/setup
// or `npm run migrate:admin-role` to assign it.

export class AdminService {
  // This service is deprecated - use Supabase Auth instead
  static async deprecatedNotice() {
    console.warn('AdminService is deprecated. Use Supabase Auth with app_metadata.role instead.')
  }
}