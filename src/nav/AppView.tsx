import { defineComponent } from '@vue/composition-api';
import classes from './AppView.module.scss';
import MenuView from './MenuView';

export default defineComponent({
    setup() {
        return () => {
            return (
                <a-layout>
                    <a-layout-header class={classes.header}>
                        <div class={classes['header-core']}>
                            <div style={{width: 496}}>GraphQL React Example</div>
                            <div style={{flex: 1}}>
                                <MenuView/>
                            </div>
                        </div>
                    </a-layout-header>
                    <a-layout-content class='background'>
                        <router-view/>
                    </a-layout-content>
                </a-layout>
            );
        };
    }
});
