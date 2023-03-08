import {get} from '@/utils/request'
import {CommodityItem, CommodityListRequest} from "@/interface/data";
import {ListResponse} from "@/components/Common/List/useList";

export const getCommodityList = async (params: CommodityListRequest) => {
  return get<ListResponse<CommodityItem>>('/api/goods/lists', params)
}

export const getCommodityDetail = async (goods_id) => {
  return get<CommodityItem>('/api/goods/detail', {goods_id})
}
