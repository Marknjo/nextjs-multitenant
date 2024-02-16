import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Page = async () => {
  const authUser = await currentUser();

  if (!authUser) return redirect('/sign-in');
  return <div>Sub Account Dashboard</div>;
};
export default Page;
