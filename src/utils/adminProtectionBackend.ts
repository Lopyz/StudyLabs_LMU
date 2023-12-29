import { GetServerSideProps } from 'next';
import { buildClerkProps, getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';
import jwt from 'jsonwebtoken';

export const adminProtectionBackend: GetServerSideProps = async (ctx) => {
  const { sessionId } = getAuth(ctx.req);

  if (!sessionId) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    };
  }

  const token = await clerkClient.sessions.getToken(sessionId, 'adminJWT');
  const decodedToken = jwt.decode(token);
  const userOrganizations = decodedToken?.['user.organizations'];
  const orgId = process.env.NEXT_PUBLIC_CLERK_ADMIN_ORGANIZATION_ID;

  if (orgId && userOrganizations && userOrganizations[orgId] !== 'org:admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { ...buildClerkProps(ctx.req) },
  };
};
