import type { ReactNode } from "react";

export type DashboardRole = "primary" | "secondary";

export interface DashboardProfile {
  user_id: string;
  full_name: string | null;
  email: string | null;
  mobile: string | null;
  user_type: DashboardRole | null;
}

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: ReactNode;
}