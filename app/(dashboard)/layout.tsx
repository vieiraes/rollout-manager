import { Navigation } from '@/components/layout/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen md:flex-row">
      {/* Desktop sidebar / Mobile bottom nav */}
      <Navigation />
      
      {/* Main content */}
      <main className="flex-1 overflow-hidden pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
}
