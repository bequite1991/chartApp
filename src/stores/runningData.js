import {observable, computed, toJS, autorun} from 'mobx';

import {Elevator_Running_Data_Chart_Options} from '../datacenter/chartConfig';
/**
 * 电梯运行数据
 */
class RunningData {
  @observable optionValue = Elevator_Running_Data_Chart_Options;
  sumDay = '50'; // 运行天数

  //runningDataOption = null;

  constructor () {
    let row = {
      name: '2019年',
      type: 'bar',
      data: [this.sumDay],
    };
    let series = [row];
    this.optionValue.series = series;

    // const optionValueWatcher = computed (() => {
    //   return this.optionValue;
    // });

    // autorun (() => {
    //   let option = optionValueWatcher;
    //   console.info ('autorun:' + option);
    // });
  }

  @computed get runningDataOption () {
    return toJS (this.optionValue);
  }

  set runningDataOption (value) {
    var option = this.optionValue;
    this.sumDay = value;
    if (this.sumDay && this.sumDay.length > 0) {
      let row = {
        name: '2019年',
        type: 'bar',
        data: [this.sumDay],
      };
      let series = [row];
      option.series = series;
    }
    this.optionValue = option;
  }
}

export default new RunningData ();

//console.log (runningData.runningDataOption);
//recompute fullname
//first last

//console.log(test.fullName);
//recompute fullname
//first last
