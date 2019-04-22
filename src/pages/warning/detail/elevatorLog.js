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

const nodeUUID = require('node-uuid');

import eventProxy from '../../../lib/eventProxy';

@inject('warningManager')
@observer
export default class ElevatorLog extends React.Component {
  constructor(props) {
    super(props);
    debugger;
    const { warningManager } = this.props;
    const uuid_ = nodeUUID.v1();
    const devId = warningManager.getCurrFiter() || '';
    this.state = { devId: devId, uuid: uuid_ };

    warningManager.emit('register', { uuid: uuid_, cmd: '9002', filter: devId });

    eventProxy.on('msg-9002-' + devId, msg => {
      const { devId, uuid } = this.state;
      this.setState({
        elevatorLog: msg.elevatorLog,
        devId: devId,
        uuid: uuid,
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { warningManager } = this.props;
    const { uuid, devId } = this.state;
    warningManager.emit('unregister', { uuid: uuid, cmd: '9002' });
    eventProxy.off('msg-9002-' + devId);

    let uuid2 = nodeUUID.v1();
    let devId2 = warningManager.getCurrFiter() || '';
    this.setState({ devId: devId2, uuid: uuid2 });

    warningManager.emit('register', { uuid: uuid2, cmd: '9002', filter: devId2 });

    eventProxy.on('msg-9002-' + devId2, msg => {
      const { devId, uuid } = this.state;
      this.setState({ elevatorLog: msg.elevatorLog, devId: devId, uuid: uuid });
    });
  }

  componentWillUnmount() {
    const { warningManager } = this.props;
    const { uuid, devId } = this.state;
    warningManager.emit('unregister', { uuid: uuid, cmd: '9002' });
    eventProxy.off('msg-9002-' + devId);
  }

  onChartClick(param, echarts) {
    console.log(param);
  }

  render() {
    // let onEvents = { click: this.onChartClick.bind(this) };

    // const { warningManager } = this.props;

    const { elevatorLog } = this.state;
    //const elevatorLog = null; // = warningManager.elevatorLog;

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
