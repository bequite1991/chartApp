import {observable, computed, toJS, autorun} from 'mobx';
import {randomData} from "../lib/helper.js";


import {
  Elevator_Running_Data_Chart_Options,
  Elevator_System_Count_Chart_Options,
  Elevator_Running_Distance_Every_Month_Chart_Option,
  Elevator_Map_China_Options,
} from '../datacenter/chartConfig';
/**
 * 电梯运行数据
 */
class sharedData {
  @observable runningDataOptionValue = Elevator_Running_Data_Chart_Options;
  @observable systemCountOptionValue = Elevator_System_Count_Chart_Options;
  @observable runningDistanceEveryMonthOptionValue = Elevator_Running_Distance_Every_Month_Chart_Option;
  @observable mapChinaOptionValue = Elevator_Map_China_Options;



  sumDay = '50'; // 运行天数

  //runningDataOption = null;

  constructor () {
    //var runningDataOptionValue = this.runningDataOptionValue;
    //var runningDataOptionValue_series = runningDataOptionValue.series[0];
    //let series = [row];
    this.runningDataOptionValue.series[0].data = ['50'];
    this.systemCountOptionValue.series[0].data = ['150'];

    this.mapChinaOptionValue.series[0].data = [
      {name: '北京',value: randomData() },
      {name: '天津',value: randomData() },
      {name: '上海',value: randomData() },
      {name: '广东',value: randomData() },
      {name: '台湾',value: randomData() },
      {name: '香港',value: randomData() },
      {name: '澳门',value: randomData() }
    ];
    debugger

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
}

export default new sharedData ();

//console.log (runningData.runningDataOption);
//recompute fullname
//first last

//console.log(test.fullName);
//recompute fullname
//first last
