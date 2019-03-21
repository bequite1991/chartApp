import React, {PureComponent} from 'react';
import {inject, observer} from 'mobx-react';
import {Icon,Row, Col} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';

import {Provider} from 'mobx-react';

import sharedData from '../../stores/sharedData';

// 电梯运行数据(Elevator Running Data)
import RunningDataChart from './runningDataChart';
// 电梯系统安装数量(Elevator System Count)
import SystemCountChart from './systemCountChart';
// 每月电梯运行距离(Elevator Running Distance Every Month)
import Elevator_Running_Distance_Every_Month_Chart from './chart3';
// 每月电梯故障数(Elevator Error Every Month)
import Elevator_Error_Every_Month_Chart from './errorMonthChart.js';
// 每月电梯故障比例(Elevator Error Ratio)
import Elevator_Error_Ratio_Chart from './errorRatioChart.js';
// 维保人员每月派单量和完成量(maintenance Orders And Finish)
import Maintenance_Orders_And_Finish_Chart from './maintenanceOrdersAndFinishChart.js';
// 维保人员每月派单量和完成量(maintenance Orders And Finish)
import Maintenance_Orders_Month_Chart from './maintenanceOrdersMonthChart.js';
//首页全国地图
import Map_China from './map';
//安装记录
import Installation_Record from './installationRecord.js';
//维保记录
import Maintenance_Record from './maintenanceRecord.js';

import {
  Elevator_Running_Data_Chart_Options,
  Elevator_System_Count_Chart_Options,
  Elevator_Running_Distance_Every_Month_Chart_Option,
} from '../../datacenter/chartConfig';

import messageManager from '../../stores/messageManager';

// @inject ('runningData')
// @observer
export default class Home extends PureComponent {
  init = false;
  constructor (props) {
    super (props);
    this.state = {};

    // setInterval (() => {
    //   //cleanup();
    //   let runningData = this.props.runningData;
    //   //debugger;
    //   runningData.runningDataOption = Math.ceil (Math.random () * 100) + '';
    // }, 5000);
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

  render () {


    let charts;
    if(document.body.clientWidth < 1000){
      charts = (<Row>
          <Col span={24}><Map_China /></Col>
          <Col span={24}>
            <div className={styles.chartContent}>
              <RunningDataChart />
            </div>
            <div className={styles.chartContent}>
              <SystemCountChart />
            </div>
            <div className={styles.chartContent}>
              <Elevator_Running_Distance_Every_Month_Chart
              options={Elevator_Running_Distance_Every_Month_Chart_Option}
            />
            </div>
            <div className={styles.chartContent}><Installation_Record /></div>
          </Col>
          <Col span={24}>
            <div className={styles.chartContent}>
              <Elevator_Error_Every_Month_Chart />
            </div>
            <div className={styles.chartContent}>
              <Elevator_Error_Ratio_Chart />
            </div>
            <div className={styles.chartContent}>
                <Maintenance_Orders_And_Finish_Chart />
            </div>
            <div className={styles.chartContent}><Maintenance_Record /></div>
          </Col>
        </Row>)
      }else{
        charts = (<Row>
          <Col span={6}>
            <div className={styles.chartContent}>
              <RunningDataChart />
            </div>
            <div className={styles.chartContent}>
              <SystemCountChart />
            </div>
            <div className={styles.chartContent}>
              <Elevator_Running_Distance_Every_Month_Chart
              options={Elevator_Running_Distance_Every_Month_Chart_Option}
            />
            </div>
            <div className={styles.chartContent}><Installation_Record /></div>
          </Col>
          <Col span={12}><Map_China /></Col>
          <Col span={6}>
            <div className={styles.chartContent}>
              <Elevator_Error_Every_Month_Chart />
            </div>
            <div className={styles.chartContent}>
              <Elevator_Error_Ratio_Chart />
            </div>
            <div className={styles.chartContent}>
                <Maintenance_Orders_And_Finish_Chart />
            </div>
            <div className={styles.chartContent}><Maintenance_Record /></div>
          </Col>
        </Row>)
      }

    return (
      <Provider sharedData={sharedData} messageManager={messageManager}>
        {charts}
      </Provider>
    );
  }
}
