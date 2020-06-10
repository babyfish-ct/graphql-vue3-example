import { DocumentNode, ErrorPolicy, FetchPolicy, NetworkStatus } from 'apollo-boost';
import { SkipQueryResult, useSkipQuery } from './SkipQueryHook';
import { Ref, computed, ref } from '@vue/composition-api';
import { Page } from './Page';
import { GraphQLRoot, unwrapRoot } from '@/model/graphql/GraphQLRoot';

export interface PageQueryOptions {
    skip?: boolean;
    countQuery: DocumentNode;
    listQuery: DocumentNode;
    pageNo: number;
    pageSize: number;
    variables?: object;
    errorPolicy?: ErrorPolicy;
    fetchResults?: boolean;
    metadata?: any;
    context?: any;
    fetchPolicy?: FetchPolicy;
}

export function usePageQuery<E>(
    optionsRef: Ref<PageQueryOptions>,
    limitArgumentName = "limit",
    offsetArgumentName = "offset"
): Ref<SkipQueryResult<Page<E> | undefined>> {
    if (optionsRef.value.pageNo < 1) {
        throw new Error();
    }
    if (optionsRef.value.pageSize < 1) {
        throw new Error();
    }
    const countOptionsRef = computed(() => {
        return {
            skip: optionsRef.value.skip,
            query: optionsRef.value.countQuery,
            variables: optionsRef.value.variables,
            errorPolicy: optionsRef.value.errorPolicy,
            fetchResults: optionsRef.value.fetchResults,
            metadata: optionsRef.value.metadata,
            context: optionsRef.value.context,
            fetchPolicy: optionsRef.value.fetchPolicy
        };
    });
    const countResultRef = useSkipQuery<GraphQLRoot<number>>(countOptionsRef);
    const rowCountRef = computed<number | undefined>(() => {
        if (countResultRef.value.loading || countResultRef.value.errors) {
            return undefined;
        }
        return unwrapRoot(countResultRef.value.data);
    });
    const pageCountRef = computed<number | undefined>(() => {
        if (rowCountRef.value === undefined) {
            return undefined;
        }
        const pageSize = optionsRef.value.pageSize;
        return Math.floor((rowCountRef.value + pageSize - 1) / pageSize);
    });
    const actualPageNoRef = computed<number | undefined>(() => {
        if (pageCountRef.value === undefined) {
            return undefined;
        }
        return Math.max(
            1,
            Math.min(optionsRef.value.pageNo, pageCountRef.value)
        )
    });
    const listOptionsRef = computed(() => {
        return {
            skip: optionsRef.value.skip || rowCountRef.value === undefined || rowCountRef.value == 0,
            query: optionsRef.value.listQuery,
            variables: {
                ...optionsRef.value.variables,
                [limitArgumentName]: optionsRef.value.pageSize,
                [offsetArgumentName]: optionsRef.value.pageSize * ((actualPageNoRef.value ?? 1) - 1) 
            },
            errorPolicy: optionsRef.value.errorPolicy,
            fetchResults: optionsRef.value.fetchResults,
            metadata: optionsRef.value.metadata,
            context: optionsRef.value.context,
            fetchPolicy: optionsRef.value.fetchPolicy
        }
    });
    const listResultRef = useSkipQuery<GraphQLRoot<E[]>>(listOptionsRef);
    const resultRef = computed<SkipQueryResult<Page<E> | undefined>>(() => {
        let page: Page<E> | undefined;
        if (countResultRef.value.data !== undefined && listResultRef.value.data !== undefined) {
            if (rowCountRef.value === 0) {
                page = {
                    rowCount: 0,
                    pageCount: 0,
                    pageNo: 1,
                    pageSize: optionsRef.value.pageSize,
                    entities: []
                }
            } else {
                page = {
                    rowCount: rowCountRef.value ?? 0,
                    pageCount: pageCountRef.value ?? 0,
                    pageNo: actualPageNoRef.value ?? 0,
                    pageSize: optionsRef.value.pageSize,
                    entities: unwrapRoot(listResultRef.value.data) ?? []
                };
            }
        }
        return {
            data: page,
            loading: false,
            stale: false,
            networkStatus: NetworkStatus.loading,
            refetch: async () => {
                await countResultRef.value.refetch();
                listResultRef.value.refetch();
            }
        };
    });
    return resultRef;
}
