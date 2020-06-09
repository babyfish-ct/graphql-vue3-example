import { useApolloClient } from './ApolloHook';
import { OperationVariables, QueryOptions, ApolloQueryResult, NetworkStatus } from 'apollo-boost';
import { ref, watch } from '@vue/composition-api';
import { Ref } from '@vue/composition-api/dist/reactivity/ref';

export interface SkipQueryOptions<
    TVariables = OperationVariables
> extends QueryOptions<TVariables> {
    skip?: boolean;
}

export interface SkipQueryResult<T> extends ApolloQueryResult<T> {
    refetch: () => void;
}

export function useSkipQuery<T = any, TVariables = OperationVariables>(
    optionsRef: Ref<SkipQueryOptions<TVariables>>
): Ref<SkipQueryResult<T | undefined>> {
    const client = useApolloClient();
    const queryIdRef = ref<number>(0);
    const resultRef = ref<SkipQueryResult<T | undefined>>({
        loading: false,
        refetch: () => { /* eslint */}
    });
    const refetch = async () => {
        if (optionsRef.value.skip !== true) {
            const queryId = ++queryIdRef.value;
            resultRef.value = {
                data: undefined,
                loading: false,
                networkStatus: NetworkStatus.loading,
                stale: false,
                refetch
            };
            try {
                const result = await client.query(optionsRef.value);
                if (queryId === queryIdRef.value) {
                    resultRef.value = {
                        ...result,
                        refetch
                    };
                }
            } finally {
                resultRef.value.loading = false;
            }
        }
    };
    watch(() => optionsRef.value, refetch);
    return resultRef;
}