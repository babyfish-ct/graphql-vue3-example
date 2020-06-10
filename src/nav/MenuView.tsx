import { defineComponent, ref, computed } from '@vue/composition-api';
import { MenuItem } from 'ant-design-vue/types/menu/menu-item';
import { DEPARTMENTS, EMPLOYEES } from '@/router';

export default defineComponent({

    setup(props, ctx) {
        
        const selectKeysRef = ref<string[]>([]);
        const refresh = () => {
            const name = ctx.root.$router.currentRoute.name;
            selectKeysRef.value = name === undefined || name === null ? [] : [name];
        };
        refresh();
        ctx.root.$router.afterEach(refresh);

        const onMenuSelect = (item: MenuItem, keys: string[]) => {
            let path = '/departments';
            if (keys.length !== 0) {
                path = `/{keys[0]}`;
            }
            ctx.root.$router.replace(path);
        };
        return () => {
            return (
                <div>
                    <a-menu 
                    mode="horizontal"
                    selectedKeys={selectKeysRef.value}
                    onMenuSelect={onMenuSelect}
                    >
                        <a-menu-item key={DEPARTMENTS}>
                            <router-link to={'/departments'}>Department Management</router-link>
                        </a-menu-item>
                        <a-menu-item key={EMPLOYEES}>
                            <router-link to={'/employees'}>Employee Managment</router-link>
                        </a-menu-item>
                    </a-menu>
                </div>
            );
        }
    }
});