import { defineComponent, PropType, ref, createElement } from '@vue/composition-api';
import { Employee } from '@/model/Employee';
import { gql, FetchResult } from 'apollo-boost';
import { useApolloClient } from '@/common/ApolloHook';
import { GraphQLRoot } from '@/model/graphql/GraphQLRoot';
import { Modal } from 'ant-design-vue';
import Value, { hasValue } from '@/common/Value';
import DepartmentView from '@/department/DepartmentView';

const LABEL_SPAN = 8;
const VALUE_SPAN = 24 - LABEL_SPAN;

const EmployeeView = defineComponent({
    props: {
        employee: {
            type: Object as PropType<Employee>,
            required: true
        },
        depth: {
            type: Number,
            default: 1
        }
    },
    setup(props, ctx) {
        const dialogRef = ref<boolean>(false);
        const renderEmployee = (employee: Employee, index: number) => {
            return (
                /*
                * For real business projects, assign the object id to the 'key' is the best choice,
                * 
                * but this demo shows the dynamic query so that the object id may be undefined,
                * there is no better choice except set the 'key' as index
                * 
                * It's unnecessary to use the index in real business projects
                */
                <a-list-item key={index}>
                    {
                        createElement(EmployeeView, {
                            props: {
                                employee,
                                depth: props.depth + 1
                            }
                        })
                    }
                </a-list-item>
            );
        };

        const client = useApolloClient();
        const deletingRef = ref<boolean>(false);
        const delete_ = async (): Promise<FetchResult<GraphQLRoot<boolean>>> => {
            deletingRef.value = true;
            try {
                return await client.mutate({
                    mutation: gql`mutation($id: Long!) {
                        deleteEmployee(id: $id)
                    }`,
                    variables: { id: props.employee.id }
                });
            } finally {
                deletingRef.value = false;
            }
        };

        const onEditClick = () => {
            dialogRef.value = true;
        };
        const onDialogClose = (saved: boolean) => {
            dialogRef.value = false;
            if (saved) {
                ctx.emit('edit', props.employee.id);
            }
        };

        const onConfirmDelete = async () => {
            const {errors} = await delete_();
            if (errors !== undefined) {
                Modal.error({
                    title: "Error",
                    content: <div>errors</div>
                });
            } else {
                Modal.success({
                    title: "Success",
                    content: "Employee has been deleted"
                });
                ctx.emit('delete', props.employee.id);
            }
        };

        return () => {
            return (
                <div style={{flex:1}}>
                    <a-card title={
                        <div style={{display: 'flex'}}>
                            <div style={{flex: 1}}>
                                Employee(Level-{props.depth})
                            </div>
                            {
                                props.depth === 1 && props.employee.id === undefined ?
                                <div style={{fontSize: 12, fontWeight: 'normal'}}>
                                    Cannot edit/delete because there's no id
                                </div> :
                                undefined
                            }
                            {
                                props.depth === 1 && props.employee.id !== undefined?
                                <a-button-group>
                                    <a-button onClick={onEditClick}>
                                        <a-icon type='edit-outlined' />Edit
                                    </a-button>
                                    <a-popconfirm
                                    title="Are you sure delete this employee?"
                                    onConfirm={onConfirmDelete}
                                    okText="Yes"
                                    cancelText="No">
                                        <a-button disabled={deletingRef.value}>
                                            {
                                                deletingRef.value ?
                                                <a-icon type='loading-outlined' /> :
                                                <a-icon type='delete-outlined' />
                                            }
                                            Delete
                                        </a-button>
                                    </a-popconfirm>
                                </a-button-group> :
                                undefined
                            }
                        </div>
                    }>
                        <div class={`object-view-${props.depth}`}>
                            <a-row>
                                <a-col span={LABEL_SPAN}>Id</a-col>
                                <a-col span={VALUE_SPAN}><Value value={props.employee.id}/></a-col>
                            </a-row>
                            <a-row>
                                <a-col span={LABEL_SPAN}>Name</a-col>
                                <a-col span={VALUE_SPAN}><Value value={props.employee.name}/></a-col>
                            </a-row>
                            <a-row>
                                <a-col span={LABEL_SPAN}>Gender</a-col>
                                <a-col span={VALUE_SPAN}><Value value={props.employee.gender}/></a-col>
                            </a-row>
                            <a-row>
                                <a-col span={LABEL_SPAN}>Salary</a-col>
                                <a-col span={VALUE_SPAN}><Value value={props.employee.salary}/></a-col>
                            </a-row>
                            <a-row>
                                <a-col span={hasValue(props.employee.department) ? 24 : LABEL_SPAN}>Department</a-col>
                                <a-col span={hasValue(props.employee.department) ? 24 : VALUE_SPAN}>
                                    <Value value={props.employee.department}>
                                        <div style={{paddingLeft: '2rem'}}>
                                            <DepartmentView 
                                            department={props.employee.department!} 
                                            depth={props.depth + 1}/>
                                        </div>
                                    </Value>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col span={hasValue(props.employee.supervisor) ? 24 : LABEL_SPAN}>Supervisor</a-col>
                                <a-col span={hasValue(props.employee.supervisor) ? 24 : VALUE_SPAN}>
                                    <Value value={props.employee.supervisor}>
                                        <div style={{paddingLeft: '2rem'}}>
                                            <EmployeeView 
                                            employee={props.employee.supervisor!} 
                                            depth={props.depth + 1}/>
                                        </div>
                                    </Value>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col span={hasValue(props.employee.subordinates) ? 24 : LABEL_SPAN}>Subordinates</a-col>
                                <a-col span={hasValue(props.employee.subordinates) ? 24 : VALUE_SPAN}>
                                    <Value value={props.employee.subordinates}>
                                        <div style={{paddingLeft: '2rem'}}>
                                            <a-list
                                            dataSource={props.employee.subordinates}
                                            renderItem={renderEmployee}/>
                                        </div>
                                    </Value>
                                </a-col>
                            </a-row>
                        </div>
                    </a-card>
                    {
                        /*
                        * The attribute 'visible' of EditDialog always is true,
                        * but use the boolean flag to decide whether the dialog should be rendered or not.
                        * 
                        * This is because the parent componnement uses 
                        * the current EmployeeView component in the loop,
                        * don't always create the dialog for each EmployeeView,
                        * just created it when it's necessary
                        */
                        // dialog ?
                        // <EditDialog 
                        // visible={true}
                        // id={employee.id}
                        // onClose={onDialogClose}/> : 
                        // undefined
                    }
                </div>
            );
        }
    }
});

export default EmployeeView;