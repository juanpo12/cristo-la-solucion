import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  user_metadata?: {
    username?: string;
    role?: string;
  };
}

export class AuthService {
  // Verificar autenticación del usuario
  static async verifyAuth(): Promise<AdminUser | null> {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Verificar que el usuario tenga rol de admin
    const role = user.user_metadata?.role || "user";
    if (role !== "admin" && role !== "superadmin") {
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      role,
      user_metadata: user.user_metadata,
    };
  }

  // Verificar si el usuario es superadmin
  static async isSuperAdmin(): Promise<boolean> {
    const user = await this.verifyAuth();
    return user?.role === "superadmin";
  }

  // Redirigir si no está autenticado
  static async requireAuth(): Promise<AdminUser> {
    const user = await this.verifyAuth();
    if (!user) {
      redirect("/admin/login");
    }
    return user;
  }

  // Redirigir si no es superadmin
  static async requireSuperAdmin(): Promise<AdminUser> {
    const user = await this.requireAuth();
    if (user.role !== "superadmin") {
      redirect("/admin/unauthorized");
    }
    return user;
  }

  // Cerrar sesión
  static async signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/admin/login");
  }
}
