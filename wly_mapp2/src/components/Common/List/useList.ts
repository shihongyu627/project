import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface ListRequest {
  page: number;
  psize: number;
  [key: string]: any;
}

export interface ListResponse<T> {
  page: {page: number; psize: number; total: number;}
  list: T[];
}

interface ParamsProps<T> {
  getList: (params: ListRequest) => Promise<ListResponse<T> | null>;
  isLoadFirst?: boolean;
  refreshExt?: () => void;
  filterInit?: { [key: string]: any };
}

interface LoadProps {
  pageNum: number;
  filter?: { [key: string]: any };
  refreshTemp: number;
}
const useList = <T>(params: ParamsProps<T>) => {
  const { getList, isLoadFirst = true, refreshExt, filterInit } = params;
  // 列表
  const [list, setList] = useState<T[]>([]);
  // 总数
  const [total, setTotal] = useState<number>(0);
  // 是否正在刷新
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadParams, setLoadParams] = useState<LoadProps>({
    pageNum: 1,
    filter: filterInit,
    refreshTemp: 0,
  });
  const { pageNum, filter, refreshTemp } = loadParams;
  // 是否正在请求
  const loading = useRef<boolean>(false);
  const loadingType = useRef<string>('loading');
  useEffect(() => {
    isLoadFirst && loadList();
  }, []);
  useEffect(() => {
    refreshTemp > 0 && loadList();
  }, [refreshTemp]);
  const loadList = async () => {
    const resp = await getList({ page: pageNum, psize: 20, ...filter });
    if (resp) {
      const { list: listGet, page: pageInfo } = resp;
      setRefreshing(false);
      setTotal(pageInfo.total);
      setList((preState) =>
        pageNum === 1 ? listGet : [...preState, ...listGet],
      );
      setTimeout(() => {
        loading.current = false;
      }, 0);
    }
  };
  const refresh = useCallback(() => {
    loadingType.current = 'refresh';
    if (isContinue()) {
      console.log('isContinuerefresh')
      setRefreshing(true);
      setLoadParams((prevState) => ({
        ...prevState,
        pageNum: 1,
        refreshTemp: new Date().getTime(),
      }));
      refreshExt && refreshExt();
    }
  }, []);
  const loadMore = useCallback(() => {
    loadingType.current = 'loading';
    if (isContinue()) {
      setLoadParams((prevState) => ({
        ...prevState,
        pageNum: ++prevState.pageNum,
        refreshTemp: new Date().getTime(),
      }));
    }
  }, []);
  const filterFunction = useCallback((filterOut: { [key: string]: any }) => {
    loadingType.current = 'filter';
    if (isContinue()) {
      setLoadParams((prevState) => ({
        ...prevState,
        pageNum: 1,
        refreshTemp: new Date().getTime(),
        filter: { ...prevState.filter, ...filterOut },
      }));
    }
  }, []);
  const isContinue = () => {
    if (loadingType.current === 'loading' && total <= list.length) {
      return false;
    }
    if (!loading.current) {
      loading.current = true;
      return true;
    } else {
      return false;
    }
  };
  return useMemo(
    () => ({ refresh, filterFunction, list, total, loadMore, refreshing }),
    [list, total, refreshing],
  );
};

export default useList;
