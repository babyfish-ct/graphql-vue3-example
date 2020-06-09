import { defineComponent } from '@vue/composition-api';

export default defineComponent({
    props: {
        value: {
            type: undefined,
            required: false
        }
    },
    setup(props, ctx) {
        return () => {
            if (props.value === undefined) {
                return <div>Not loaded</div>
            }
            if (props.value === null) {
                return <div>No data</div>
            }
            const defaultSlotFunc = ctx.slots.default;
            if (defaultSlotFunc === undefined) {
                return <div>{props.value}</div>
            }
            return defaultSlotFunc();
        };
    }
});