import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './systemCountChart.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import {inject, observer} from 'mobx-react';
import {debug} from 'util';

import QueryString from 'query-string';

const uuid = require ('node-uuid');

@inject ('sharedData', 'messageManager')
@observer
export default class SystemCountChart extends React.Component {
  uuid = '';
  constructor (props) {
    super (props);
    this.state = {};

    this.uuid = uuid.v1 ();
    const dev_id = QueryString.parse (window.location.search).dev_id || '';
    const {messageManager} = this.props;
    // messageManager.emit ('register', {
    //   uuid: this.uuid,
    //   cmd: '9005',
    //   filter: QueryString.dev_id ? QueryString.dev_id : '',
    // });
    //messageManager.emit("register",{cmd:"9001"})
  }

  componentWillUnmount () {
    const {messageManager} = this.props;
    // messageManager.emit ('unregister', {
    //   uuid: this.uuid,
    //   cmd: '9005',
    // });
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
