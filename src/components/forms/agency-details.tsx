'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { NumberInput } from '@tremor/react';
import { Agency } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@radix-ui/react-alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import {
  AgencyDetailsSchema,
  TAgencyDetailsSchema,
} from '@/schemas/agency-details.schema';
import {
  deleteAgency,
  initUser,
  generateRandomMongoId,
  saveActivityLogsNotification,
  updateAgencyDetails,
  upsertAgency,
} from '@/data/queries';

import FileUpload from '@/components/globals/file-upload';
import Loading from '@/components/globals/loading';

type Props = {
  data?: Partial<Agency>;
};
const AgencyDetails = ({ data }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = useState<boolean>(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<TAgencyDetailsSchema>({
    resolver: zodResolver(AgencyDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      name: data?.name,
      companyEmail: data?.companyEmail,
      companyPhone: data?.companyPhone,
      whiteLabel: data?.whiteLabel || false,
      address: data?.address,
      city: data?.city,
      zipCode: data?.zipCode,
      state: data?.state,
      country: data?.country,
      agencyLogo: data?.agencyLogo,
    },
  });

  async function handleSubmit(values: TAgencyDetailsSchema) {
    startTransition(async () => {
      try {
        let newUserData;
        let ctId; // customerId

        if (!data?.id) {
          const bodyData = {
            email: values.companyEmail,
            name: values.name,
            shipping: {
              address: {
                city: values.city,
                country: values.country,
                line1: values.address,
                postal_code: values.zipCode,
                state: values.zipCode,
              },
              name: values.name,
            },
            address: {
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zipCode,
              state: values.zipCode,
            },
          };

          const customerResponse = await fetch('/api/stripe/create-customer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData),
          });

          const customerData: { customerId: string } =
            await customerResponse.json();
          ctId = customerData.customerId;
        }

        newUserData = await initUser({ role: 'AGENCY_OWNER' });

        if (!data?.customerId && !ctId) return;

        const mdId = await generateRandomMongoId();

        const response = await upsertAgency({
          id: data?.id ? data.id : mdId,
          customerId: data?.customerId || ctId || '',
          address: values.address,
          agencyLogo: values.agencyLogo,
          city: values.city,
          companyPhone: values.companyPhone,
          country: values.country,
          name: values.name,
          state: values.state,
          whiteLabel: values.whiteLabel,
          zipCode: values.zipCode,
          createdAt: new Date(),
          updatedAt: new Date(),
          companyEmail: values.companyEmail,
          connectAccountId: '',
          goal: 5,
        });

        toast({
          title: 'Created Agency',
        });

        form.reset();

        if (data?.id) return router.refresh();

        if (response) {
          return router.refresh();
        }
      } catch (error) {
        console.log(error);
        toast({
          variant: 'destructive',
          title: 'Oops!',
          description: 'could not create your agency',
        });
      }
    });
  }

  const handleDeleteAgency = async () => {
    if (!data?.id) return;
    setDeletingAgency(true);
    //WIP: discontinue the subscription
    try {
      const response = await deleteAgency(data.id);
      toast({
        title: 'Deleted Agency',
        description: 'Deleted your agency and all subaccounts',
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: 'could not delete your agency ',
      });
    }
    setDeletingAgency(false);
  };

  return (
    <AlertDialog>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>
            Lets create an agency for your business. You can edit agency
            settings later from the agency settings tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-4'>
              <FormField
                disabled={pending}
                name='agencyLogo'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint='agencyLogo'
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex flex-col md:flex-row gap-4'>
                <FormField
                  disabled={pending}
                  name='name'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Agency Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Your Agency Name' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={pending}
                  name='companyEmail'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Agency Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='company@email.com' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                disabled={pending}
                name='companyPhone'
                control={form.control}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Agency Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} type='tel' placeholder='+25411999234' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={pending}
                name='whiteLabel'
                control={form.control}
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel>Whitelabel Agency</FormLabel>
                      <FormDescription>
                        Turning on <strong>whilelabel</strong> mode will show
                        your agency logo to all sub accounts by default. You can
                        overwrite this functionality through sub account
                        settings.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={pending}
                name='address'
                control={form.control}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='1234 st...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex flex-col md:flex-row gap-4'>
                <FormField
                  disabled={pending}
                  name='city'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Your city' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{' '}
                <FormField
                  disabled={pending}
                  name='zipCode'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input {...field} type='number' placeholder='29098' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{' '}
                <FormField
                  disabled={pending}
                  name='state'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Your State' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                disabled={pending}
                name='country'
                control={form.control}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Your Country' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {data?.id && (
                <div className='flex flex-col gap-2'>
                  <FormLabel>Create A Goal</FormLabel>

                  <FormDescription>
                    ✨ Create a goal for your agency. As your business grows
                    your goals grow too so dont forget to set the bar higher!
                  </FormDescription>

                  <NumberInput
                    defaultValue={data?.goal}
                    onValueChange={async (val) => {
                      if (!data?.id) return;

                      await updateAgencyDetails(data.id, { goal: val });

                      await saveActivityLogsNotification({
                        agencyId: data.id,
                        description: `Updated the agency goal to | ${val} Sub Account`,
                        subaccountId: undefined,
                      });

                      router.refresh();
                    }}
                    min={1}
                    className='bg-background !border !border-input'
                    placeholder='Sub Account Goal'
                  />
                </div>
              )}
              <Button type='submit' disabled={pending}>
                {pending ? <Loading /> : 'Save Agency Information'}
              </Button>
            </form>
          </Form>

          {data?.id && (
            <div className='flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4'>
              <div>
                <div>Danger Zone</div>
              </div>
              <div className='text-muted-foreground'>
                Deleting your agency cannpt be undone. This will also delete all
                sub accounts and all data related to your sub accounts. Sub
                accounts will no longer have access to funnels, contacts etc.
              </div>
              <AlertDialogTrigger
                disabled={pending || deletingAgency}
                className='text-red-600 p-2 text-center mt-2 rounded-md hove:bg-red-600 hover:text-white whitespace-nowrap'>
                {deletingAgency ? 'Deleting...' : 'Delete Agency'}
              </AlertDialogTrigger>
            </div>
          )}

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className='text-left'>
                Are you absolutely sure?
              </AlertDialogTitle>

              <AlertDialogDescription className='text-left'>
                This action cannot be undone. This will permanently delete the
                Agency account and all related sub accounts.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className='flex items-center'>
              <AlertDialogCancel className='mb-2'>Cancel</AlertDialogCancel>

              <AlertDialogAction
                disabled={deletingAgency}
                className='bg-destructive hover:bg-destructive'
                onClick={handleDeleteAgency}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};
export default AgencyDetails;
