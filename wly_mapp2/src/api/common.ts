import {get, post} from "@/utils/request";
import {
  IndexData,
  BannerItem,
  ShopApplyRequest,
  // MyBookResponse,
  MyBookRequest,
  LoginRequest,
  BookItem
} from "@/interface/data";
import {ListResponse} from "@/components/Common/List/useList";

export const getCommerceIndex = async () => {
  return get<IndexData>('/api/index/index')
}

export const getBanner = async (place = 'canyin_banner') => {
  return get<BannerItem[]>('/api/banner/banner', {place})
}

export const postApplyShop = async (params: ShopApplyRequest) => {
  return post<IndexData>('/api/shop/applyshop', params)
}

export const getNewInfo = async () => {
  return get<{detail: string; title: string}>('/api/about/newinfo')
}

export const getBookList = async (params: MyBookRequest) => {
  return get<ListResponse<BookItem>>('/api/user/booklist', params)
}

export const getSearchHot = async () => {
  return get<any>('/api/site/config')
}

export const getWxConfig = async (url) => {
  return get<any>('/api/wechat/getjssdkconfig', {url})
}

export const getAboutUs = async () => {
  return get<any>('/api/about/about')
}

export const getLogin = async (params: LoginRequest) => {
  return get<any>('/api/wechat/login', params)
}
export const getLocation = async (lnglat: string) => {
  return get<{ cityname: string;citycode:string }>('/api/map/location', {lnglat})
}

export const checkLogin = async (phone: string) => {
  return get<any>('/api/auth/check', {phone}, false, true)
}

export const postFeedback = (params) => {
  return post<boolean>('/api/user/feedback', params)
}
