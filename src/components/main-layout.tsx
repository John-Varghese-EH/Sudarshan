"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  BarChart3,
  Settings,
  Bot,
  LifeBuoy,
  Users,
  MessageSquare,
  Presentation,
  Send,
  Search,
  ChevronDown,
  Key,
  ShieldCheck,
  BookOpen,
  FileWarning,
  Info,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useProfile } from "@/hooks/use-profile"
import { Skeleton } from "./ui/skeleton"
import PocDisclaimer from "./poc-disclaimer"
import ChatbotOverlay from "./chatbot/chatbot-overlay"
import { cn } from "@/lib/utils"
import RedButton from "./privacy/RedButton"
const AppHeader = () => {
    const { state } = useSidebar();
    return (
        <div className="flex items-center gap-2">
           <img src="/logo.jpeg" alt="Sudarshan app logo" width={32} height={32} className="rounded-lg" />
            <h1
            className={cn(
                "text-xl font-semibold text-primary transition-opacity duration-200",
                 "group-data-[state=collapsed]:opacity-0 group-data-[state=collapsed]:hidden"
            )}
            >
            Sudarshan
            </h1>
      </div>
    )
}


export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, isLoading } = useProfile();
  const [isDashboardOpen, setIsDashboardOpen] = React.useState(
    ['/', '/alerts', '/reports', '/analytics'].some((p) => pathname.startsWith(p))
  ); // Keep this state for the overview/prevention submenu if needed

  const sidebarItems = [
    {
      category: 'Awareness',
      items: [
        { href: '/awareness', label: 'Awareness', icon: <LifeBuoy /> },
        { href: '/encryption-demo', label: 'Encryption Demo', icon: <Key /> },
        { href: '/community', label: 'Community', icon: <Users /> },
        { href: '/chatbot', label: 'AI Chatbot', icon: <Bot /> },
      ],
    },
    {
      category: 'Detection',
      items: [
        { href: '/public-finder', label: 'Public Finder', icon: <Search /> },
        { href: '/chat-demo', label: 'Chat Demo', icon: <MessageSquare /> },
        { href: '/web-app-scanning', label: 'Web App Scan', icon: <ShieldCheck /> },
        { href: '/report-scam', label: 'Report a Scam', icon: <FileWarning /> },
      ],
    },
    {
      category: 'Prevention',
      items: [
        { href: '/', label: 'Overview', icon: <LayoutDashboard /> }, // Overview mapped to dashboard
        { href: '/alerts', label: 'Alerts', icon: <AlertTriangle /> },
        { href: '/reports', label: 'Reports', icon: <FileText /> }, // Combined reports
        { href: '/analytics', label: 'Analytics', icon: <BarChart3 /> },
      ],
    },
     {
      category: 'Others',
      items: [
        { href: '/settings', label: 'Settings', icon: <Settings /> },
        { href: '/about', label: 'About Us', icon: <Info /> },
      ],
    },
  ];

  const pageTitle = (pathname.split('/').pop() || 'overview').replace(/-/g, ' ');

  const getIsActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href) && (href !== '/' || pathname === '/');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsible="icon">
          <SidebarHeader className="flex items-center justify-start">
            <SidebarTrigger />
            <AppHeader />
          </SidebarHeader>
          <SidebarContent>
            {sidebarItems.map((group) => (
              <SidebarGroup key={group.category}>
                <SidebarGroupLabel>{group.category}</SidebarGroupLabel>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <Link href={item.href} passHref>
                        <SidebarMenuButton isActive={getIsActive(item.href, item.href === '/')} tooltip={item.label}>
                          {item.icon}
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            ))}
            {/* Example of nested items if needed (e.g., for the old dashboard structure) */}
            {/*
              <SidebarMenuItem>
                 <SidebarMenuButton
                    onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                    isActive={getIsActive('/') || ['/alerts', '/reports', '/analytics'].some(item => getIsActive(item))}
                    tooltip="Overview/Prevention"
                  >
                   <LayoutDashboard />
                    <span>Overview/Prevention</span>
                   <ChevronDown className={cn('ml-auto h-4 w-4 transition-transform duration-200', isDashboardOpen ? 'rotate-180' : '', 'group-data-[state=collapsed]:hidden')} />
                </SidebarMenuButton>
                {isDashboardOpen && ( // Use the state for visibility
                  <SidebarMenuSub>
                     <SidebarMenuSubItem> // Overview
                        <Link href="/" passHref>
                          <SidebarMenuSubButton isActive={getIsActive('/', true)}>
                            <LayoutDashboard /><span>Overview</span>
                          </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                    {dashboardSubItems.map((item) => (
                       <SidebarMenuSubItem key={item.href}>
                        <Link href={item.href} passHref>
                           <SidebarMenuSubButton isActive={getIsActive(item.href)}>
                            {item.icon}<span>{item.label}</span>
                           </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub> // Close submenu
                 )} // Close condition
                <SidebarMenuItem key={item.href}>
                   <Link href={item.href} passHref>
                    <SidebarMenuButton isActive={getIsActive(item.href)} tooltip={item.label}>
                        {item.icon}
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
               */}
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="hidden space-y-2 group-data-[state=expanded]:block">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-3 w-[60px]" />
                  </div>
                </>
              ) : (
                <>
                   <Avatar className="h-9 w-9">
                      <AvatarImage src={profile.avatar} alt="Operator/User" data-ai-hint="profile picture" />
                      <AvatarFallback>{profile.name?.substring(0,2).toUpperCase() || 'OP'}</AvatarFallback>
                    </Avatar>
                  <div className="hidden flex-col group-data-[state=expanded]:flex">
                    <span className="text-sm font-semibold text-foreground">{profile.name}</span>
                    <span className="text-xs text-muted-foreground">Level 5 Analyst</span>
                  </div>
                </>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <PocDisclaimer />
          <header className="sticky top-0 z-10 flex items-center h-14 px-4 border-b bg-background/80 backdrop-blur-sm shrink-0">
            <div className="w-full max-w-7xl mx-auto flex items-center">
                <SidebarTrigger className="md:hidden" />
                <div className="flex-1">
                <h2 className="text-lg font-semibold capitalize">{pageTitle === '' ? 'overview' : pageTitle}</h2> {/* Changed default title to overview */}
                </div>
                <RedButton />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                {children}
            </div>
          </main>
           <ChatbotOverlay />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
