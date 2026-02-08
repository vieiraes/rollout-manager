import { Navigation } from '@/components/layout/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      {/* Desktop sidebar / Mobile bottom nav */}
      <Navigation />
      
      {/* Main content - add left margin on desktop for sidebar */}
      <main className="flex-1 overflow-hidden pb-16 md:pb-0 md:ml-64">
        {children}
      </main>
    </div>
  );
}
