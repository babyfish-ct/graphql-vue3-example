import { defineComponent, computed, ref } from '@vue/composition-api';
import { gql } from 'apollo-boost';
import SpecificationView from './SpecificationView';
import { DepartmentSpecification } from '@/model/DepartmentSpecification';
import ApolloQueryResultView from '@/common/ApolloQueryResultView';
import { usePageQuery, PageQueryOptions } from '@/common/PageQueryHook';

export default defineComponent({
    setup() {
        const specificationRef = ref<DepartmentSpecification>({
            sortedType: "ID",
            descending: false,
            graphQLPaths: []
        });
        const onSpecificationInput = (specification: DepartmentSpecification) => {
            specificationRef.value = specification;
        }
        const optionsRef = computed<PageQueryOptions>(() => {
            return {
                countQuery: gql`query($name: String) {
                    departmentCount(name: $name)
                }`,
                listQuery: gql`query(
                    $name: String, 
                    $sortedType: DepartmentSortedType, 
                    $descending: Boolean,
                    $limit: Int,
                    $offset: Int
                ) {
                    departments(
                        name: $name, 
                        sortedType: $sortedType, 
                        descending: $descending,
                        limit: $limit,
                        offset: $offset
                    ) {
                        id,
                        name,
                        employees {
                            id,
                            name
                        }
                    }
                }`,
                pageNo: 1,
                pageSize: 5,
                variables: {
                    name: specificationRef.value.name === "" ? 
                        undefined : 
                        specificationRef.value.name,
                    sortedType: "ID",
                    descending: false
                }
            };
        });
        const resultRef = usePageQuery(optionsRef);
        return () => {
            return (
                <a-layout layout="">
                    <a-layout-sider theme="light" width={550}>
                        <SpecificationView 
                        value={specificationRef.value} 
                        onInput={onSpecificationInput}/>
                    </a-layout-sider>
                    <a-layout-content>
                        <ApolloQueryResultView value={resultRef.value}>
                            {JSON.stringify(resultRef.value.data)}
                        </ApolloQueryResultView>
                    </a-layout-content>
                </a-layout>
            );
        };
    }
});