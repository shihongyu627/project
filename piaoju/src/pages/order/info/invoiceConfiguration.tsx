import { ProForm, ProFormTreeSelect } from '@ant-design/pro-form';
import { AutoComplete, Button, Col, Input, message, Popconfirm, Row, Space, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
// import { UploadOutlined } from '@ant-design/icons';
import openModal from '@/utils/page';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
// import BillPreview from './billPreview';
import {
  pjBillingAddBatch,
  pjGoodsNoPageList,
  pjMiddlenoPageList,
  factoryDelete,
  pjCategory,
} from '@/services/ant-design-pro/order';
import { CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Copy from '../components/copy';

type DataSourceType = {
  id: React.Key;
  title?: string;
  readonly?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  update_at?: string;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [];
export type Props = {
  headerData: any[]; // 状态
  orderId: any;
  goodsUpData: any;
  // pjOrderEdit: any;
};
const Header: React.FC<Props> = (props) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  // const [setTreeList] = useState([]);
  const [setgoodId, setGoodId] = useState([]);
  const [factoryName, setNameList] = useState('');
  const [factoryNames, setNameLists] = useState([]);
  const [seachName, setSeachName] = useState('');
  const [Buttondata, setButtondata] = useState(0);
  const [openData, setopen] = useState(true);
  const [loadings, setloadings] = useState(false);

  const refFactoryName = React.useRef<any>();
  const NumberList: React.FC<{
    value?: {
      key: string;
      label: string;
    }[];
    onChange?: (
      value: {
        key: string;
        label: string;
      }[],
    ) => void;
  }> = ({ value, onChange }) => {
    const dataref = useRef<any | null>(null);
    const [newTags, setNewTags] = useState<
      {
        key: string;
        label: string;
      }[]
    >([]);
    const [categorylist, setcategorylist] = useState([]);
    // const [inputValue, setInputValue] = useState<string>('');
    const onSearchPinMing = async (v: any) => {
      console.log(value, v, 'xxx');
      const PinMing: any = {};
      PinMing.category = v;
      PinMing.factory = value[0].name;
      const resvalue = await pjCategory(PinMing);
      const datakey: any = [];
      resvalue.result.map((item: any) => {
        const xx: any = {};
        xx.id = item.id;
        xx.value = item.category;
        datakey.push(xx);
      });
      setcategorylist(datakey);
    };
    const handleInputChange = (key: any, index: any, e: React.ChangeEvent<HTMLInputElement>) => {
      const newArr: any = value;
      newArr[index].label = e;
      onSearchPinMing(newArr[index].label);
      // value[key].label = e.target.value;
      setNewTags([...newTags]);
    };
    const handleInputConfirm = () => {
      const tempsTags = [...(value || [])];
      onChange?.(tempsTags);
      setNewTags([]);
      // setInputValue('');
    };

    return (
      <Space direction={'vertical'}>
        {(value || []).concat(newTags).map((item, index) => (
          <div key={item.key}>
            {/* <InputNumber
              ref={dataref}
              size="small"
              value={item.label}
              style={{ width: 75 }}
              onChange={(e) => handleInputChange(item.key, index, e)}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            /> */}
            <AutoComplete
              ref={dataref}
              value={item.label}
              options={categorylist}
              // onSelect={onSelect}
              onFocus={() => {
                // setopen(true);
                onSearchPinMing(item.label);
              }}
              onBlur={() => {
                handleInputConfirm();
                // setopen(false);
              }}
              onChange={(e) => handleInputChange(item.key, index, e)}
              // onChange={onChange}
              // open={openData}
              style={{ width: '140px' }}
            >
              {/* <Input.Search
                placeholder="请输入品类名称"
                onSearch={() => {
                  // addFactory();
                  // setopen(false);
                  // const name: any = seachName;
                  // setNameList(name);
                }}
              /> */}
            </AutoComplete>
          </div>
        ))}
      </Space>
    );
  };

  const columns: ProColumns<DataSourceType>[] = [
    {
      dataIndex: 'index',
      title: '序列号',
      valueType: 'indexBorder',
      width: 60,
    },
    {
      title: '商品名称',
      dataIndex: 'gname',
      readonly: true,
      width: 140,
      render: (h, row: any) => {
        return (
          <div>
            <div style={{ fontSize: 14 }}>
              {row.gname}
              {row.codeTs}
            </div>
            {/* <div style={{ fontSize: 14 }}>{row.secondQty}</div>
              <div style={{ fontSize: 14 }}>{row.gqty}</div> */}
          </div>
        );
      },
      renderFormItem(schema, config) {
        const row = (config?.record as any) || {};
        return (
          <div>
            <div style={{ fontSize: 14 }}>
              {row.gname}
              {row.codeTs}
            </div>
            {/* <div style={{ fontSize: 14 }}>{row.secondQty}</div>
              <div style={{ fontSize: 14 }}>{row.gqty}</div> */}
          </div>
        );
      },
      // 合并功能
      onCell: (row: any) => {
        {
          return { rowSpan: row.oneToMany };
        }
      },
    },
    {
      title: '数量',
      dataIndex: 'gqty',
      readonly: true,
      copyable: true,
      ellipsis: false,
      search: false,
      width: 80,
      render: (h, row: any) => {
        return (
          <div>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: 14 }}>{row.firstQty || '-'}</div>
              <Copy row={row.firstQty} />
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: 14 }}>{row.secondQty || '-'}</div>
              <Copy row={row.secondQty} />
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: 14 }}>{row.gqty || '-'}</div>
              <Copy row={row.gqty} />
            </div>
          </div>
        );
      },
      renderFormItem(schema, config) {
        const row = (config?.record as any) || {};
        return (
          <div>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: 14 }}>{row?.firstQty || '-'}</div>
              <Copy row={row.firstQty} />
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: 14 }}>{row?.secondQty || '-'}</div>
              <Copy row={row.secondQty} />
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: 14 }}>{row?.gqty || '-'}</div>
              <Copy row={row.gqty} />
            </div>
          </div>
        );
      },
      // 合并功能
      onCell: (row: any) => {
        {
          return { rowSpan: row.oneToMany };
        }
      },
    },
    {
      title: '单位',
      dataIndex: 'gunitValue',
      readonly: true,
      copyable: true,
      ellipsis: true,
      search: false,
      width: 80,
      render: (h, row: any) => {
        return (
          <div>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: 14 }}>{row.firstUnitValue || '-'}</div>
              <Copy row={row.firstUnitValue} />
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: 14 }}>{row.secondUnitValue || '-'}</div>
              <Copy row={row.secondUnitValue} />
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: 14 }}>{row.gunitValue || '-'}</div>
              <Copy row={row.gunitValue} />
            </div>
          </div>
        );
      },
      renderFormItem(schema, config) {
        const row = (config?.record as any) || {};
        return (
          <div>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: 14 }}>{row?.firstUnitValue || '-'}</div>
              <Copy row={row.firstUnitValue} />
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: 14 }}>{row?.secondUnitValue || '-'}</div>
              <Copy row={row.secondUnitValue} />
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: 14 }}>{row?.gunitValue || '-'}</div>
              <Copy row={row.gunitValue} />
            </div>
          </div>
        );
      },
      // 合并功能
      onCell: (row: any) => {
        {
          return { rowSpan: row.oneToMany };
        }
      },
    },
    {
      title: '总价',
      dataIndex: 'declTotal',
      readonly: true,
      copyable: true,
      ellipsis: true,
      search: false,
      width: 80,
      render: (h, row: any) => {
        return (
          <div>
            <span style={{ fontSize: 14 }}>{row.declTotal}</span>
            <span style={{ fontSize: 14 }}>{row.tradeCurr}</span>
          </div>
        );
      },
      renderFormItem(schema, config) {
        const row = (config?.record as any) || {};
        return (
          <div>
            <span style={{ fontSize: 14 }}>{row?.declTotal}</span>
            <span style={{ fontSize: 14 }}>{row?.tradeCurr}</span>
          </div>
        );
      },
      // 合并功能
      onCell: (row: any) => {
        {
          return { rowSpan: row.oneToMany };
        }
      },
    },
    {
      title: '工厂名称',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      search: false,
      width: 160,
      // 合并功能
      onCell: (row: any) => {
        {
          return { rowSpan: row.ManyToOne };
        }
      },
    },
    {
      title: '开票品类',
      dataIndex: 'categorys',
      copyable: true,
      ellipsis: true,
      search: false,
      width: 140,
      renderFormItem: () => {
        return <NumberList />;
      },
      render: (_, row: any) => {
        return row?.categorys?.map((item: any, index: any) => (
          <div style={{ fontSize: 14 }} key={index}>
            <span key={index}>{item.label || '-'}</span>
          </div>
        ));
      },
      // request: async function (record) {
      //   console.log('开票品类', record);
      //   const result: any = await pjCategory(record.name);
      //   const columnsArr: any[] = result.result;
      //   const res: any = [];
      //   columnsArr.map((item) => {
      //     const temp = {
      //       label: item.name,
      //       value: item.comboType,
      //     };
      //     res.push(temp);
      //   });
      //   return res;
      // },
    },
    {
      title: '开票金额',
      dataIndex: 'money',
      copyable: true,
      ellipsis: true,
      search: false,
      width: 120,
    },
    {
      title: '数量',
      dataIndex: 'num',
      valueType: 'digit',
      copyable: true,
      ellipsis: true,
      search: false,
      width: 110,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      copyable: true,
      ellipsis: true,
      search: false,
      width: 100,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 130,
      align: 'center',
      fixed: 'right',
      render: (text, record: any, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.keyid);
            // setTimeout(() => {
            //   action?.cancelEditable?.(record.index);
            //   console.log('action:', action?.cancelEditable?.(record.index));
            // }, 10);
            // console.log('action:', action, record.keyid);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key={'delete'}
          title="确认要删除该数据吗？"
          icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => {
            if (record.keyid) {
              const newArr = dataSource.filter((item: any) => item.keyid !== record.keyid);
              const dd = factoryNames.filter(
                (item: any, index) => item[index] !== item[record.index],
              );
              setNameLists(dd);
              if (record.index === 0) {
                newArr.map((item: any, index: any) => {
                  item.index = index;
                  let d = new Date().getTime();
                  if (window.performance && typeof window.performance.now === 'function') {
                    d += performance.now(); //use high-precision timer if available
                  }
                  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
                    /[xy]/g,
                    function (c) {
                      const r = (d + Math.random() * 16) % 16 | 0; // d是随机种子
                      d = Math.floor(d / 16);
                      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
                    },
                  );
                  item.keyid = uuid;
                  if (index === 0) {
                    if (setgoodId.length > 1) {
                      item.ManyToOne = newArr.length;
                      setButtondata(0);
                    } else if (setgoodId.length === 1) {
                      item.oneToMany = newArr.length;
                      setButtondata(0);
                    }
                  } else {
                    if (setgoodId.length > 1) {
                      item.ManyToOne = 0;
                    } else if (setgoodId.length === 1) {
                      item.oneToMany = 0;
                    }
                  }
                });
                // console.log('xxxxx', newArr, factoryNames, record.keyid, dd);
                setDataSource(newArr);
              } else {
                setButtondata(0);
                newArr.map((item: any, index: any) => {
                  item.index = index;
                  let d = new Date().getTime();
                  if (window.performance && typeof window.performance.now === 'function') {
                    d += performance.now(); //use high-precision timer if available
                  }
                  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
                    /[xy]/g,
                    function (c) {
                      const r = (d + Math.random() * 16) % 16 | 0; // d是随机种子
                      d = Math.floor(d / 16);
                      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
                    },
                  );
                  item.keyid = uuid;
                });
                // console.log('xxxxxaaa', newArr, factoryNames, record.keyid, dd);
                setDataSource(newArr);
              }
            }
          }}
        >
          <a
            type="link"
            style={{
              color: '#ff4d4f',
            }}
          >
            删除
          </a>
        </Popconfirm>,
        // <a type="link" style={{ color: '#ff4d4f' }}>
        //   删除
        // </a>,
      ],
    },
  ];
  const fieldProps = {
    onChange(values: any) {
      const urlArr = values || [];
      setGoodId(urlArr);
    },
  };

  const _addinvoice = async () => {
    const dd: any = {};
    dd.column = 'createTime';
    dd.order = 'desc';
    dd.title = '';
    dd.orderId = props.orderId || '';
    const res = await pjGoodsNoPageList({
      ...dd,
    });
    const arr = res?.result || [];
    if (setgoodId.length > 1) {
      const params = arr.filter((item: any) => setgoodId.indexOf(item.id) > -1);
      const temp = params.map((item: any, index: any) => {
        const invoice: any = {};
        invoice.name = factoryName;
        invoice.money = '';
        invoice.num = '';
        invoice.unit = '';
        invoice.orderId = props.orderId || '';
        invoice.index = index;
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === 'function') {
          d += performance.now(); //use high-precision timer if available
        }
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = (d + Math.random() * 16) % 16 | 0; // d是随机种子
          d = Math.floor(d / 16);
          return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
        invoice.keyid = uuid;
        invoice.category = '';
        invoice.categorys = [{ key: 'category', label: invoice.category, name: factoryName }];
        Object.assign(item, invoice);
        // item.index = index;
        if (index === 0) {
          item.ManyToOne = params.length;
        } else {
          item.ManyToOne = 0;
        }
        return item;
      });
      setDataSource(temp);
      setButtondata(1);
    }
    if (setgoodId.length === 1) {
      const chars: any = [];
      chars.push(factoryName);
      const kk = factoryNames.concat(chars);
      setNameLists(kk);
      const factorydata = kk;
      const params = arr.filter((item: any) => setgoodId.indexOf(item.id) > -1);
      const temp: any = [];
      factorydata.map((item: any, index: any) => {
        const xx: any = {};
        xx.name = factorydata[index];
        xx.index = index;
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === 'function') {
          d += performance.now(); //use high-precision timer if available
        }
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = (d + Math.random() * 16) % 16 | 0; // d是随机种子
          d = Math.floor(d / 16);
          return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
        xx.keyid = uuid;
        xx.money = '';
        xx.num = '';
        xx.unit = '';
        xx.category = '';
        xx.categorys = [{ key: 'category', label: xx.category, name: factorydata[index] }];
        if (index === 0) {
          xx.oneToMany = factorydata.length;
        } else {
          xx.oneToMany = 0;
        }
        xx.orderId = props.orderId || '';
        Object.assign(xx, params[0]);
        temp.push(xx);
      });
      setDataSource(temp);
    }
  };
  const _pjBillingAddBatch = async () => {
    const temp: any = [];
    dataSource.map((item: any) => {
      const xx: any = {};
      xx.goodId = item.id;
      xx.money = item.money;
      xx.name = item.name;
      xx.num = item.num;
      xx.orderId = item.orderId;
      xx.unit = item.unit;
      xx.category = item.categorys[0].label;
      temp.push(xx);
    });
    const BillingAddBatch: any = {};
    BillingAddBatch.billingList = temp;
    if (setgoodId.length === 1) {
      BillingAddBatch.state = 0;
    }
    if (setgoodId.length > 1) {
      BillingAddBatch.state = 1;
    }
    const res = await pjBillingAddBatch(BillingAddBatch);
    if (res.code === 200) {
      props.goodsUpData();
      // props.pjOrderEdit();
      openModal.closeModal();
      setloadings(false);
    } else {
      setloadings(false);
    }
  };

  const [options, setOptions] = useState<{ value: string }[]>([]);

  // 加载下拉列表数据
  const loadTreeList = async () => {
    const dd: any = {};
    dd.column = 'createTime';
    dd.order = 'desc';
    dd.title = '';
    dd.state = 0;
    dd.orderId = props.orderId || '';
    const result: any = await pjGoodsNoPageList({ ...dd });
    const columnsArr: any[] = result.result || [];
    const res: any = [];
    columnsArr.map((item) => {
      const temp: any = {};
      temp.label = item.gname + item.codeTs;
      temp.value = item.id;
      res.push(temp);
    });
    // setTreeList(res || []);
    return res;
  };

  React.useEffect(() => {
    loadTreeList();
  }, [props]);
  const _factoryDelete = async (id: any) => {
    try {
      const dd = {
        id: id,
      };
      const result: any = await factoryDelete({ ...dd });
      if (result.code === 200) {
        message.success('删除成功');
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onSearch = async (value: string) => {
    const dd: any = {};
    dd.factory = value;
    const resvalue = await pjMiddlenoPageList(dd);
    const datakey: any = [];
    if (resvalue.result === [] || !resvalue.result) {
      return;
    } else {
      resvalue.result.map((item: any) => {
        const key: any = {
          value: item.factory,
          label: (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {item.factory}
              <span>
                <Popconfirm
                  key="view4"
                  title="确认要删除该数据吗？"
                  icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                  onConfirm={() => {
                    if (item.factory) {
                      _factoryDelete(item.id);
                    }
                  }}
                >
                  <CloseCircleOutlined />
                </Popconfirm>
              </span>
            </div>
          ),
          id: item.id,
        };
        // key.value = item.factory;
        // key.label = item.factory;
        // key.id = item.id;
        datakey.push(key);
      });
    }
    setSeachName(value);
    setOptions(!datakey ? [] : datakey);
  };
  const onSelect = (data: string, option: any) => {
    const urlArr: any = data;
    console.log('data', data, option);
    setNameList(urlArr);
    setopen(false);
  };
  const onChange = (data: string) => {
    const name: any = data;
    setSeachName(name);
    setNameList(name);
    onSearch(name);
    setopen(true);
  };

  const addFactory = () => {
    if (factoryName === '' || setgoodId == null) {
      message.error('请输入工厂名称');
      return;
    }
    refFactoryName?.current?.blur();
    setopen(false);
    const name: any = seachName;
    setNameList(name);
    _addinvoice();
  };
  const rule = `${localStorage.getItem('rule')}`;
  const ruledata = JSON.parse(rule);
  // const nameProp = {
  //   onChange(values: any) {
  //     console.log(values.target.value);
  //     const urlArr = values.target.value;
  //     setNameList(urlArr);
  //   },
  // };
  return (
    <ProForm<{
      table: DataSourceType[];
    }>
      labelCol={{ span: 4 }}
      layout={'horizontal'}
      grid={false}
      rowProps={{
        gutter: [16, 0],
      }}
      submitter={{
        render: () => {
          return (
            <Row justify={'end'}>
              <Col style={{ marginRight: '8px' }}>
                <Button
                  onClick={() => {
                    openModal.closeModal();
                  }}
                >
                  取消
                </Button>
              </Col>
              <Col style={{ marginRight: '8px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loadings}
                  onClick={() => {
                    setloadings(true);
                    // openModal.closeModal();
                    _pjBillingAddBatch();
                  }}
                >
                  <Tooltip title={ruledata.invoice_configuration}>确定</Tooltip>
                </Button>
              </Col>
            </Row>
          );
        },
      }}
      params={{}}
    >
      <Row>
        <Col span={24}>
          <ProFormTreeSelect
            name="goodId"
            label="选择商品"
            placeholder="请选择商品"
            // showSearch
            // debounceTime={300}
            disabled={factoryNames.length > 1 ? true : false}
            width="lg"
            // mode="multiple"
            fieldProps={{
              ...fieldProps,
              treeCheckable: true,
            }}
            request={async ({}) => {
              return loadTreeList();
            }}
            rules={[{ required: true, message: '请选择商品' }]}
          />
          <ProForm.Item label="添加工厂" rules={[{ required: true, message: '请输入工厂名称' }]}>
            <AutoComplete
              options={options}
              onSelect={onSelect}
              onFocus={() => {
                setopen(true);
                onSearch(seachName);
              }}
              onBlur={() => {
                setopen(false);
              }}
              onChange={onChange}
              open={openData}
              style={{ width: '440px' }}
              disabled={Buttondata !== 1 ? false : true}
            >
              <Input.Search
                placeholder="请输入工厂名称"
                ref={refFactoryName}
                onSearch={() => {
                  // addFactory();
                  refFactoryName?.current?.blur();
                  setopen(false);
                  const name: any = seachName;
                  setNameList(name);
                }}
                enterButton={
                  <a
                    type="primary"
                    onClick={() => {
                      addFactory();
                    }}
                  >
                    添加
                  </a>
                }
              />
            </AutoComplete>
          </ProForm.Item>
        </Col>
      </Row>
      <EditableProTable<DataSourceType>
        rowKey="keyid"
        scroll={{
          x: 700,
        }}
        recordCreatorProps={false}
        loading={false}
        style={{ marginTop: 20 }}
        columns={columns}
        request={async () => ({
          data: defaultData,
          total: 3,
          success: true,
        })}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
            // await waitTime(2000);
          },
          onCancel: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
            // await waitTime(2000);
          },
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
          // actionRender: (row, config, defaultDom) => [defaultDom.save, defaultDom.cancel],
        }}
      />
    </ProForm>
  );
};

export default Header;
