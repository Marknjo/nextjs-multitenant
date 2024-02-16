import { ClerkProvider, currentUser } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { redirect } from 'next/navigation';

const ProtectedLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>{children}</ClerkProvider>
  );
};
export default ProtectedLayout;
