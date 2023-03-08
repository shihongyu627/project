import ProductEdit from "./edit.vue";
import ProductList from './list.vue'
import * as ProductClass from './class'
let a = Object.assign({ProductEdit, ProductList}, ProductClass)
export default a;
