type Props = {
  params: { agencyId?: string };
};
const Page = (props: Props) => {
  console.log(props);

  return <div>Billing page</div>;
};
export default Page;
