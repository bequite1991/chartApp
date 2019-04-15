import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import QueryString from 'query-string';

const nodeUUID = require('node-uuid');

import eventProxy from '../../../lib/eventProxy';

import { inject, observer } from 'mobx-react';
import { debug } from 'util';

@inject('warningManager')
@observer
export default class MaintenanceRecord extends React.Component {
  uuid = '';
  constructor(props) {
    super(props);
    //debugger;
    const { warningManager } = this.props;
    const uuid_ = nodeUUID.v1();
    const devId = warningManager.getCurrFiter() || '';
    this.state = { devId: devId, uuid: uuid_ };
    warningManager.emit('register', { uuid: uuid_, cmd: '9011', filter: devId });

    eventProxy.on('msg-9011-' + devId, msg => {
      debugger;
      const { uuid, devId } = this.state;
      this.setState({
        maintenanceRecordData: msg.maintenanceRecordData,
        devId: devId,
        uuid: uuid,
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { warningManager } = this.props;
    const { uuid, devId } = this.state;
    warningManager.emit('unregister', { uuid: uuid, cmd: '9011' });
    eventProxy.off('msg-9011-' + devId);

    let uuid2 = nodeUUID.v1();
    let devId2 = warningManager.getCurrFiter() || '';
    this.setState({ devId: devId2, uuid: uuid2 });
    warningManager.emit('register', { uuid: uuid2, cmd: '9011', filter: devId2 });

    eventProxy.on('msg-9011-' + devId2, msg => {
      debugger;
      const { uuid, devId } = this.state;
      this.setState({
        maintenanceRecordData: msg.maintenanceRecordData,
        devId: devId,
        uuid: uuid,
      });
    });
  }

  componentWillUnmount() {
    const { warningManager } = this.props;
    const { uuid, devId } = this.state;
    warningManager.emit('unregister', { uuid: uuid, cmd: '9011' });
    eventProxy.off('msg-9011-' + devId);
  }

  onChartClick(param, echarts) {
    console.log(param);
  }

  render() {
    //const { warningManager } = this.props;
    const { maintenanceRecordData } = this.state;

    let arr = [];
    let list = maintenanceRecordData ? maintenanceRecordData : [];
    if (list) {
      list.forEach((ele, key) => {
        arr.push(
          <span key={key} className={styles.maintenanceRecordDetail}>
            {ele}
          </span>
        );
      });
    }

    return (
      <div className={styles.maintenanceRecord}>
        <span className={styles.title}>电梯维保记录</span>
        <div className={styles.maintenanceRecordContent}>{arr}</div>
      </div>
    );
  }
}
