import { defineComponent, provide } from '@vue/composition-api';
import AppView from './nav/AppView';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { APOLLO_CLIENT_SYMBOL } from './common/ApolloHook';

export default defineComponent({
    
    setup() {

        const apolloClient = new ApolloClient({
            link: new HttpLink({
                uri: 'http://localhost:8080/graphql',
            }),
            cache: new InMemoryCache(),
            defaultOptions: {
                query: {
                    fetchPolicy: 'no-cache'
                }
            }
        });

        provide(APOLLO_CLIENT_SYMBOL, apolloClient);

        return () => (
            <AppView/>
        )
    }
});