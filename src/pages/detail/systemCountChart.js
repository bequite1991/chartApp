import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './systemCountChart.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import {inject, observer} from 'mobx-react';
import {debug} from 'util';

@inject ('sharedData', 'messageManager')
@observer
export default class SystemCountChart extends React.Component {
  constructor (props) {
    super (props);
    this.state = {};
    const {messageManager} = this.props;
    messageManager.emit ('register', {cmd: '9005'});
    //messageManager.emit("register",{cmd:"9001"})
  }

  componentWillUnmount () {
    const {messageManager} = this.props;
    messageManager.emit ('unregister', {cmd: '9005'});
  }

  onChartClick (param, echarts) {
    console.log (param);
  }

  render () {
    let onEvents = {
      click: this.onChartClick.bind (this),
    };

    const {sharedData} = this.props;
    const option = sharedData.systemCountOption;
    return (
      <div className={styles.elevatorStatus}>
        <span className={styles.title}>电梯动态信息</span>
        <span>运行状态：{option.status}</span>
        <span>楼层：{option.floors}</span>
        <span>电量：{option.energy}</span>
        <span>信号：{option.signal}</span>
      </div>
    );
  }
}
