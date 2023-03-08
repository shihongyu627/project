export interface AboutUs {
  title: string;
  detail: string;
}

export interface BannerItem {
  image: string;
  linkurl: string;
  params: any;
  status: number;
  id: number;
  title: string;
  stitle: string;
}

export interface IndexData {
  banners: BannerItem[];
  notices: {title: string; detail: string;}[]
  top_goods_list: CommodityItem[];
  top_shop2_list: ShopItemResponse[];
  top_dish_list: DishItem[];
  top_article_list: any[];
}

export enum ShopType {
  catering = 1,
  commerce = 2,
  hotel = 3,
}
export enum OrderBy {
  TOP = 'top',
  HOT = 'hot',
  NEW = 'new',
  STAR = 'star',
  DISTANCE = 'distance',
}
export interface ShopListRequest {
  lnglat?: string;
  search?: string;
  max_distance?: number;
  shop_type?: ShopType;
  orderby?: OrderBy;
  page: number;
  psize: number;
}
export interface ShopApplyRequest {
  shop_name?: string;
  shop_address?: string;
  linkman_name?: string;
  linkman_mobile?: string;
  cert_img1?: string;
  cert_img2?: string;
  shop_type?: ShopType;
}
export interface ShopInfoSimple {
  name: string;	// 	标题
  type: string;	// 	类型[text=文本，gallery=图集，content=富文本内容]
  text: string;	// 	文本内容
  content: string;	// 	富文本内容
  gallery: string;	// 	图集
}

export interface ShopSource {
  name: string;	// 	标题
  type: string;	// 	类型[text=文本，gallery=图集，content=富文本内容]
  text: string;	// 	文本内容
  content: string;	// 	富文本内容
  gallery: string;	// 	图集
}

export interface UserSign {
  user_nick: string;	// 	用户昵称
  user_head: string;	// 	用户头像
  create_time: string;	// 	打卡时间
}

export interface ShopItemResponse {
  shop_id: number;	// 	商家shop_id
  shop_type: number;	// 	类型【1=餐饮商家
  shop_name: string;	// 	商家名称
  shop_logo: string;	// 	商家LOGO
  shop_gallery: string;	// 	商家图集[,分隔]
  shop_image: string; // 商家图片
  shop_content: string;	// 	商家简介
  shop_detail: string;	// 	商家详情[用餐环境]
  star: number;	// 	商家星级[5星满分]
  per_cost: number;	// 	人均消费
  hotline: string;	// 	热线电话
  opentime: string;	// 	营业时间
  lnglat: string;	// 	商家经纬度
  address: string;	// 	商家地址
  linkman_name: string;	// 	联系人
  linkman_mobile: string;	// 	联系电话
  user_sign_list: UserSign[];	// 	打卡用户列表
  top_dish_list: DishItem[];	// 	人气美食[见美食详情]
  top_goods_list: CommodityItem[];
  shop_info_list: ShopInfoSimple[];	// 	店铺信息简介列表
  shop_soruce_list: ShopSource[];	// 	溯源信息列表
  is_online_book: number;	// 	是否可预订
  is_online_takeout: number;	// 	是否可外卖
  is_park: number;	// 	是否有停车位
  park_num: number;	// 	停车位数量
  park_price: number;	// 	停车位价格,N元/小时
  up_count: number;	// 	点赞量
  click_count: number;	// 	点击量
  comment_count: number;	// 	评论量
  user_is_up: number;	//	当前用户是否已点赞
  user_is_nark: number;	//	当前用户是否已收藏
  user_is_comment: number;	//	当前用户是否已评论
  user_is_sign: number;	//	当前用户是否已打卡
  is_top: number;	// 	置顶:1=置顶
  status: number;	// 	状态:1=正常
  create_time: string;	// 	创建时间
  cert_img1: string;
  cert_img2: string;
  open_status_name: string; // 营业状态
  cert_detail?: string;
}

export interface ShopOrderRequest {
  shop_id: number;	//	商家id
  time?: number;	//	预约时间[时间戳]
  num?: number;	//	预约人数
  linkman_name?: string;	//	联系人
  linkman_mobile?: string;	//	联系信息
  text?: string;	//	备注信息
}

export interface CommodityItem {
  goods_id:number;	//	商品id
  type:number;	//	类型:默认1商品
  title:string;	//	标题
  stitle:string;	//	副标题
  image:string;	//	封面图
  content:string;	//	简介
  detail:string;	//	详情
  price:string;	//	价格
  unit:string;	//	单位
  publish_name:string;	//	发布者
  publish_time: string;	//	发布时间
  up_count:number;	//	点赞量
  click_count:number;	//	点击量
  sale_count:number;	//	销量
  comment_count:number;	//	评论量
  user_is_up:number;	//0	当前用户是否已点赞
  user_is_nark:number;	//0	当前用户是否已收藏
  user_is_comment:number;	//0	当前用户是否已评论
  is_top:number;	//	置顶:1=置顶
  status:number;	//	状态:1=正常
  create_time: string;	//	创建时间
}

