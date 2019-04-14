import { observable, computed, toJS, autorun } from 'mobx';
import EventEmitter from 'events';
import { randomData } from '../lib/helper.js';

import messageManager from './messageManager';

import { CONSTANT_CONFIG } from '../datacenter/constantConfig';

import QueryString from 'query-string';

import {
  Elevator_Running_Data_Chart_Options,
  Elevator_System_Count_Chart_Options,
  Elevator_Offline_Count_Every_Month_Chart_Option,
  Elevator_Map_China_Options,
  Elevator_Error_Every_Month_Chart_Options,
  Elevator_Error_Ratio_Chart_Options,
  Elevator_Maintenance_OrdersAndFinish_Chart_Options,
  Elevator_maintenance_Orders_Month_Chart_Options,
  Map_Info_Value,
} from '../datacenter/chartConfig';
/**
 * 电梯运行数据
 */
class sharedData extends EventEmitter {
  @observable runningDataOptionValue = Elevator_Running_Data_Chart_Options;
  @observable systemCountOptionValue = Elevator_System_Count_Chart_Options;
  @observable offlineCountOptionValue = Elevator_Offline_Count_Every_Month_Chart_Option;
  @observable mapChinaOptionValue = [];
  @observable elevatorErrorEveryMonthOptionValue = Elevator_Error_Every_Month_Chart_Options;
  @observable elevatorErrorRatioOptionValue = Elevator_Error_Ratio_Chart_Options;
  @observable
  maintenanceOrdersAndFinishOptionValue = Elevator_Maintenance_OrdersAndFinish_Chart_Options;
  @observable maintenanceOrdersMonthOptionValue = Elevator_maintenance_Orders_Month_Chart_Options;
  @observable mapInfoValue = Map_Info_Value;

  @observable maiUserInfoList = [];

  @observable totalValue = '0'; // 总数量
  @observable onLineTotalValue = '0'; // 在线数量

  @observable dynamicInfoOptionValue = {
    status: '',
    floors: '',
    energy: 0,
    signal: 0,
  };

  @observable elevatorConnectOptionValue = {
    url: '',
  };

  @observable elevatorInTimeIFrameOptionValue = {
    url: '',
    open: false,
  };

  @observable elevatorStatusValue = {};
  @observable elevatorLogValue = [];

  @observable warningMessageValue = {
    id: -1,
    message: '',
  };

  @observable installRecordDataValue = [];

  @observable maintenanceRecordValue = [];

  @observable elevatorDevInfoValue = {};

  @observable installRecordInformationValue = [];

  @observable maintenanceInformationValue = [];

  sumDay = '50'; // 运行天数

  updateMapMarkers = true;
  //runningDataOption = null;

