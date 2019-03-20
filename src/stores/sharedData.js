import {observable, computed, toJS, autorun} from 'mobx';
import EventEmitter from 'events';
import {randomData} from "../lib/helper.js";


import {
  Elevator_Running_Data_Chart_Options,
  Elevator_System_Count_Chart_Options,
  Elevator_Running_Distance_Every_Month_Chart_Option,
  Elevator_Map_China_Options,
  Elevator_Error_Every_Month_Chart_Options,
  Elevator_Error_Ratio_Chart_Options,
  Elevator_Maintenance_OrdersAndFinish_Chart_Options,
  Elevator_maintenance_Orders_Month_Chart_Options,
  Map_Info_Value
} from '../datacenter/chartConfig';
/**
 * 电梯运行数据
 */
class sharedData extends EventEmitter{
  @observable runningDataOptionValue = Elevator_Running_Data_Chart_Options;
  @observable systemCountOptionValue = Elevator_System_Count_Chart_Options;
  @observable runningDistanceEveryMonthOptionValue = Elevator_Running_Distance_Every_Month_Chart_Option;
  @observable mapChinaOptionValue = Elevator_Map_China_Options;
  @observable elevatorErrorEveryMonthOptionValue = Elevator_Error_Every_Month_Chart_Options;
  @observable elevatorErrorRatioOptionValue = Elevator_Error_Ratio_Chart_Options;
  @observable maintenanceOrdersAndFinishOptionValue = Elevator_Maintenance_OrdersAndFinish_Chart_Options;
  @observable maintenanceOrdersMonthOptionValue = Elevator_maintenance_Orders_Month_Chart_Options;
  @observable mapInfoValue = Map_Info_Value;



  sumDay = '50'; // 运行天数

  //runningDataOption = null;

  constructor () {
    super();
    //var runningDataOptionValue = this.runningDataOptionValue;
    //var runningDataOptionValue_series = runningDataOptionValue.series[0];
    //let series = [row];
    this.runningDataOptionValue.series[0].data = ['50'];
    this.systemCountOptionValue.series[0].data = ['150'];

    this.mapChinaOptionValue.series[0].data = [
      {name: '北京',value: randomData(),pingyin:"beijing"},
      {name: '天津',value: randomData(),pingyin:"beijing" },
      {name: '上海',value: randomData(),pingyin:"beijing" },
      {name: '浙江',value: randomData(),pingyin:"zhejiang" },
      {name: '台湾',value: randomData(),pingyin:"beijing" },
      {name: '香港',value: randomData(),pingyin:"beijing" },
      {name: '澳门',value: randomData(),pingyin:"beijing" }
    ];
    this.elevatorErrorEveryMonthOptionValue.series = [
        {
            name:'故障数',
            type:'bar',
            barWidth: '60%',
            data:[100, 2, 2, 5, 6, 7, 6,5,4,3,1,2]
        }
    ];
    this.elevatorErrorRatioOptionValue.series = [
        {
            name: '访问来源',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'电气强度降低'},
                {value:310, name:'磨损与污损'},
                {value:234, name:'整体故障'},
                {value:135, name:'贯穿'},
                {value:1548, name:'其他故障'}
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]

    this.maintenanceOrdersAndFinishOptionValue.series = [
         {
            name: '完成量',
            type: 'line',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: [320, 302, 301, 334, 390, 330, 320]
        },
        {
            name: '未成量',
            type: 'line',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: [120, 132, 101, 134, 90, 230, 210]
        },
    ]

    this.maintenanceOrdersMonthOptionValue.series = [
        {
            name:'维保数',
            type:'bar',
            barWidth: '60%',
            data:[10, 20, 20, 50, 60, 70, 60,50,40,30,10,20]
        }
    ]

    // const optionValueWatcher = computed (() => {
    //   return this.optionValue;
    // });

    // autorun (() => {
    //   let option = optionValueWatcher;
    //   console.info ('autorun:' + option);
    // });
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


  // async computeMapData (val){
  //   await ()=>{
  //     try{
  //       let data1 = require(`echarts/map/js/province/${val.pingyin}`);
  //       return true;
  //     }catch(ex){
  //       console.log("error:",ex);
  //     }
  //   }
  // }
  @computed get mapInfo () {
    const t = this;
    const load = function(val){
      let data1 = require(`echarts/map/js/province/${val.pingyin}`);
      console.log("1")
    }
    async function computeMapData (val){
      await load(val);
      console.log("2")
      return toJS (t.mapInfoValue);
    }
    computeMapData (toJS (t.mapInfoValue))
    // const mapData =  computeMapData(this.mapInfoValue);
    console.log("3")
    return toJS (this.mapInfoValue);

  }
  set mapInfo (value) {
    this.mapInfoValue = value;
  }
}

export default new sharedData ();

//console.log (runningData.runningDataOption);
//recompute fullname
//first last

//console.log(test.fullName);
//recompute fullname
//first last