export interface CommodityListRequest {
  page: number;
  psize: number;
  search?: string;
  category_id: number;
  orderby: OrderBy;
}

export interface DishItem {
  dish_id:number;	//	美食id
  scope_type:number;	//	范围类型[1平台美食，2店铺美食]
  type:number;	//	类型:默认1美食
  title:string;	//	标题
  stitle:string;	//	副标题
  image:string;	//	封面图
  gallery:string;	//	图集[逗号分隔]
  content:string;	//	简介
  detail:string;	//	详情
  price_float: number;	//	价格
  publish_name: string;	//	发布者
  publish_time:string;	//	发布时间
  link_shop_list: {
    shop_id:string;	//	店铺ID
    shop_name:string;	//	店铺名称
  }[];	//	关联店铺
  foods_arr: {
    name:string;	//	名称
    spec:string;	//	规格
  }[];	//	食材集合
  foods_process: {
    name:string;	//	名称
    gallery:string;	//	图集
    text:string;	//	文本
  }[];	//	制作流程
  up_count:number;	//	点赞量
  sale_count:number;	//	销量
  click_count:number;	//	点击量
  comment_count:number;	//	评论量
  user_is_up:number;	// 0	当前用户是否已点赞
  user_is_nark:number;	// 0	当前用户是否已收藏
  user_is_comment:number; //	0	当前用户是否已评论
  is_top:number;	//	置顶:1=置顶
  status:number;	//	状态:1=正常
  create_time:string;	//	创建时间
}

export interface DishListRequest {
  search?: string;	//	关键词
  category_id?: number;	//	分类
  scope_type?: number;	//	范围类型[1平台美食，2店铺美食]
  shop_id?: number;	//	店铺美食[范围类型=2可用]
  orderby?: OrderBy;	//	排序依据[推荐top,热门hot,最新new]
  sort?: string;	 // desc	排序方式[正序asc,倒序desc]
  page: number; //	1	页码
  psize: number;	 // 10	分页大小
}

export interface HotelListRequest {
  lnglat?: string;
  search?: string;
  trip_date?: string; // 出行时间[2021-01-01][默认当前时间]
  trip_enddate?: string; // 出行结束时间[2021-01-01][默认当前时间]
  min_price?: number;
  max_price?: number;
  page: number;
  psize: number;
}

export interface HotelDetailRequest {
  hotel_id?: number;
  lnglat?: string;
  trip_date?: string; // 出行时间[2021-01-01][默认当前时间]
  trip_enddate?: string; // 出行结束时间[2021-01-01][默认当前时间]
}

export interface RoomItemProps {
  room_id: number;	//	房间id
  name: string;	//	房间名称
  sname: string;	//	房间小标题
  image: string;	//	房间封面图
  gallery: string;	//	房间图集
  content: string;	//	房间描述
  price: number;	//	价格
  area: string;	//	面积
  bed: string;	//	床说明
  max_man: number;	//	最大可住人
  tags: string;	//	标签组合[,分隔]
  is_sale: number;	//	是否可销售
  detail: string;
}
export interface RoomTypeItemProps {
  type_id: number;	//	类型id
  type_name: string;	//	类型名称[房型]
  list: RoomItemProps[];
}
export interface HotelItemProps {
  hotel_id: number;	//	酒店id
  title: string;	//	酒店名称
  stitle: string;	//	酒店小标题
  image: string;	//	酒店封面图
  content: string;	//	酒店介绍
  lnglat: string;	//	酒店经纬度[xxx,xxx]
  address: string;	//	酒店地址
  hotline: string;	//	联系电话
  star: number;	//	星级[1.0//5.0]
  star_name: string;	//	星级标签
  price_base: number;	//	起步价格
  distance: number;	//	当前距离[km]
  sale_count: number;	//	销售实际量
  detail:string;	//	酒店详细介绍html
  policy:string;	//	酒店政策介绍html
  status: number;	//	状态:1=正常
  room_list: RoomTypeItemProps[]	//	酒店房间分类room列表
  level: string;
  linkman_mobile: string;
}

export interface HotelBookRequest {
  hotel_id: number;	//	酒店id
  room_id: number;	//	房间id
  time?: number;	//	预约时间[时间戳]
  num?: number;	//	预约人数
  linkman_name?: string;	//	联系人
  linkman_mobile?: string;	//	联系信息
  text?: string;	//	备注信息
  start_time?: string;
  end_time?: string;
}

export interface MyBookRequest {
  page: number;
  psize: number;
  type: number;
}

export interface BookItem {
  shop_info: ShopItemResponse;
  hotel_info: HotelItemProps;
  book_no: number;
  linkman_name: string;
  linkman_mobile: string;
  num: string;
  time: string; // 到店时间
  create_time: string;
  status_name: string;
  room_name: string;
}

export interface MyBookResponse {
  list: BookItem[];
}

export interface LoginRequest {
  type: 'mini' | 'app' | 'js';
  code: string;
  openid?: string;
}
