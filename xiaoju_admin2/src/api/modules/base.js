// initial state
const baseName = '/admin/api/advert'

// eg
// const advertList = baseName + '/lists'
// const advertGet = baseName + '/get'
// const advertAdd = baseName + '/add'
// const advertEdit = baseName + '/edit'
// const advertDel = baseName + '/del'
// const advertSync = baseName + '/sync'
// const advertSwitch = baseName + '/switch'
// const advertField = baseName + '/field'
// const advertPass = baseName + '/pass'
// const advertDropList = baseName + '/dropList'

// export {
//   advertList,
//   advertGet,
//   advertAdd,
//   advertEdit,
//   advertDel,
//   advertSync,
//   advertSwitch,
//   advertField,
//   advertPass,
//   advertDropList,
// }

const setBaseUrl = (name, baseName) => {
  const urlobj = {}
  urlobj[name+"List"] = baseName + '/lists'
  urlobj[name+"Get"] = baseName + '/get'
  urlobj[name+"Add"] = baseName + '/add'
  urlobj[name+"Edit"] = baseName + '/edit'
  urlobj[name+"Del"] = baseName + '/del'
  urlobj[name+"Sync"] = baseName + '/sync'
  urlobj[name+"Switch"] = baseName + '/switch'
  urlobj[name+"Field"] = baseName + '/field'
  urlobj[name+"Pass"] = baseName + '/pass'
  urlobj[name+"Export"] = baseName + '/export'
  urlobj[name+"Import"] = baseName + '/import'
  urlobj[name+"DropList"] = baseName + '/dropList'
  urlobj[name+"DropTree"] = baseName + '/dropTree'
  return urlobj
}
export {
  setBaseUrl
}