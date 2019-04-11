import React, { Component } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './elevatorStatus.less';
import ReactEcharts from 'echarts-for-react';
import { inject, observer } from 'mobx-react';
import router from 'umi/router';

import QueryString from 'query-string';

const uuid = require('node-uuid');

require('echarts/map/js/china.js');

var opts = {
  width: 250, // 信息窗口宽度
  height: 80, // 信息窗口高度
  title: '信息窗口', // 信息窗口标题
  enableMessage: true, //设置允许信息窗发送短息
};

var data = [
  { mapy: '32.94584', mapx: '112.894350', time: '12:30' },
  { id: '1', mapy: '33.34683', mapx: '112.694300', time: '11:30' },
  { mapy: '33.54702', mapx: '112.094380', time: '10:30' },
  { mapy: '33.148780', mapx: '116.494390', time: '13:30' },
];

@inject('sharedData', 'messageManager')
@observer
export default class ElevatorStatus extends Component {
  uuid = '';
  constructor(props) {
    super(props);
    const dev_id = QueryString.parse(window.location.search).dev_id || '';

    this.uuid = uuid.v1();
    const { messageManager } = this.props;

    messageManager.emit('register', {
      uuid: this.uuid,
      cmd: '9006',
      filter: dev_id,
    });

    messageManager.emit('register', {
      uuid: this.uuid,
      cmd: '9001',
      filter: dev_id,
    });

    messageManager.emit('register', {
      uuid: this.uuid,
      cmd: '9004',
      filter: dev_id,
    });
  }

  componentWillUnmount() {
    debugger;
    const { messageManager } = this.props;
    messageManager.emit('unregister', { uuid: this.uuid, cmd: '9006' });
    messageManager.emit('unregister', { uuid: this.uuid, cmd: '9001' });
    messageManager.emit('unregister', { uuid: this.uuid, cmd: '9004' });
  }

  render() {
    const { sharedData } = this.props;
    const elevatorStatus = sharedData.dynamicInfoOption.status;
    const totalInfo = sharedData.totalInfo;
    const dev_info = sharedData.elevatorDevInfo;

    const runningState = sharedData.elevatorStatus.runningState;

    const total = totalInfo ? (totalInfo.total ? totalInfo.total : '0') : '0';
    const onLineTotal = totalInfo ? (totalInfo.onLineTotal ? totalInfo.onLineTotal : '0') : '0';
    let statusText;
    switch (elevatorStatus) {
      case 0:
        statusText = '离线';
        break;
      case 1:
        statusText = '正常';
        break;
      case 2:
        statusText = '困人';
        break;
      case 3:
        statusText = '正常 通话中 检修中';
        break;
      case 4:
        statusText = '正常 通话中 检修中';
        break;
      case 5:
        statusText = '正常 通话中';
        break;
      case 6:
        statusText = '困人 通话中';
        break;
      case 7:
        statusText = '正常 检修中';
        break;
      case 8:
        statusText = '困人 检修中';
        break;
      case 9:
        statusText = '故障';
        break;
      case 10:
        statusText = '故障 通话中 检修中';
        break;
      case 11:
        statusText = '故障 通话中';
        break;
      case 12:
        statusText = '故障 检修中';
        break;
      default:
        statusText = elevatorStatus;
    }

    switch (runningState) {
      case 1:
        statusText = '上行';
        break;
      case 2:
        statusText = '下行';
        break;
      case 3:
        statusText = '停止';
        break;
      default:
        statusText = '未知';
        break;
    }

    return (
      <div className={styles.mapChina}>
        <p className={styles.title}>{dev_info.name}</p>
        <div className={styles.subtitle}>
          <p className={styles.title}>状态:{statusText}</p>
        </div>
        <div className={styles.elevator1} />
      </div>
    );
  }
}
