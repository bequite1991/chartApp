import {observable, computed, toJS, autorun} from 'mobx';

import {
  Elevator_Running_Data_Chart_Options,
  Elevator_System_Count_Chart_Options,
  Elevator_Running_Distance_Every_Month_Chart_Option,
} from '../datacenter/chartConfig';
/**
 * 电梯运行数据
 */
class sharedData {
  @observable runningDataOptionValue = Elevator_Running_Data_Chart_Options;
  @observable systemCountOptionValue = Elevator_System_Count_Chart_Options;
  @observable runningDistanceEveryMonthOptionValue = Elevator_Running_Distance_Every_Month_Chart_Option;

  sumDay = '50'; // 运行天数

  //runningDataOption = null;

  constructor () {
    //var runningDataOptionValue = this.runningDataOptionValue;
    //var runningDataOptionValue_series = runningDataOptionValue.series[0];
    //let series = [row];
    this.runningDataOptionValue.series[0].data = ['50'];
    this.systemCountOptionValue.series[0].data = ['150'];

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
}

export default new sharedData ();

//console.log (runningData.runningDataOption);
//recompute fullname
//first last

//console.log(test.fullName);
//recompute fullname
//first last