  constructor() {
    super();

    this.runningDataOptionValue.series[0].data = ['0'];
    this.systemCountOptionValue.series[0].data = ['0'];

    // this.mapChinaOptionValue.series[0].data = [
    //   {name: '北京', value: randomData (), pingyin: 'beijing'},
    //   {name: '天津', value: randomData (), pingyin: 'beijing'},
    //   {name: '上海', value: randomData (), pingyin: 'beijing'},
    //   {name: '浙江', value: randomData (), pingyin: 'zhejiang'},
    //   {name: '台湾', value: randomData (), pingyin: 'beijing'},
    //   {name: '香港', value: randomData (), pingyin: 'beijing'},
    //   {name: '澳门', value: randomData (), pingyin: 'beijing'},
    // ];
    this.elevatorErrorEveryMonthOptionValue.series = [
      {
        name: '故障数',
        type: 'bar',
        barWidth: '60%',
        data: [0, 0, 0, 0, 0],
        itemStyle: {
          normal: {
            color: '#2dd8db',
          },
        },
      },
    ];

    this.elevatorErrorRatioOptionValue.series = [
      {
        name: '故障比例',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          // {value: 335, name: '电气强度降低'},
          // {value: 310, name: '磨损与污损'},
          // {value: 234, name: '整体故障'},
          // {value: 135, name: '贯穿'},
          // {value: 1548, name: '其他故障'},
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ];

    this.maintenanceOrdersAndFinishOptionValue.series = [
      {
        name: '完成量',
        type: 'line',
        //stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'insideRight',
          },
        },
        data: [],
      },
      {
        name: '未成量',
        type: 'line',
        //stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'insideRight',
          },
        },
        data: [],
      },
    ];

    this.maintenanceOrdersMonthOptionValue.series = [
      {
        name: '维保数',
        type: 'bar',
        barWidth: '60%',
        data: [10, 20, 20, 50, 60, 70, 60, 50, 40, 30, 10, 20],
      },
    ];

    //小区安装记录
    this.installRecordDataValue = [
      // 'xxxx小区安装纪律1',
      // 'xxxx小区安装纪律2',
      // 'xxxx小区安装纪律3',
      // 'xxxx小区安装纪律4',
      // 'xxxx小区安装纪律5',
      // 'xxxx小区安装纪律6',
    ];

    //小区维保记录
    this.maintenanceRecordValue = [
      // 'xxxx小区维保纪律1',
      // 'xxxx小区维保纪律2',
      // 'xxxx小区维保纪律3',
      // 'xxxx小区维保纪律4',
      // 'xxxx小区维保纪律5',
      // 'xxxx小区维保纪律6',
    ];

    // this.warningMessageValue = {
    //   id: 123,
    //   message: '浙江省杭州市余杭区 xxx 电梯 xxx故障',
    // };

    this.devIdListValue = window.location.search.split('dev_id_list=')[1]
      ? window.location.search.split('dev_id_list=')[1].split(',')
      : [];

    this.elevatorConnectOptionValue = {
      phone: '',
      video: '',
    };
    //单个电梯状态
    this.elevatorStatusValue = {};
    this.elevatorLogValue = [];

    // const optionValueWatcher = computed (() => {
    //   return this.optionValue;
    // });

    // autorun (() => {
    //   let option = optionValueWatcher;
    //   console.info ('autorun:' + option);
    // });

    messageManager.on('9012', args => {
      if (args && args.resp == '200') {
        let rows = args.rows;

        if (rows && rows.length > 0) {
          let dataArray = [];

          rows.forEach(item => {
            let data = item.total;
            dataArray.push(data);
          });

          this.runningDataOptionValue.xAxis[0].data = ['总运行天数（天）'];
          this.runningDataOptionValue.series[0].data = dataArray;
        }
      }
    });

    messageManager.on('9005', args => {
      if (args && args.resp == '200') {
        let rows = args.rows;

        if (rows && rows.length > 0) {
          let dataArray = [];
          let categoryArray = [];

          rows.forEach(item => {
            let month = item.month;
            let total = item.total;
            categoryArray.push(month);
            dataArray.push(total);
          });
          this.systemCountOptionValue.xAxis[0].data = categoryArray;
          this.systemCountOptionValue.series[0].data = dataArray;
        }
      }
    });

    messageManager.on('9006', args => {
      if (args && args.resp == '200') {
        let rows = args.rows;
        if (rows && rows.length > 0) {
          let row = rows[0];
          let totalInfo = {
            total: row.total ? row.total : '0',
            onLineTotal: row.on_total ? row.on_total : '0',
          };
          this.totalInfo = totalInfo;

          console.info('9006 is get data');
        }
      }
    });

    messageManager.on('9007', args => {
      //debugger;
      if (args && args.resp == '200') {
        let rows = args.rows;
        if (rows && rows.length > 0) {
          let dataArray = [];
          let categoryArray = [];
          let pieDataArray = [];

          rows.forEach(item => {
            //
            let title = item.alertname;
            let total = item.alarm_num;
            categoryArray.push(title);
            dataArray.push(total);

            pieDataArray.push({
              value: total,
              name: title,
            });
          });

          this.elevatorErrorEveryMonthOptionValue.xAxis[0].data = categoryArray;

          this.elevatorErrorEveryMonthOptionValue.series = [
            {
              name: '离线数量',
              type: 'bar',
              barWidth: '20%',
              data: dataArray,
              itemStyle: {
                normal: {
                  color: '#2dd8db',
                },
              },
            },
          ];

          // this.elevatorErrorRatioOptionValue.legend.data = categoryArray;
          this.elevatorErrorRatioOptionValue.series[0].data = pieDataArray;
        }
      }
    });

    messageManager.on('9002', args => {
      if (args && args.resp == '200') {
        let rows = args.rows;
        if (rows && rows.length > 0) {
          let filter = args.filter;
          const dev_id = QueryString.parse(window.location.search).dev_id || '';
          if (filter != null && filter.length > 0 && dev_id == filter) {
            if (rows && rows.length > 0) {
              let dataArray = [];
              let dev_name = '';
              rows.forEach(item => {
                let ondate = item.ondate;
                let offdate = item.offdate;
                let time_length = '';

                if (dev_name.length == 0) {
                  dev_name = item.dev_cname;
                }

                let message =
                  '上线时间:' + ondate + ' 下线时间:' + offdate + ' 时长:' + time_length;
                //debugger;
                dataArray.push(message);
              });

              if (dataArray.length > 0) {
                this.elevatorLog = dataArray;
              }

              if (dev_name.length > 0) {
                this.elevatorDevInfo = { name: dev_name };
              }
            }
            // debugger;
            // let item = rows[0];
            // if (item) {
            //   this.elevatorLog = {
            //     dev_id: item.dev_id,
            //     dev_cname: item.dev_cname,
            //     on_time: item.on_time,
            //     off_time: item.off_time,
            //   };
            // }
          }
        }
      }
    });

    messageManager.on('9003', args => {
      if (args && args.resp == '200') {
        let rows = args.rows;
        if (rows && rows.length > 0) {
          let dataArray = [];
          let categoryArray = [];

          rows.forEach(item => {
            let month = item.month;
            let total = item.total;
            if (month) {
              categoryArray.push(month);
              dataArray.push(total);
            }
          });

          this.offlineCountOptionValue.xAxis[0].data = categoryArray;

          this.offlineCountOptionValue.series = [
            {
              name: '离线数量',
              type: 'bar',
              markPoint: {
                data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }],
              },
              markLine: {
                data: [{ type: 'average', name: '平均值' }],
              },
              data: dataArray,
              barWidth: 10,
              //颜色
              itemStyle: {
                normal: {
                  color: '#2dd8db',
                },
              },
            },
          ];
        }
      }
    });

    messageManager.on('9001', args => {
      this.warningMessage = { dev_id: '33483334833348333483', id: '28774536', message: '平层困人' };
      this.warningMessage = {
        dev_id: '31103307822016010044',
        id: '28774535',
        message: '平层困人2',
      };
      if (args && args.resp == '200') {
        let rows = args.rows;
        if (rows && rows.length > 0) {
          let filter = args.filter;
          const dev_id = QueryString.parse(window.location.search).dev_id || '';
          const dev_id_list = QueryString.parse(window.location.search).dev_id_list || '';
          if (filter != null && filter.length > 0) {
            if (dev_id == filter) {
              let item = rows[0];
              if (item) {
                let url = item.url;
                if (url && url.length > 0) {
                  console.log('url:' + url);
                  let options = {
                    url: url,
                  };
                  this.elevatorConnectOption = options;
                }
              }
            } else if (dev_id_list && dev_id_list.length > 0) {
              let installRecordInformationArray = [];
              let maintenanceInformationArray = [];

              rows.forEach(item => {
                let use_corp_name = item.use_corp_name;
                let dev_cname = item.dev_cname;
                let createdate = item.createdate;
                let mai_period = item.mai_period;
                let mai_curdate = item.mai_curdate ? item.mai_curdate : ' ';
                let mai_curoper = item.mai_curoper ? item.mai_curoper : ' ';
                let message =
                  '电梯名称:' +
                  dev_cname +
                  '，使用单位:' +
                  use_corp_name +
                  '，安装时间:' +
                  createdate;
                let message2 =
                  '电梯名称:' +
                  dev_cname +
                  '，使用单位:' +
                  use_corp_name +
                  '，维保周期:' +
                  mai_period +
                  '，当前维保时间:' +
                  mai_curdate +
                  '，当前维保人:' +
                  mai_curoper;
                installRecordInformationArray.push(message);
                maintenanceInformationArray.push(message2);
              });

              if (installRecordInformationArray && installRecordInformationArray.length > 0) {
                this.installRecordInformation = installRecordInformationArray;
              }

              if (maintenanceInformationArray && maintenanceInformationArray.length > 0) {
                this.maintenanceInformation = maintenanceInformationArray;
              }
            }
          } else {
            if (this.updateMapMarkers == true) {
              this.emit('map_markers', rows);
            }
          }
          //this.mapChinaOptionValue = rows;
        }
      }
    });

    this.on('cancel_map_markers', args => {
      this.updateMapMarkers = false;
    });

    messageManager.on('9009', args => {
      //debugger;
      if (args && args.resp == '200') {
        let rows = args.rows;
        if (rows && rows.length > 0) {
          let dataTotalArray = [];
          let dataInvalidArray = [];
          let categoryArray = [];

          rows.forEach(item => {
            let month = item.month;
            let total = item.mai_total; // 维保总数
            let invalid = item.mai_invalid; // 维保无效
            //debugger;

            if (month) {
              categoryArray.push(month);
            }

            if (total) {
              dataTotalArray.push(total);
            }

            if (invalid) {
              dataInvalidArray.push(invalid);
            }
          });

          if (
            categoryArray.length > 0 &&
            dataTotalArray.length > 0 &&
            dataInvalidArray.length > 0
          ) {
            this.maintenanceOrdersAndFinishOptionValue.xAxis.data = categoryArray;
            this.maintenanceOrdersAndFinishOptionValue.series[0].data = dataTotalArray;
            this.maintenanceOrdersAndFinishOptionValue.series[1].data = dataInvalidArray;
          }
        }
      }
    });

    messageManager.on('9010', args => {
      if (args && args.resp == '200') {
        let rows = args.rows;
        if (rows && rows.length > 0) {
          let maiUserList = [];
          rows.forEach(item => {
            maiUserList.push({
              name: item.cname ? item.cname : '',
              phone: item.phone ? item.phone : '',
              corp: item.mai_corp_name ? item.mai_corp_name : '',
              area: item.area ? item.area : '',
              time: item.mai_time ? item.mai_time : '',
              location: item.location ? item.location : '',
              status: item.status,
            });
          });
          this.maiUserInfoList = maiUserList;
        }
      }
    });

    messageManager.on('9004', args => {
      //debugger;
      if (args && args.resp == '200') {
        let rows = args.rows;
        if (rows.length > 0) {
          rows.forEach(item => {
            //debugger;
            this.warningMessage = {
              dev_id: item.id,
              id: item.sn,
              message: item.alertname,
            };
          });
        }
        // else {
        //   debugger;
        //   this.warningMessage = {
        //     dev_id: '19876543212345678909',
        //     id: '28774535',
        //     message: '平层困人',
        //   };
        // }
      }
    });

    messageManager.on('9013', args => {
      if (args && args.resp == '200') {
        let rows = args.rows;
        if (rows && rows.length > 0) {
          let rowsArray = [];
          rows.forEach(item => {
            //debugger;
            let user_corp = item.user_corp ? item.user_corp : '';
            let total = item.total ? item.total : '0';
            let alarm_cnt = item.alarm_cnt ? item.alarm_cnt : '0';
            rowsArray.push(user_corp + ' 电梯安装数:' + total + ' 故障数:' + alarm_cnt);
          });

          if (rowsArray.length > 0) {
            this.installRecordData = rowsArray;
          }
        }
      }
    });

    messageManager.on('9011', args => {
      //debugger;
      if (args && args.resp == '200') {
        let rows = args.rows;
        if (rows && rows.length > 0) {
          let rowsArray = [];
          rows.forEach(item => {
            //debugger;
            let dev_id = item.id ? item.id : '';
            let mai_oper_name = item.mai_oper_name ? item.mai_oper_name : '';
            let mai_time = item.mai_time ? item.mai_time : '';
            let mai_etime = item.mai_etime ? item.mai_etime : '';
            let mai_content = item.mai_content ? item.mai_content : '';
            let content = '未知';
            switch (mai_content) {
              case '0':
                content = '半月维保';
                break;
              case '1':
                content = '季度维保';
                break;
              case '2':
                content = '半年维保';
                break;
              case '3':
                content = '年度维保';
                break;
              default:
                content = '未知';
                break;
            }

            rowsArray.push(
              dev_id + ' ' + mai_oper_name + ' ' + mai_time + '' + mai_etime + ' ' + content
            );
          });

          if (rowsArray.length > 0) {
            this.maintenanceRecordData = rowsArray;
          }
        }
      }
    });

    messageManager.on('1002', args => {
      //console.info('subId:' + args.id);
    });

    messageManager.on('1003', args => {
      let currentFloor = args.currentFloor;
      let energy = args.batteryLevel;
      let dynamicInfo = this.dynamicInfoOption;
      let runningState = args.runningState;
      let elevatorCode = args.elevatorCode ? args.elevatorCode : '';
      let isDoorOpen = args.isDoorOpen ? args.isDoorOpen : '-1';
      let floorDisplaying = args.floorDisplaying ? args.floorDisplaying : '未知';
      let isAnyone = args.isAnyone ? args.isAnyone : '-1';
      //debugger;
      this.elevatorStatus = {
        runningState: runningState,
      };

      this.dynamicInfoOption = {
        elevatorCode: elevatorCode,
        isDoorOpen: isDoorOpen,
        floorDisplaying: floorDisplaying,
        status: dynamicInfo.status ? dynamicInfo.status : '',
        isAnyone: isAnyone,
        floors: currentFloor ? currentFloor : '',
        energy: energy,
        signal: dynamicInfo.signal,
        regtelType: dynamicInfo.regtelType,
      };
    });

    messageManager.on('1004', args => {
      let elevatorState = args.elevatorState;
      let signalLevel = args.signalLevel;
      let dynamicInfo = this.dynamicInfoOption;
      let regtelType = args.regtelType;

      //debugger;
      let status = CONSTANT_CONFIG[elevatorState];
      this.dynamicInfoOption = {
        elevatorCode: dynamicInfo.elevatorCode ? dynamicInfo.elevatorCode : '',
        isDoorOpen: dynamicInfo.isDoorOpen ? dynamicInfo.isDoorOpen : '-1',
        floorDisplaying: dynamicInfo.floorDisplaying,
        status: status,
        isAnyone: dynamicInfo.isAnyone,
        floors: dynamicInfo.floors ? dynamicInfo.floors : '',
        energy: dynamicInfo.energy,
        signal: signalLevel ? signalLevel : '',
        regtelType: regtelType,
      };
    });

    this.on('open_iframe', args => {
      debugger;
      this.elevatorInTimeIFrameOption = {
        url: args.url,
        open: args.open,
      };
    });
  }

  @computed get runningDataOption() {
    return toJS(this.runningDataOptionValue);
  }

  set runningDataOption(value) {
    var option = this.runningDataOptionValue;
    this.sumDay = value;
    if (this.sumDay && this.sumDay.length > 0) {
      option.series[0].data = [this.sumDay];
    }
    this.runningDataOptionValue = option;
  }

  @computed get systemCountOption() {
    return toJS(this.systemCountOptionValue);
  }

  set systemCountOption(value) {
    var option = this.systemCountOptionValue;
    this.sumDay = value;
    if (this.sumDay && this.sumDay.length > 0) {
      option.series[0].data = [this.sumDay];
    }
    this.systemCountOptionValue = option;
  }

  @computed get offlineCountOption() {
    return toJS(this.offlineCountOptionValue);
  }

  set offlineCountOption(value) {
    var option = this.offlineCountOptionValue;
    option.xAxis[0].data = value.categoryArray;
    option.series[0].data = value.dataArray;
    this.offlineCountOptionValue = option;
  }

  @computed get mapChinaOption() {
    return toJS(this.mapChinaOptionValue);
  }

  set mapChinaOption(value) {
    var option = this.mapChinaOptionValue;
    this.sumDay = value;
    if (this.sumDay && this.sumDay.length > 0) {
      option.series[0].data = [this.sumDay];
    }
    this.mapChinaOptionValue = option;
  }

  @computed get elevatorErrorEveryMonthOption() {
    return toJS(this.elevatorErrorEveryMonthOptionValue);
  }

  set elevatorErrorEveryMonthOption(value) {
    var option = this.elevatorErrorEveryMonthOptionValue;
    this.sumDay = value;
    if (this.sumDay && this.sumDay.length > 0) {
      option.series[0].data = [this.sumDay];
    }
    this.elevatorErrorEveryMonthOptionValue = option;
  }

  @computed get elevatorErrorRatioOption() {
    return toJS(this.elevatorErrorRatioOptionValue);
  }

  set elevatorErrorRatioOption(value) {
    var option = this.elevatorErrorRatioOptionValue;
    this.sumDay = value;
    if (this.sumDay && this.sumDay.length > 0) {
      option.series[0].data = [this.sumDay];
    }
    this.elevatorErrorRatioOptionValue = option;
  }

  @computed get maintenanceOrdersAndFinishOption() {
    return toJS(this.maintenanceOrdersAndFinishOptionValue);
  }

  set maintenanceOrdersAndFinishOption(value) {
    var option = this.maintenanceOrdersAndFinishOptionValue;
    this.sumDay = value;
    if (this.sumDay && this.sumDay.length > 0) {
      option.series[0].data = [this.sumDay];
    }
    this.maintenanceOrdersAndFinishOptionValue = option;
  }

  @computed get maintenanceOrdersMonthOption() {
    return toJS(this.maintenanceOrdersMonthOptionValue);
  }

  set maintenanceOrdersMonthOption(value) {
    var option = this.maintenanceOrdersMonthOptionValue;
    this.sumDay = value;
    if (this.sumDay && this.sumDay.length > 0) {
      option.series[0].data = [this.sumDay];
    }
    this.maintenanceOrdersMonthOptionValue = option;
  }

  @computed get totalInfo() {
    let totalInfo = {
      total: this.totalValue,
      onLineTotal: this.onLineTotalValue,
    };
    return toJS(totalInfo);
  }

  set totalInfo(value) {
    this.totalValue = value.total;
    this.onLineTotalValue = value.onLineTotal;
  }

  @computed get mapInfo() {
    const t = this;
    const load = function(val) {
      val.pingyin = val.pingyin || 'zhejiang';
      let data1 = require(`echarts/map/js/province/${val.pingyin}`);
      console.log('1');
    };
    async function computeMapData(val) {
      await load(val);
      console.log('2');
      return toJS(t.mapInfoValue);
    }
    computeMapData(toJS(t.mapInfoValue));
    // const mapData =  computeMapData(this.mapInfoValue);
    console.log('3');
    return toJS(this.mapInfoValue);
  }
  set mapInfo(value) {
    this.mapInfoValue = value;
  }

  @computed get installRecordData() {
    return toJS(this.installRecordDataValue);
  }

  set installRecordData(value) {
    this.installRecordDataValue = value;
  }

  @computed get maintenanceRecordData() {
    return toJS(this.maintenanceRecordValue);
  }

  set maintenanceRecordData(value) {
    this.maintenanceRecordValue = value;
  }

  @computed get warningMessage() {
    return toJS(this.warningMessageValue);
  }

  set warningMessage(value) {
    this.warningMessageValue = value;
  }

  @computed get maiUserInfo() {
    return toJS(this.maiUserInfoList);
  }

  set maiUserInfo(list) {
    this.maiUserInfoList = list;
  }

  //设备id维护
  @computed get devIdList() {
    return toJS(this.devIdListValue);
  }

  set devIdList(list) {
    this.devIdListValue = list;
  }

  //电梯故障联系方式 地址
  @computed get elevatorConnectOption() {
    return toJS(this.elevatorConnectOptionValue);
  }

  set elevatorConnectOption(list) {
    this.elevatorConnectOptionValue = list;
  }

  //电梯故障联系方式 地址
  @computed get elevatorInTimeIFrameOption() {
    return toJS(this.elevatorInTimeIFrameOptionValue);
  }

  set elevatorInTimeIFrameOption(objOption) {
    this.elevatorInTimeIFrameOptionValue = objOption;
  }

  @computed get dynamicInfoOption() {
    return toJS(this.dynamicInfoOptionValue);
  }

  set dynamicInfoOption(value) {
    this.dynamicInfoOptionValue = value;
  }

  //单个电梯状态
  @computed get elevatorStatus() {
    return toJS(this.elevatorStatusValue);
  }

  set elevatorStatus(value) {
    this.elevatorStatusValue = value;
  }

  @computed get elevatorLog() {
    return toJS(this.elevatorLogValue);
  }

  set elevatorLog(value) {
    this.elevatorLogValue = value;
  }

  @computed get elevatorDevInfo() {
    return toJS(this.elevatorDevInfoValue);
  }

  set elevatorDevInfo(value) {
    this.elevatorDevInfoValue = value;
  }

  @computed get installRecordInformation() {
    return toJS(this.installRecordInformationValue);
  }

  set installRecordInformation(value) {
    this.installRecordInformationValue = value;
  }

  @computed get maintenanceInformation() {
    return toJS(this.maintenanceInformationValue);
  }

  set maintenanceInformation(value) {
    this.maintenanceInformationValue = value;
  }
}

export default new sharedData();

//console.log (runningData.runningDataOption);
//recompute fullname
//first last

//console.log(test.fullName);
//recompute fullname
//first last
