import { supabaseClient } from '@/core/api/supabaseClient';
import { GraphQLClient } from 'graphql-request';

export const graphql = async () => {
  const { data } = await supabaseClient.auth.getSession();

  return new GraphQLClient(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/graphql/v1`,
    {
      headers: {
        Authorization: `Bearer ${data?.session?.access_token}`,
        apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string,
      },
    },
  );
};
