import { defineComponent, PropType, ref } from '@vue/composition-api';
import { Department } from '@/model/Department';
import { Employee } from '@/model/Employee';
import { VNode } from 'vue/types/umd';
import { useApolloClient } from '@/common/ApolloHook';
import { gql, FetchResult } from 'apollo-boost';
import { GraphQLRoot } from '@/model/graphql/GraphQLRoot';
import { Modal } from 'ant-design-vue';
import Value, {hasValue} from '@/common/Value';

const LABEL_SPAN = 8;
const VALUE_SPAN = 24 - LABEL_SPAN;

export default defineComponent({
    props: {
        department: {
            type: Object as PropType<Department>,
            required: true
        },
        depth: {
            type: Number,
            default: 1
        }
    },
    setup(props, ctx) {

        const dialogRef = ref<boolean>(false);

        const renderEmployee = (employee: Employee, index: number): VNode => {
            return (
                /*
                * For real business projects, assign the object id to the 'key' is the best choice,
                * 
                * but this demo shows the dynamic query so that the object id may be undefined,
                * there is no better choice except set the 'key' as index
                * 
                * It's unnecessary to use the index in real business projects
                */
                // <List.Item key={index}>
                //     <EmployeeView employee={employee} depth={depth + 1}/>
                // </List.Item>
                <div>employee</div>
            );
        };

        const client = useApolloClient();
        const deletingRef = ref<boolean>(false);
        const delete_ = async (): Promise<FetchResult<GraphQLRoot<boolean>>> => {
            deletingRef.value = true;
            try {
                return await client.mutate({
                    mutation: gql`mutation($id: Long!) {
                        deleteDepartment(id: $id)
                    `,
                    variables: { id: props.department.id }
                });
            } finally {
                deletingRef.value = false;
            }
        };

        const onEditClick = () => { dialogRef.value = true };
        const onDialogClose = (saved: boolean) => {
            dialogRef.value = false;
            if (saved) {
                ctx.emit('edit', props.department.id);
            }
        };

        const onConfirmDelete = async () => {
            const {errors} = await delete_();
            if (errors !== undefined) {
                Modal.error({
                    title: "Error",
                    content: <div>error</div>
                });
            } else {
                Modal.success({
                    title: "Success",
                    content: "Departent has been deleted"
                });
                ctx.emit('edit', props.department.id);
            }
        };

        return () => {
            return (
                <div style={{flex: 1}}>
                    <a-card title={
                        <div style={{display: 'flex'}}>
                            <div style={{flex: 1}}>
                                Department(Level-{props.depth})
                            </div>
                            {
                                props.depth === 1 && props.department.id === undefined ?
                                <div style={{fontSize: 12, fontWeight: 'normal'}}>
                                    Cannot edit/delete because there's no id
                                </div> :
                                undefined
                            }
                            {
                                props.depth === 1 && props.department.id !== undefined?
                                <a-button-group>
                                    <a-button onClick={onEditClick}>
                                        <a-icon type='edit-outlined' />Edit
                                    </a-button>
                                    <a-popconfirm
                                    title="Are you sure delete this department?"
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
                        <div className={`object-view-${props.depth}`}>
                            <a-row>
                                <a-col span={LABEL_SPAN}>Id</a-col>
                                <a-col span={VALUE_SPAN}><Value value={props.department.id}/></a-col>
                            </a-row>
                            <a-row>
                                <a-col span={LABEL_SPAN}>Name</a-col>
                                <a-col span={VALUE_SPAN}><Value value={props.department.name}/></a-col>
                            </a-row>
                            <a-row>
                                <a-col span={LABEL_SPAN}>Average salary</a-col>
                                <a-col span={VALUE_SPAN}><Value value={props.department.avgSalary}/></a-col>
                            </a-row>
                            <a-row>
                                <a-col span={hasValue(props.department.employees) ? 24 : LABEL_SPAN}>Employees</a-col>
                                <a-col span={hasValue(props.department.employees) ? 24 : VALUE_SPAN}>
                                    <Value value={props.department.employees}>
                                        <div style={{paddingLeft: '2rem'}}>
                                            <a-list
                                            dataSource={props.department.employees}
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
                        // id={department.id}
                        // onClose={onDialogClose}/> : 
                        // undefined
                    }
                </div>
            );
        }
    }
});
