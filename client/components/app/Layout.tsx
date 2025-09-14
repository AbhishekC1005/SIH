import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  Salad,
  ScanLine,
  Stethoscope,
  ChefHat,
  BarChart3,
  LayoutDashboard,
  LogOut,
  Users,
  User as UserIcon,
} from "lucide-react";
import React from "react";
import { useAppState } from "@/context/app-state";
import { ChatWidget } from "@/components/app/ChatWidget";

export const AppLayout: React.FC = () => {
  const { currentUser, setCurrentUser } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();

  const isDoctor = currentUser?.role === "doctor";
  const menu = isDoctor
    ? [
        { to: "/doctor", label: "Doctor Panel", icon: Stethoscope },
        { to: "/doctor/patients", label: "Patients", icon: Users },
        {
          to: "/doctor/generator/diet",
          label: "Diet Plan Generator",
          icon: Salad,
        },
        {
          to: "/doctor/generator/recipes",
          label: "Recipe Generator",
          icon: ChefHat,
        },
        { to: "/doctor/messages", label: "Messages", icon: MessageCircle },
      ]
    : [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/tracking", label: "Tracking", icon: BarChart3 },
        { to: "/recipes", label: "Recipes", icon: ChefHat },
        { to: "/scan", label: "Scan", icon: ScanLine },
      ];

  return (
    <SidebarProvider>
      <Sidebar className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm w-64">
        <SidebarHeader className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-emerald-500" />
            <div>
              <div className="text-lg font-bold text-gray-900">AyurWell</div>
              <div className="text-xs text-gray-500">Holistic Nutrition</div>
            </div>
          </div>
          <SidebarSeparator className="my-3 border-gray-200" />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {menu.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.to}
                  >
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-all",
                          isActive
                            ? "bg-gray-100 font-semibold text-gray-900"
                            : "",
                        )
                      }
                    >
                      <item.icon className="h-5 w-5 text-gray-600" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 bg-gray-200">
                <AvatarFallback>
                  {currentUser?.name?.slice(0, 2).toUpperCase() || "AY"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {currentUser?.name || "Guest"}
                </div>
                <div className="text-xs text-gray-500">
                  {currentUser?.role ?? "unauthenticated"}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 hover:text-gray-900"
              onClick={() => {
                setCurrentUser(null);
                navigate("/");
              }}
            >
              <LogOut className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </SidebarFooter>

        <SidebarRail className="bg-gray-50" />
      </Sidebar>

      <SidebarInset>
        <Topbar />
        <div className="px-6 py-6 bg-gray-50 min-h-screen">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

const Topbar: React.FC = () => {
  const { currentUser } = useAppState();
  return (
    <div className="sticky top-0 z-20 flex h-14 items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-gray-600 hover:text-gray-900 transition-all" />
        <div className="text-lg font-semibold text-gray-900">
          {currentUser?.role === "doctor" ? "Doctor Dashboard" : "AyurWell"}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
            >
              <MessageCircle className="h-4 w-4" /> Assistant
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[480px] p-0 bg-white/80 backdrop-blur-sm border border-gray-200"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Assistant</SheetTitle>
            </SheetHeader>
            <ChatWidget mode="panel" />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
