import React, {PureComponent} from 'react';
import {inject, observer} from 'mobx-react';
import {Icon,Row, Col,Button, notification} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';

import {Provider} from 'mobx-react';

import sharedData from '../../stores/sharedData';

// 电梯运行数据(Elevator Running Data)
import RunningDataChart from './runningDataChart';
// 电梯系统安装数量(Elevator System Count)
import SystemCountChart from './systemCountChart';
// 每月电梯离线次数(Elevator Running Distance Every Month)
import Offline_Count_Every_Month_Chart from './offlineCountEveryMonthChart';
// 每月电梯故障数(Elevator Error Every Month)
import Elevator_Error_Every_Month_Chart from './errorMonthChart.js';
// 每月电梯故障比例(Elevator Error Ratio)
import Elevator_Error_Ratio_Chart from './errorRatioChart.js';
// 维保人员每月派单量和完成量(maintenance Orders And Finish)
import Maintenance_Orders_And_Finish_Chart
  from './maintenanceOrdersAndFinishChart.js';
// 维保人员每月派单量和完成量(maintenance Orders And Finish)
import Maintenance_Orders_Month_Chart from './maintenanceOrdersMonthChart.js';
//首页全国地图
import Map_China from './map';
//安装记录
import Installation_Record from './installationRecord.js';
//维保记录
import Maintenance_Record from './maintenanceRecord.js';

//维保记录
import Warning from '../warning';
import messageManager from '../../stores/messageManager';

// @inject ('runningData')
// @observer
export default class Home extends PureComponent {
  init = false;
  constructor (props) {
    super (props);
    this.state = {};

    setInterval (() => {
      
    }, 2000);
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

  // shouldComponentUpdate (nextProps, nextState) {
  //   if (this.props.option === nextProps.option) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
  //打开通知窗口

  render () {
    let charts;
    if (document.body.clientWidth < 1000) {
      charts = (
        <Row>
          <Col span={24}><Map_China /></Col>
          <Col span={24}>
            <div className={styles.RunningDataChart}>
              <RunningDataChart className={styles.RunningDataChart}/>
            </div>
            <div className={styles.chartContent}>
              <SystemCountChart className={styles.SystemCountChart}/>
            </div>
            <div className={styles.chartContent}>
              <Offline_Count_Every_Month_Chart className={styles.Offline_Count_Every_Month_Chart} />
            </div>
            <div className={styles.chartContent}><Installation_Record className={styles.Installation_Record}/></div>
          </Col>
          <Col span={24}>
            <div className={styles.chartContent}>
              <Elevator_Error_Every_Month_Chart className={styles.Elevator_Error_Every_Month_Chart}/>
            </div>
            <div className={styles.chartContent}>
              <Elevator_Error_Ratio_Chart className={styles.Elevator_Error_Ratio_Chart}/>
            </div>
            <div className={styles.chartContent}>
              <Maintenance_Orders_And_Finish_Chart className={styles.Maintenance_Orders_And_Finish_Chart}/>
            </div>
            <div className={styles.chartContent}><Maintenance_Record className={styles.Maintenance_Record}/></div>
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
            <div className={styles.SystemCountChart}>
              <SystemCountChart />
            </div>
            <div className={styles.Offline_Count_Every_Month_Chart}>
              <Offline_Count_Every_Month_Chart />
            </div>
            <div className={styles.Installation_Record}><Installation_Record /></div>
          </Col>
          <Col span={12}><Map_China /></Col>
          <Col span={6}>
            <div className={styles.Elevator_Error_Every_Month_Chart}>
              <Elevator_Error_Every_Month_Chart />
            </div>
            <div className={styles.Elevator_Error_Ratio_Chart}>
              <Elevator_Error_Ratio_Chart />
            </div>
            <div className={styles.Maintenance_Orders_And_Finish_Chart}>
              <Maintenance_Orders_And_Finish_Chart />
            </div>
            <div className={styles.Maintenance_Record}><Maintenance_Record /></div>
          </Col>
        </Row>
      );
    }

    return (
      <Provider sharedData={sharedData} messageManager={messageManager}>
        <div>
          {charts}
          <Warning />
        </div>
      </Provider>
    );
  }
}
