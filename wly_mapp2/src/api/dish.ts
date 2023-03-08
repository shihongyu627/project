import {get} from '@/utils/request'
import {DishItem, DishListRequest} from "@/interface/data";
import {ListResponse} from "@/components/Common/List/useList";

export const getDishList = async (params: DishListRequest) => {
  return get<ListResponse<DishItem>>('/api/dish/lists', params)
}

export const getDishDetail = async (dish_id) => {
  return get<DishItem>('/api/dish/detail', {dish_id})
}
