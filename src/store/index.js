import {createStore} from "vuex";
import menu from "@/store/modules/menu";
import user from "@/store/modules/user";
import vuexAlong from "vuex-along";

const store = createStore({
    modules:{
        menu,
        user
    },
    plugins: [vuexAlong({
        name: 'navTree',
        local: {
            navTree: ["menu.navTree"]
        }
    })]
})
export default store