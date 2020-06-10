import {defineComponent, PropType} from '@vue/composition-api';
import {DepartmentSpecification} from '../model/DepartmentSpecification';
import { GraphQLTreeNode, DEPARTMENT_BASE_TREE_NODES, EMPLOYEE_BASE_TREE_NODES, childGraphQLTreeNodes } from '@/model/dynamic/GraphQLTreeNode';
import { DepartmentSortedType } from '@/model/DepartmentSortedType';

function createTreeNodes(): GraphQLTreeNode[] {
    return [
        ...DEPARTMENT_BASE_TREE_NODES,
        {
            key: "avgSalary",
            title: <span style={{fontWeight: 'bold'}}>Average Slary(aggregation value)</span>
        },
        { 
            key: "employees", 
            title: <span style={{fontWeight: 'bold'}}>Employees(one-to-many assoication)</span>,
            children: [
                ...childGraphQLTreeNodes("employees", EMPLOYEE_BASE_TREE_NODES),
                { 
                    key: "employees.supervisor", 
                    title: <span style={{fontWeight: 'bold'}}>Supervisor(many-to-one assciation)</span>,
                    children: childGraphQLTreeNodes("employees.supervisor", EMPLOYEE_BASE_TREE_NODES)
                },
                { 
                    key: "employees.subordinates", 
                    title: <span style={{fontWeight: 'bold'}}>Subordinates(one-to-many association)</span>,
                    children: childGraphQLTreeNodes("employees.subordinates", EMPLOYEE_BASE_TREE_NODES)
                }
            ]
        },
    ];
}

export default defineComponent({
    props: {
        value: {
            type: Object as PropType<DepartmentSpecification>,
            required: true
        }
    },
    setup(props, ctx) {
        
        const treeNodes = createTreeNodes();

        const onNameChange = (e: {target: HTMLInputElement}) => {
            const text = e.target.value.trim();
            const name = text === "" ? undefined : text;
            ctx.emit('input', {
                ...props.value,
                name
            });
        };
        const onSortedTypeChange = (sortedType: DepartmentSortedType) => {
            ctx.emit('input', {
                ...props.value,
                sortedType
            });
        };
    
        const onDescendingChange = (e: {target: HTMLInputElement}) => {
            ctx.emit('input', {
                ...props.value,
                descending: e.target.checked
            });
        };
    
        const onGraphQLPathChange = (checkedInfo: {checked: string[]} | string[]) => {
            const keys = checkedInfo instanceof Array ?
                checkedInfo as string[] :
                checkedInfo.checked as string[];
            ctx.emit('input', {
                ...props.value,
                graphQLPaths: keys
            });
        };
    
        return () => {
            return (
                <a-form layout="horizontal" labelCol={{span: 8}} wrapperCol={{span: 16}}>
                    <a-form-item label="Name">
                        <a-input value={props.value.name} onInput={onNameChange}/>
                    </a-form-item>
                    <a-form-item label="Sorted type">
                        <a-select
                        value={props.value.sortedType} 
                        onChange={onSortedTypeChange}>
                            <a-select-option value="ID">Id</a-select-option>
                            <a-select-option value="NAME">Name</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="descending">
                        <a-checkbox checked={props.value.descending} onChange={onDescendingChange}/>
                    </a-form-item>
                    <a-form-item label="GraphQL structure">
                        <a-tree 
                        checkable 
                        treeData={treeNodes} 
                        defaultExpandAll={true}
                        checkedKeys={props.value.graphQLPaths}
                        onCheck={onGraphQLPathChange}/>
                    </a-form-item>
                </a-form>
            );
        }
    }
});

