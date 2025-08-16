import React, { createContext, useContext, ReactNode } from 'react';

// Sidebar Context
interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

// Sidebar Provider
interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Sidebar Components
interface SidebarProps {
  children: ReactNode;
  className?: string;
}

export function Sidebar({ children, className = '' }: SidebarProps) {
  return (
    <aside className={`w-64 flex-shrink-0 ${className}`}>
      {children}
    </aside>
  );
}

export function SidebarHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}

export function SidebarContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex-1 ${className}`}>
      {children}
    </div>
  );
}

export function SidebarFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}

export function SidebarGroup({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export function SidebarGroupLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}

export function SidebarGroupContent({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export function SidebarMenu({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}

export function SidebarMenuItem({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

interface SidebarMenuButtonProps {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
}

export function SidebarMenuButton({ children, className = '', asChild = false }: SidebarMenuButtonProps) {
  if (asChild) {
    return <>{children}</>;
  }
  
  return (
    <button className={`w-full text-left ${className}`}>
      {children}
    </button>
  );
}
