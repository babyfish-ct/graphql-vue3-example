import { defineComponent, computed, ref } from '@vue/composition-api';
import { gql } from 'apollo-boost';
import SpecificationView from './SpecificationView';
import { DepartmentSpecification } from '@/model/DepartmentSpecification';
import ApolloQueryResultView from '@/common/ApolloQueryResultView';
import { usePageQuery, PageQueryOptions } from '@/common/PageQueryHook';
import { createDynamicGraphQLBody } from '@/model/dynamic/GraphQLDynamicBody';
import { Department } from '@/model/Department';
import DepartmentView from './DepartmentView';

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
                skip: specificationRef.value.graphQLPaths.length === 0,
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
                        ${createDynamicGraphQLBody(specificationRef.value.graphQLPaths)}
                    }
                }`,
                pageNo: 1,
                pageSize: 5,
                variables: {
                    name: specificationRef.value.name === "" ? 
                        undefined : 
                        specificationRef.value.name,
                    sortedType: specificationRef.value.sortedType,
                    descending: specificationRef.value.descending
                }
            };
        });
        const resultRef = usePageQuery<Department>(optionsRef);
        return () => {
            return (
                <a-layout>
                    <a-layout-sider theme="light" width={550}>
                        <div style={{padding: '1rem'}}>
                            <SpecificationView 
                            value={specificationRef.value} 
                            onInput={onSpecificationInput}/>
                        </div>
                    </a-layout-sider>
                    <a-layout-content class='background'>
                        <div>
                            <ApolloQueryResultView value={resultRef.value}>
                                {
                                    resultRef.value.data?.entities?.map(
                                        (department, index) => {
                                            return (
                                                <DepartmentView 
                                                key={index} 
                                                department={department}/>
                                            );
                                        }
                                    )
                                }
                            </ApolloQueryResultView>
                        </div>
                    </a-layout-content>
                </a-layout>
            );
        };
    }
});