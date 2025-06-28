import React from 'react';
import { AccountCard } from './account-card';
import { useGetAccountQuery } from '@/store/api/accountApi';
import { useDispatch } from 'react-redux';
import { useUser } from '@clerk/nextjs';

const Accounts = () => {
  const dispatch = useDispatch();
const { user } = useUser();

  const { data: accounts = [], isLoading, error, refetch } = useGetAccountQuery({clerkId:user?.id});

  // Enhanced refetch function that ensures fresh data
  const handleRefetch = async () => {
    try {
      await refetch();
      // Optionally, you can also invalidate the cache completely
      // dispatch(accountApi.util.invalidateTags(['Account']));
    } catch (error) {
      console.error('Failed to refetch accounts:', error);
    }
  };

  if (isLoading) return <div>Loading accounts...</div>;

  if (error) return <div>Error loading accounts: {error.message}</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <AccountCard 
          key={account.id} 
          account={account} 
          refetch={handleRefetch} 
        />
      ))}
    </div>
  );
};

export default Accounts;