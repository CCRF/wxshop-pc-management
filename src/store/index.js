import {createStore} from "vuex";
import menu from "@/store/modules/menu";
import vuexAlong from "vuex-along";

const store = createStore({
    modules:{
        menu,
    },
    plugins: [vuexAlong({
        name: 'navTree',
        local: {
            navTree: ["menu.navTree"]
        }
    })]
})
export default store