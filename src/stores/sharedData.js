import {observable, computed, toJS, autorun} from 'mobx';
import EventEmitter from 'events';
import {randomData} from '../lib/helper.js';

import messageManager from './messageManager';

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
  @observable mapChinaOptionValue = Elevator_Map_China_Options;
  @observable elevatorErrorEveryMonthOptionValue = Elevator_Error_Every_Month_Chart_Options;
  @observable elevatorErrorRatioOptionValue = Elevator_Error_Ratio_Chart_Options;
  @observable maintenanceOrdersAndFinishOptionValue = Elevator_Maintenance_OrdersAndFinish_Chart_Options;
  @observable maintenanceOrdersMonthOptionValue = Elevator_maintenance_Orders_Month_Chart_Options;
  @observable mapInfoValue = Map_Info_Value;

  @observable totalValue = '0'; // 总数量
  @observable onLineTotalValue = '0'; // 在线数量

  sumDay = '50'; // 运行天数

  //runningDataOption = null;

  constructor () {
    super ();

    this.runningDataOptionValue.series[0].data = ['0'];
    this.systemCountOptionValue.series[0].data = ['0'];

    this.mapChinaOptionValue.series[0].data = [
      {name: '北京', value: randomData (), pingyin: 'beijing'},
      {name: '天津', value: randomData (), pingyin: 'beijing'},
      {name: '上海', value: randomData (), pingyin: 'beijing'},
      {name: '浙江', value: randomData (), pingyin: 'zhejiang'},
      {name: '台湾', value: randomData (), pingyin: 'beijing'},
      {name: '香港', value: randomData (), pingyin: 'beijing'},
      {name: '澳门', value: randomData (), pingyin: 'beijing'},
    ];
    this.elevatorErrorEveryMonthOptionValue.series = [
      {
        name: '故障数',
        type: 'bar',
        barWidth: '60%',
        data: [0, 0, 0, 0, 0],
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
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'insideRight',
          },
        },
        data: [320, 302, 301, 334, 390, 330, 320],
      },
      {
        name: '未成量',
        type: 'line',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'insideRight',
          },
        },
        data: [120, 132, 101, 134, 90, 230, 210],
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
      'xxxx小区安装纪律1',
      'xxxx小区安装纪律2',
      'xxxx小区安装纪律3',
      'xxxx小区安装纪律4',
      'xxxx小区安装纪律5',
      'xxxx小区安装纪律6',
    ];
    //小区维保记录
    this.maintenanceRecordValue = [
      'xxxx小区维保纪律1',
      'xxxx小区维保纪律2',
      'xxxx小区维保纪律3',
      'xxxx小区维保纪律4',
      'xxxx小区维保纪律5',
      'xxxx小区维保纪律6',
    ];


    this.warningMessageValue = {
      id:123,
      message:"浙江省杭州市余杭区 xxx 电梯 xxx故障"
    }

    // const optionValueWatcher = computed (() => {
    //   return this.optionValue;
    // });

    // autorun (() => {
    //   let option = optionValueWatcher;
    //   console.info ('autorun:' + option);
    // });

    messageManager.on ('9012', args => {
      if (args && args.resp == '200') {
        let rows = args.rows;

        if (rows && rows.length > 0) {
          let dataArray = [];

          rows.forEach (item => {
            let data = item.total;
            dataArray.push (data);
          });

          this.runningDataOptionValue.series[0].data = dataArray;
        }
      }
    });

    messageManager.on ('9005', args => {
      if (args && args.resp == '200') {
        let rows = args.rows;

        if (rows && rows.length > 0) {
          let dataArray = [];
          let categoryArray = [];

          rows.forEach (item => {
            let month = item.month;
            let total = item.total;
            categoryArray.push (month);
            dataArray.push (total);
          });
          this.systemCountOptionValue.xAxis[0].data = categoryArray;
          this.systemCountOptionValue.series[0].data = dataArray;
        }
      }
    });

    messageManager.on ('9006', args => {
      if (args && args.resp == '200') {
        let rows = args.rows;
        if (rows && rows.length > 0) {
          let row = rows[0];
          let totalInfo = {
            total: row.total ? row.total : '0',
            onLineTotal: row.on_total ? row.on_total : '0',
          };
          this.totalInfo = totalInfo;
        }
      }
    });

    messageManager.on ('9007', args => {
      if (args && args.resp == '200') {
        let rows = args.rows;
        if (rows && rows.length > 0) {
          let dataArray = [];
          let categoryArray = [];
          let pieDataArray = [];

          rows.forEach (item => {
            let title = item.on_total;
            let total = item.total;
            categoryArray.push (title);
            dataArray.push (total);

            pieDataArray.push ({
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
            },
          ];

          this.elevatorErrorRatioOptionValue.legend.data = categoryArray;
          this.elevatorErrorRatioOptionValue.series[0].data = pieDataArray;
        }
      }
    });

    messageManager.on ('9003', args => {
      if (args && args.resp == '200') {
        let rows = args.rows;
        if (rows && rows.length > 0) {
          let dataArray = [];
          let categoryArray = [];

          rows.forEach (item => {
            let month = item.month;
            let total = item.total;
            categoryArray.push (month);
            dataArray.push (total);
          });

          this.offlineCountOptionValue.xAxis[0].data = categoryArray;

          this.offlineCountOptionValue.series = [
            {
              name: '离线数量',
              type: 'bar',
              barWidth: '10%',
              data: dataArray,
            },
          ];
        }
      }
    });
  }

  @computed get runningDataOption () {
    return toJS (this.runningDataOptionValue);
  }

  set runningDataOption (value) {
    var option = this.runningDataOptionValue;
    this.sumDay = value;
    if (this.sumDay && this.sumDay.length > 0) {
      option.series[0].data = [this.sumDay];
    }
    this.runningDataOptionValue = option;
  }

  @computed get systemCountOption () {
    return toJS (this.systemCountOptionValue);
  }

  set systemCountOption (value) {
    var option = this.systemCountOptionValue;
    this.sumDay = value;
    if (this.sumDay && this.sumDay.length > 0) {
      option.series[0].data = [this.sumDay];
    }
    this.systemCountOptionValue = option;
  }

  @computed get offlineCountOption () {
    return toJS (this.offlineCountOptionValue);
  }

  set offlineCountOption (value) {
    var option = this.offlineCountOptionValue;
    option.xAxis[0].data = value.categoryArray;
    option.series[0].data = value.dataArray;
    this.offlineCountOptionValue = option;
  }

  @computed get mapChinaOption () {
    return toJS (this.mapChinaOptionValue);
  }

  set mapChinaOption (value) {
    var option = this.mapChinaOptionValue;
    this.sumDay = value;
    if (this.sumDay && this.sumDay.length > 0) {
      option.series[0].data = [this.sumDay];
    }
    this.mapChinaOptionValue = option;
  }

  @computed get elevatorErrorEveryMonthOption () {
    return toJS (this.elevatorErrorEveryMonthOptionValue);
  }

  set elevatorErrorEveryMonthOption (value) {
    var option = this.elevatorErrorEveryMonthOptionValue;
    this.sumDay = value;
    if (this.sumDay && this.sumDay.length > 0) {
      option.series[0].data = [this.sumDay];
    }
    this.elevatorErrorEveryMonthOptionValue = option;
  }

  @computed get elevatorErrorRatioOption () {
    return toJS (this.elevatorErrorRatioOptionValue);
  }

  set elevatorErrorRatioOption (value) {
    var option = this.elevatorErrorRatioOptionValue;
    this.sumDay = value;
    if (this.sumDay && this.sumDay.length > 0) {
      option.series[0].data = [this.sumDay];
    }
    this.elevatorErrorRatioOptionValue = option;
  }

  @computed get maintenanceOrdersAndFinishOption () {
    return toJS (this.maintenanceOrdersAndFinishOptionValue);
  }

  set maintenanceOrdersAndFinishOption (value) {
    var option = this.maintenanceOrdersAndFinishOptionValue;
    this.sumDay = value;
    if (this.sumDay && this.sumDay.length > 0) {
      option.series[0].data = [this.sumDay];
    }
    this.maintenanceOrdersAndFinishOptionValue = option;
  }

  @computed get maintenanceOrdersMonthOption () {
    return toJS (this.maintenanceOrdersMonthOptionValue);
  }

  set maintenanceOrdersMonthOption (value) {
    var option = this.maintenanceOrdersMonthOptionValue;
    this.sumDay = value;
    if (this.sumDay && this.sumDay.length > 0) {
      option.series[0].data = [this.sumDay];
    }
    this.maintenanceOrdersMonthOptionValue = option;
  }

  @computed get totalInfo () {
    let totalInfo = {
      total: this.totalValue,
      onLineTotal: this.onLineTotalValue,
    };
    return toJS (totalInfo);
  }

  set totalInfo (value) {
    this.totalValue = value.total;
    this.onLineTotalValue = value.onLineTotal;
  }

  @computed get mapInfo () {
    const t = this;
    const load = function (val) {
      val.pingyin = val.pingyin || "zhejiang";
      let data1 = require (`echarts/map/js/province/${val.pingyin}`);
      console.log ('1');
    };
    async function computeMapData (val) {
      await load (val);
      console.log ('2');
      return toJS (t.mapInfoValue);
    }
    computeMapData (toJS (t.mapInfoValue));
    // const mapData =  computeMapData(this.mapInfoValue);
    console.log ('3');
    return toJS (this.mapInfoValue);
  }
  set mapInfo (value) {
    this.mapInfoValue = value;
  }

  @computed get installRecordData () {
    return toJS (this.installRecordDataValue);
  }

  set installRecordData (value) {
    this.installRecordDataValue = value;
  }

  @computed get maintenanceRecordData () {
    return toJS (this.maintenanceRecordValue);
  }

  set maintenanceRecordData (value) {
    this.maintenanceRecordValue = value;
  }

  @computed get warningMessage () {
    return toJS (this.warningMessageValue);
  }

  set warningMessage (value) {
    this.warningMessageValue = value;
  }
}

export default new sharedData ();

//console.log (runningData.runningDataOption);
//recompute fullname
//first last

//console.log(test.fullName);
//recompute fullname
//first last
