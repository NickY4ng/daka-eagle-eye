import { createPinia } from "pinia";
import PiniaPluginPersistedState from "pinia-plugin-persistedstate";

const store = createPinia();
store.use(PiniaPluginPersistedState);

export { store };
