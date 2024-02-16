import { createUploadthing, type FileRouter } from 'uploadthing/next';
// import { UploadThingError } from 'uploadthing/server';
import { auth } from '@clerk/nextjs';
const f = createUploadthing();

const authenticateUser = () => {
  const user = auth();
  // If you throw, the user will not be able to upload
  if (!user) throw new Error('Unauthorized');
  // Whatever is returned here is accessible in onUploadComplete as `metadata`
  return user;
}; // Fake auth function

/* .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }), */

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  subaccountLogo: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(() => {}),
  avatar: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(() => {}),
  agencyLogo: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(() => {}),
  media: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authenticateUser)
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
