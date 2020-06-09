import {defineComponent, PropType} from '@vue/composition-api';
import { ApolloQueryResult } from 'apollo-boost';

export default defineComponent({
    props: {
        value: {
            type: Object as PropType<ApolloQueryResult<any>>,
            required: true
        }
    },
    setup(props, ctx) {
        return () => {
            if (props.value.loading) {
                return <a-spin tip="Loading"/>;
            }
            if (props.value.errors !== undefined && props.value.errors.length !== 0) {
                return <div>Error</div>
            }
            const defaultSlotFunc = ctx.slots.default;
            if (defaultSlotFunc === undefined) {
                return <div></div>
            }
            return ctx.slots.default();
        };
    }
});