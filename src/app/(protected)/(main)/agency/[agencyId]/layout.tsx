import BlurPage from '@/components/globals/blur-page';
import InfoBar from '@/components/globals/info-bar';
import Sidebar from '@/components/sidebar';
import {
  getNotificationAndUser,
  verifyAndAcceptInvitation,
} from '@/data/queries';
import { currentUser } from '@clerk/nextjs';
import { Role } from '@prisma/client';

import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: { agencyId?: string };
};
const AgencyLayout = async ({ params, children }: Props) => {
  if (!params?.agencyId) return redirect('/');

  const user = await currentUser();
  if (!user) return redirect('/');

  const { agencyId, authUser } = await verifyAndAcceptInvitation();

  if (!agencyId) return redirect('/agency');

  if (
    user.privateMetadata.role !== Role.AGENCY_OWNER &&
    user.privateMetadata.role !== Role.AGENCY_ADMIN
  ) {
    return redirect('/agency/unauthorized');
  }

  let allNoti: any = [];
  const notifications = await getNotificationAndUser(agencyId);

  if (notifications) allNoti = notifications;

  return (
    <div className='h-screen overflow-hidden'>
      <Sidebar id={params.agencyId} type='agency' />

      <InfoBar notifications={allNoti} />

      <div className='md:pl-[300px]'>
        <div className='relative'>
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
};
export default AgencyLayout;
