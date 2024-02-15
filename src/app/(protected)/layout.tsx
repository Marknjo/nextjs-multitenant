import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const ProtectedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>{children}</ClerkProvider>
  );
};
export default ProtectedLayout;
