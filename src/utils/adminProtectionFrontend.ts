import { useEffect, useState } from 'react';
import { useClerk } from '@clerk/nextjs';

type OrganizationMembership = {
  organization: {
    id: string;
  };
};

type AdminStatus = 'loading' | 'error' | boolean;

export const useAdminProtectionFrontend = (): AdminStatus => {
  const { user } = useClerk();
  const [isAdmin, setIsAdmin] = useState<AdminStatus>('loading'); // Initialize to 'loading'

  useEffect(() => {
    if (user) {
      try {
        const adminMembership = user.organizationMemberships.find(
          (membership: OrganizationMembership) => 
            membership.organization.id === process.env.NEXT_PUBLIC_CLERK_ADMIN_ORGANIZATION_ID
        );
        const newIsAdmin = !!adminMembership;
        setIsAdmin(newIsAdmin);
      } catch (error) {
        console.error('Error determining admin status:', error);
        setIsAdmin('error');
      }
    } else {
      setIsAdmin(false);  // set to false if user is null
    }
  }, [user]);

  return isAdmin;
};
