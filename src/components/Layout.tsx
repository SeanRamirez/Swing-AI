import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../utils";
import { BarChart3, Upload as UploadIcon, TrendingUp, User, Home, Target, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
} from "./ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Upload",
    url: createPageUrl("Upload"),
    icon: UploadIcon,
  },
  {
    title: "Analysis",
    url: createPageUrl("Analysis"),
    icon: BarChart3,
  },
  {
    title: "Progress",
    url: createPageUrl("Progress"),
    icon: TrendingUp,
  },
];

interface LayoutProps {
  children: React.ReactNode;
  currentPageName?: string;
}

export default function Layout({ children, currentPageName }: LayoutProps) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-emerald-50">
        <style>
          {`
            :root {
              --golf-primary: #1e3a2e;
              --golf-secondary: #2d5a43;
              --golf-accent: #d4af37;
              --golf-light: #f8fffe;
              --golf-muted: #6b8068;
              --safe-area-inset-bottom: env(safe-area-inset-bottom);
            }
            body {
              padding-bottom: var(--safe-area-inset-bottom);
            }
          `}
        </style>
        
        {/* --- Desktop Sidebar --- */}
        <Sidebar className="hidden md:flex border-r border-emerald-100/50 bg-white/90 backdrop-blur-md shadow-lg">
          <SidebarHeader className="border-b border-emerald-100/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-slate-800">SwingPro AI</h2>
                <p className="text-xs text-emerald-600 font-medium">Golf Swing Analyzer</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4 flex-1">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`group w-full hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300 rounded-xl px-4 py-3 ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' 
                            : 'text-slate-600 hover:shadow-md'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 w-full">
                          <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                            location.pathname === item.url ? 'text-white' : 'text-slate-500'
                          }`} />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Profile Section */}
            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Profile
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      className="group w-full hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300 rounded-xl px-4 py-3 text-slate-600 hover:shadow-md"
                    >
                      <Link to="/profile" className="flex items-center gap-3 w-full">
                        <User className="w-5 h-5 text-slate-500 group-hover:text-emerald-700 transition-colors" />
                        <span className="font-medium">My Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-emerald-100/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">Golf Pro</p>
                <p className="text-xs text-slate-500 truncate">Improve your swing</p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors mt-3 w-full justify-center py-2 rounded-lg hover:bg-red-50">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </SidebarFooter>
        </Sidebar>

        {/* --- Main Content Area --- */}
        <main className="flex-1 flex flex-col pb-20 md:pb-0">
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
        
        {/* --- iOS-style Bottom Tab Bar --- */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-emerald-100/50 z-50 shadow-lg" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <nav className="flex justify-around items-center h-16 px-4">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link 
                  to={item.url} 
                  key={item.title} 
                  className={`flex flex-col items-center justify-center w-full h-full rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-emerald-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`w-6 h-6 mb-1 transition-all duration-200 ${
                    isActive ? 'text-emerald-600 scale-110' : 'text-slate-500'
                  }`} />
                  <span className={`text-xs font-medium transition-colors duration-200 ${
                    isActive ? 'text-emerald-600' : 'text-slate-500'
                  }`}>
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </SidebarProvider>
  );
}
