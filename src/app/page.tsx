'use client';

import DefenxiaPage from '@/components/defenxia/DefenxiaPage';

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center p-4 sm:p-8 md:p-12 overflow-hidden bg-background">
      <div className="z-10 w-full">
        <DefenxiaPage />
      </div>
    </main>
  );
}
