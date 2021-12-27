/**
 * importing createStore function from redux
 */
import { persistStore} from 'redux-persist';
import store from "./store";

let persistor = persistStore(store);

export default persistor;
