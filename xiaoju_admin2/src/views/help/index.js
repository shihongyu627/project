import HelpEdit from "./edit.vue";
import HelpList from './list.vue'
import HelpAbout from './about.vue'
import HelpArticle from './article.vue'
import * as HelpClass from './class'
let a = Object.assign({HelpEdit, HelpList, HelpAbout, HelpArticle}, HelpClass)
export default a;
