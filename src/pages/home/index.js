import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';

// 电梯运行数据(Elevator Running Data)
import Elevator_Running_Data_Chart from './chart1';
// 电梯系统安装数量(Elevator System Count)
import Elevator_System_Count_Chart from './chart2';
// 每月电梯运行距离(Elevator Running Distance Every Month)
import Elevator_Running_Distance_Every_Month_Chart from './chart3';
//
import Chart4 from './chart4';
import Chart5 from './chart5';
//
import Map from './map';

export default class GlobalHeader extends PureComponent {
  constructor (props) {
    super (props);
    this.state = {};
  }
  componentWillUnmount () {}
  /* eslint-disable*/
  @Debounce (600)
  triggerResizeEvent () {
    // eslint-disable-line
    const event = document.createEvent ('HTMLEvents');
    event.initEvent ('resize', true, false);
    window.dispatchEvent (event);
  }
  render () {
    const {collapsed, isMobile, logo} = this.props;
    return (
      <div>
        <Elevator_Running_Data_Chart />
        <Elevator_System_Count_Chart />
        <Elevator_Running_Distance_Every_Month_Chart />
        <Map />
      </div>
    );
  }
}
