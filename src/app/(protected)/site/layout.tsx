import Navigation from '@/components/site/navigation';
import { ReactNode } from 'react';

const SiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='h-full'>
      <Navigation />
      {children}
    </main>
  );
};
export default SiteLayout;
