import AgencyDetails from '@/components/forms/agency-details';
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/data/queries';
import { Plan } from '@prisma/client';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: { plan: Plan; state: string; code: string };
};

const Page = async ({ searchParams }: Props) => {
  const response = await verifyAndAcceptInvitation();

  const user = await getAuthUserDetails();

  if (response?.agencyId) {
    const { agencyId } = response;

    if (user?.role === 'SUBACCOUNT_GUEST' || user?.role === 'SUBACCOUNT_USER') {
      return redirect('/subaccount');
    } else if (user?.role === 'AGENCY_OWNER' || user?.role === 'AGENCY_ADMIN') {
      if (searchParams?.plan) {
        return redirect(
          `/agency/${agencyId}/billing?plan=${searchParams.plan}`
        );
      }

      if (searchParams?.state) {
        const statePath = searchParams.state.split('___')[0];

        const stateAgencyId = searchParams.state.split('___')[1];

        if (!stateAgencyId) return <div className=''>Not Authorized</div>;

        return redirect(
          `/agency/${stateAgencyId}/${statePath}?${searchParams.code}`
        );
      } else {
        return redirect(`/agency/${agencyId}`);
      }
    } else {
      return <div className=''>Not Authorized</div>;
    }
  }

  const { authUser } = response;

  return (
    <div className='flex justify-center items-center mt-4'>
      <div className='max-w-[850px] border-[1px] p-4 rounded-xl'>
        <h1 className='text-4xl'>Create An Agency</h1>

        <AgencyDetails
          data={{
            companyEmail: authUser?.emailAddresses[0].emailAddress,
            //-----DUMMY DATA for testing
            name: 'Focus Point',
            companyPhone: '0724090090',
            address: '187 St Fili',
            city: 'Nairobi',
            zipCode: '254',
            state: 'Nairobi',
            country: 'Kenya',
            agencyLogo:
              'https://utfs.io/f/924881bf-2c25-4bdb-ac06-e938e164ecc5-igibsg.svg',
          }}
        />
      </div>
    </div>
  );
};
export default Page;
