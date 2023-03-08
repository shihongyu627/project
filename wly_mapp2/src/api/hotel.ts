import {get, post} from '@/utils/request'
import {
  HotelItemProps,
  HotelDetailRequest,
  HotelListRequest,
  HotelBookRequest
} from "@/interface/data";
import {ListResponse} from "@/components/Common/List/useList";

export const getHotelList = async (params: HotelListRequest) => {
  return get<ListResponse<HotelItemProps>>('/api/hotel/lists', params)
}

export const getHotelDetail = async (params: HotelDetailRequest) => {
  return get<HotelItemProps>('/api/hotel/detail', params)
}

// 预约酒店
export const postHotelOrder = async (params: HotelBookRequest) => {
  return post<boolean>('/api/hotel/createbook', params)
}

export const postCancelHotelOrder = async (id) => {
  return post<boolean>('/api/hotel/cancel', {id})
}
