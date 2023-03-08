/**
 * 通过name查询items下标
 *
 * @param name 字段名
 * @param items 字段集合
 */

function findIndexItems(name: string, items: any[]) {
  if (!name) {
    return -1;
  }
  if (!items) {
    return -1;
  }
  for (let index = 0; index < items.length; index++) {
    const element = items[index];
    if (element && element.name == name) {
      return index;
    }
  }
  return -1;
}

export default { findIndexItems };
