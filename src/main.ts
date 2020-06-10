import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import { router } from './router';
import App from './App';

Vue.config.productionTip = false;

Vue.use(VueCompositionApi);

Vue.use(Antd);

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
