import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './elevatorLog.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import {inject, observer} from 'mobx-react';
import {debug} from 'util';

@inject ('sharedData')
@observer
export default class SystemCountChart extends React.Component {
  constructor (props) {
    super (props);
    this.state = {};
  }
  componentWillUnmount () {}

  onChartClick (param, echarts) {
    console.log (param);
  }

  render () {
    let onEvents = {
      click: this.onChartClick.bind (this),
    };

    const {sharedData} = this.props;
    const elevatorLog = sharedData.elevatorLog;
    return (
      <div className={styles.elevatorStatus}>
        <span className={styles.title}>电梯上下线日志</span>
        <span>运行状态：{elevatorLog.status}</span>
        <span>楼层：{elevatorLog.floors}</span>
        <span>电量：{elevatorLog.energy}</span>
        <span>信号：{elevatorLog.signal}</span>
      </div>
    );
  }
}
