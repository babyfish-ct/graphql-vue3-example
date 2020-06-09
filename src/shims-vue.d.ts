declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '@vue/composition-api/dist/component/component' {
  interface SetupContext {
      readonly refs: { [key: string]: Vue | Element | Vue[] | Element[] };
  }
}
