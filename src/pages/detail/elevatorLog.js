import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './elevatorLog.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import { inject, observer } from 'mobx-react';
import { debug } from 'util';

import QueryString from 'query-string';

const uuid = require('node-uuid');

@inject('sharedData', 'messageManager')
@observer
export default class ElevatorLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.uuid = uuid.v1();
    const dev_id = QueryString.parse(window.location.search).dev_id || '';
    const { messageManager } = this.props;
    messageManager.emit('register', {
      uuid: this.uuid,
      cmd: '9002',
      filter: dev_id,
    });
  }
  componentWillUnmount() {
    const { messageManager } = this.props;
    messageManager.emit('unregister', { uuid: this.uuid, cmd: '9002' });
    this.uuid = '';
  }

  onChartClick(param, echarts) {
    console.log(param);
  }

  render() {
    let onEvents = { click: this.onChartClick.bind(this) };

    const { sharedData } = this.props;
    const elevatorLog = sharedData.elevatorLog;

    let arr = [];
    let list = elevatorLog ? elevatorLog : [];
    if (list) {
      list.forEach((ele, key) => {
        arr.push(
          <span key={key} className={styles.elevatorLogDetail}>
            {ele}
          </span>
        );
      });
    }

    /**
     * <span>电梯编号：{elevatorLog.dev_id}</span>
        <span>电梯名称：{elevatorLog.dev_cname}</span>
        <span>上线时间：{elevatorLog.on_time}</span>
        <span>下线时间：{elevatorLog.off_time}</span>
     */
    return (
      <div className={styles.elevatorLog}>
        <span className={styles.title}>电梯上下线日志</span>
        <div className={styles.elevatorLogDetailContent}>
          <marquee loop="-1" direction="up" scrolldelay="100">
            {arr}
          </marquee>
        </div>
      </div>
    );
  }
}
