import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="py-4 px-2">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
