import { defineComponent } from '@vue/composition-api';
import classes from './AppView.module.scss';
import MenuView from './MenuView';

export default defineComponent({
    setup() {
        return () => {
            return (
                <div>
                    <div class={classes.nav}>
                        <MenuView/>
                    </div>
                    <router-view class={classes.content}/>
                </div>
            );
        };
    }
});
