import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import { inject } from '@vue/composition-api';

export const APOLLO_CLIENT_SYMBOL = Symbol("Apollo Client");

export function useApolloClient(): ApolloClient<NormalizedCacheObject> {
    const client = inject<ApolloClient<NormalizedCacheObject> | undefined>(APOLLO_CLIENT_SYMBOL);
    if (client === undefined) {
        throw new Error("No apollo client");
    }
    return client;
}