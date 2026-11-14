import { LucideIcon } from "lucide-react";

export interface NavItemConfig {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string | number;
  description?: string;
}

export interface NavSectionConfig {
  title: string;
  items: NavItemConfig[];
}

