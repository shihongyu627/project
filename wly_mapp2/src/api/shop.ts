import {get, post} from '@/utils/request'
import {IndexData, ShopItemResponse, ShopListRequest, ShopOrderRequest} from "@/interface/data";
import {ListResponse} from "@/components/Common/List/useList";

export const getCommerceIndex = async () => {
  return get<IndexData>('/api/index/index')
}

export const getShopList = async (params: ShopListRequest) => {
  return get<ListResponse<ShopItemResponse>>('/api/shop/lists', params)
}

export const getShopDetail = async (shop_id) => {
  return get<ShopItemResponse>('/api/shop/detail', {shop_id})
}

// 预约商家
export const postShopOrder = async (parmas: ShopOrderRequest) => {
  return post<boolean>('/api/shop/createbook', parmas)
}

export const postCancelShopOrder = async (id) => {
  return post<boolean>('/api/shop/cancel', {id})
}
