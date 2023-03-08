// initial state
const baseName = "/api/trouble";

const createbatch = baseName + "/createbatch";
const batchdetail = baseName + "/batchdetail";
const troubledetail = baseName + "/detail"; //通过id查询隐患详情
const batchlists = baseName + "/batchlists";
const batchCategory = baseName + "/category";
const troubleLists = baseName + "/lists";
const troubleCreatereply = baseName + "/createreply";
const troubleReplypass = baseName + "/replypass";
const batchscorelists = baseName + "/batchscorelists";
const batchscoredetail = baseName + "/batchscoredetail";
const troubleBatchdown = baseName + "/batchdown";
const troubleScoredown = baseName + "/scoredown";
const troubleBatchsign = baseName + "/batchsign"; //发布提交检查后，监理、建设、施工签字确认，街道可签字
const troubleSavereply = baseName + "/savereply"; //保存隐患整改数据
const troubleSubmitbatchreply = baseName + "/submitbatchreply"; //发布提交全部整改
const batchreplypass = baseName + "/batchreplypass"; //发布提交整改审核
const troubleStatistics = baseName + "/statistics"; //通过项目/日期查询隐患统计数据
const troubleBatchlog = baseName + "/batchlog"; //通过id查询检查日志列表
const batchreplydown = baseName + "/batchreplydown"; //通过id查询隐患检查回复单下载


export {
  createbatch,
  batchdetail,
  troubledetail,
  batchlists,
  batchCategory,
  troubleLists,
  troubleCreatereply,
  troubleReplypass,
  batchscorelists,
  batchscoredetail,
  troubleBatchdown,
  troubleScoredown,
  troubleBatchsign,
  troubleSavereply,
  troubleSubmitbatchreply,
  batchreplypass,
  troubleStatistics,
  troubleBatchlog,
  batchreplydown
};
