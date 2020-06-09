import {defineComponent, PropType} from '@vue/composition-api';
import {DepartmentSpecification} from '../model/DepartmentSpecification';

export default defineComponent({
    props: {
        value: {
            type: Object as PropType<DepartmentSpecification>,
            required: true
        }
    },
    setup(props, ctx) {
        const onNameInput = (e: {target: HTMLInputElement}) => {
            const text = e.target.value.trim();
            const name = text === "" ? undefined : text;
            ctx.emit('input', {
                ...props.value,
                name
            });
        };
        return () => {
            return (
                <a-form layout="horizontal" labelCol={{span: 8}} wrapperCol={{span: 16}}>
                    <a-form-item label="Name">
                        <a-input value={props.value.name} onInput={onNameInput}/>
                    </a-form-item>
                </a-form>
            );
        }
    }
});