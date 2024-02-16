import { notFound } from 'next/navigation';

type Props = {
  params: { agencyId?: string };
};
const Page = ({ params }: Props) => {
  if (!params?.agencyId) {
    notFound();
  }

  return <div>{params?.agencyId}</div>;
};
export default Page;
