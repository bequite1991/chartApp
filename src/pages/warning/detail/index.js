import React, { PureComponent } from 'react';
import { inject, observer } from 'mobx-react';
import { Icon, Row, Col, Button, notification } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';

import { Provider } from 'mobx-react';

import router from 'umi/router';

import sharedDataDetail from '../../../stores/sharedDataDetail.js';
import sharedData from '../../../stores/sharedData';

// 电梯运行数据(Elevator Running Data)
import RunningDataChart from './runningDataChart';
// 电梯动态信息(Elevator System Count)
import DynamicInfo from './dynamicInfo';
// 每月电梯故障数(Elevator Error Every Month)
import Elevator_Error_Connect from './elevatorErrorConnect.js';
// 每月电梯故障比例(Elevator Error Ratio)
import Elevator_Log from './elevatorLog.js';

// 电梯状态(Elevator Error Ratio)
import Elevator_Status from './elevatorStatus.js';
// //安装记录
// import Installation_Record from './installationRecord.js';
//维保记录
import Maintenance_Record from './maintenanceRecord.js';

import ElevatorInTimeIFrame from './elevatorInTimeIFrame';
import messageManager from '../../../stores/messageManager';

// @inject ('runningData')
// @observer
export default class Detail extends PureComponent {
  init = false;
  constructor(props) {
    super(props);
    this.state = {};
    debugger;
  }

  componentWillUnmount() {}

  componentWillReceiveProps(nextProps) {
    //debugger;
  }

  goBack() {
    window.location.href = '/home';
  }

  render() {
    let charts;
    const props = this.props;

    const dev_id = this.props.warningMessage.dev_id ? this.props.warningMessage.dev_id : '';

    if (document.body.clientWidth < 1000) {
      charts = (
        <Row>
          <Col span={24}>
            <Elevator_Status />
          </Col>
          <Col span={24}>
            <div className={styles.RunningDataChart}>
              <RunningDataChart className={styles.RunningDataChart} devId={dev_id} />
            </div>
            <div className={styles.chartContent}>
              <DynamicInfo className={styles.SystemCountChart} devId={dev_id} />
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.chartContent}>
              <Elevator_Error_Connect className={styles.Elevator_Error_Connect} devId={dev_id} />
            </div>
            <div className={styles.chartContent}>
              <Elevator_Log className={styles.Elevator_Log} devId={dev_id} />
            </div>
          </Col>
        </Row>
      );
    } else {
      charts = (
        <Row>
          <Col span={6}>
            <div className={styles.RunningDataChart}>
              <RunningDataChart devId={dev_id} />
            </div>
            <div className={styles.SystemCountChart}>
              <DynamicInfo devId={dev_id} />
            </div>
          </Col>
          <Col span={12}>
            <Elevator_Status />
            <div className={styles.Maintenance_Record}>
              <Maintenance_Record devId={dev_id} />
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.Elevator_Error_Connect}>
              <Elevator_Error_Connect devId={dev_id} />
            </div>
            <div className={styles.Elevator_Log}>
              <Elevator_Log devId={dev_id} />
            </div>
          </Col>
        </Row>
      );
    }

    return (
      <Provider
        sharedData={sharedData}
        sharedDataDetail={sharedDataDetail}
        messageManager={messageManager}
      >
        <div>
          {charts}
          <ElevatorInTimeIFrame />
        </div>
      </Provider>
    );
  }
}
