import {
    Shield, Zap, Award, Wrench, Clock, Leaf,
    Package, CheckCircle, Star, Target, TrendingUp, Users,
    Settings, Truck, Factory, Building, Home, Store, School
} from "lucide-react"

// Map of all available icons for Product Page sections
export const iconMap: Record<string, any> = {
    Shield,
    Zap,
    Award,
    Wrench,
    Clock,
    Leaf,
    Package,
    CheckCircle,
    Star,
    Target,
    TrendingUp,
    Users,
    Settings,
    Truck,
    Factory,
    Building,
    Home,
    Store,
    School
}

// Helper to get icon component by name
export function getIconComponent(iconName: string) {
    return iconMap[iconName] || CheckCircle
}
