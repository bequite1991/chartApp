import React, { PureComponent } from 'react';
import { inject, observer } from 'mobx-react';
import { Icon, Row, Col, Button, notification } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';

import { Provider } from 'mobx-react';

import sharedDataDetail from '../../stores/sharedDataDetail.js';
import sharedData from '../../stores/sharedData';

import router from 'umi/router';

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

//维保记录
import Warning from '../warning';

import ElevatorInTimeIFrame from './elevatorInTimeIFrame';
import messageManager from '../../stores/messageManager';

// @inject ('runningData')
// @observer
export default class Detail extends PureComponent {
  init = false;
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillUnmount() {}

  goBack() {
    window.location.href = '/home';
  }

  render() {
    let charts;
    if (document.body.clientWidth < 1000) {
      charts = (
        <Row>
          <Col span={24}>
            <Elevator_Status />
          </Col>
          <Col span={24}>
            <div className={styles.RunningDataChart}>
              <RunningDataChart className={styles.RunningDataChart} />
            </div>
            <div className={styles.elevatorContent}>
              <DynamicInfo className={styles.SystemCountChart} />
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.chartContent}>
              <Elevator_Error_Connect className={styles.Elevator_Error_Connect} />
            </div>
            <div className={styles.chartContent}>
              <Elevator_Log className={styles.Elevator_Log} />
            </div>
            <div className={styles.Back_Home2}>
              <Button block onClick={this.goBack}>
                回到首页
              </Button>
            </div>
          </Col>
        </Row>
      );
    } else {
      charts = (
        <Row>
          <Col span={6}>
            <div className={styles.RunningDataChart}>
              <RunningDataChart />
            </div>
            <div className={styles.elevatorContent2}>
              <DynamicInfo />
            </div>
          </Col>
          <Col span={12}>
            <Elevator_Status />
            <div className={styles.Maintenance_Record}>
              <Maintenance_Record />
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.Elevator_Error_Connect}>
              <Elevator_Error_Connect />
            </div>
            <div className={styles.Elevator_Log}>
              <Elevator_Log />
            </div>
            <div className={styles.Back_Home}>
              <Button block onClick={this.goBack}>
                回到首页
              </Button>
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
          <Warning />
          <ElevatorInTimeIFrame />
        </div>
      </Provider>
    );
  }
}
