import Vue from 'vue';
import boxHeader from './table/boxHeader.vue';
import editTable from './table/editTable.vue';
import playVideo from './table/playVideo.vue';
import popChannel from './table/popChannel.vue';
import uploadFile from './form/uploadFile.vue';
import formHeader from './form/formHeader.vue';
import formDate from './form/formDate.vue';
import formTime from './form/formTime.vue';
import formUeditor from './form/formUeditor.vue';
import formEditor from './form/formEditor.vue';
import formMap from './form/formMap.vue';
import formMapArea from './form/formMapArea.vue';
import formMapBox from './form/formMapBox.vue';
import formAddress from './form/formAddress.vue';
import formBody from './form/formBody.vue';
import popBox from './form/popBox.vue';
import buttonBox from './form/buttonBox.vue';
import buttonAdd from './form/buttonAdd.vue';
import buttonBack from './form/buttonBack.vue';
import buttonSave from './form/buttonSave.vue';
import buttonSub from './form/buttonSub.vue';
import selectDrop from './form/selectDrop.vue';
import cardHeader from './market/cardHeader.vue';
import cardBox from './market/cardBox.vue';


const coms = {
    boxHeader,
    editTable,
    playVideo,
    popChannel,
    uploadFile,
    formHeader,
    formDate,
    formTime,
    formUeditor,
    formEditor,
    formMap,
    formMapArea,
    formMapBox,
    formBody,
    popBox,
    buttonAdd,
    buttonBox,
    buttonBack,
    buttonSave,
    buttonSub,
    selectDrop,
    cardHeader,
    cardBox,
    formAddress
}

const install = function(Vue, opts = {}) {
    if (install.installed) return;

    Object.keys(coms).forEach(key => {
        Vue.component(key, coms[key])
    });
};
install(Vue);

export default coms;
