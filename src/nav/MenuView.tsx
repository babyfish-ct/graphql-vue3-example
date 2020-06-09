import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({

    setup() {
        return () => {
            return (
                <div>
                    <a-menu 
                    mode="horizontal">
                        <a-menu-item>
                            <router-link to={'/departments'}>Department Management</router-link>
                        </a-menu-item>
                        <a-menu-item>
                            <router-link to={'/employees'}>Employee Managment</router-link>
                        </a-menu-item>
                    </a-menu>
                </div>
            );
        }
    }
});