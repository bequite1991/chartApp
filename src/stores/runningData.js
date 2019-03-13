import {observable, computed, toJS} from 'mobx';

import {Elevator_Running_Data_Chart_Options} from '../datacenter/chartConfig';
/**
 * 电梯运行数据
 */
class RunningData {
  @observable optionValue = Elevator_Running_Data_Chart_Options;
  sumDay = '200'; // 运行天数

  //runningDataOption = null;

  RunningData () {
    let row = {
      name: '2019年',
      type: 'bar',
      data: [this.sumDay],
    };
    let series = [row];
    this.optionValue.series = series;
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
