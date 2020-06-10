import { defineComponent } from '@vue/composition-api';

export function hasValue<T>(value: T | null | undefined): boolean {
    if (value === undefined) {
        return false;
    }
    if (value === null) {
        return false;
    }
    if (Array.isArray(value) && value.length === 0) {
        return false;
    }
    return true;
}

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