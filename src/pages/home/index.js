import React, {PureComponent} from 'react';
import {inject, observer} from 'mobx-react';
import {Icon} from 'antd';
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
//
import Chart4 from './chart4';
import Chart5 from './chart5';
//首页全国地图
import Map from './map';
// import Map2 from './map2';

import {
  Elevator_Running_Data_Chart_Options,
  Elevator_System_Count_Chart_Options,
  Elevator_Running_Distance_Every_Month_Chart_Option,
} from '../../datacenter/chartConfig';

import mqttWorker from '../../stores/mqttWorker';

// @inject ('runningData')
// @observer
export default class Home extends PureComponent {
  init = false;
  constructor (props) {
    super (props);
    this.state = {};

    if (this.init == true) {
      return;
    }

    // let runningData2 = Elevator_Running_Data_Chart_Options;
    // let runningSumDay = '200';
    // runningData2.series.unshift (runningSumDay);

    // console.info ('runningData:' + runningData);

    let options = {
      ip: '121.43.165.110',
      port: 3994,
      userName: '15051841028',
      passWord: 'huibao1841028',
      clientName: 'JSClient-Demo-' + new Date ().toLocaleTimeString (),
      cleanSession: true,
      timeout: 30,
      keepAliveInterval: 30,
    };

    let subscribe = [
      '/inshn_dtimao/huibao/req/dev_info/' + options.userName,
      '/inshn_dtimao/huibao/req/month_dev_num' + options.userName,
    ];

    // mqttWorker.emit ('session:init', subscribe);
    // mqttWorker.emit ('session:connect', options);

    this.init = true;

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
    debugger;
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
    //const {collapsed, isMobile, logo} = this.props;
    return (
      <Provider sharedData={sharedData}>
        <div>
          <RunningDataChart />
          <SystemCountChart />
          <Elevator_Running_Distance_Every_Month_Chart
            options={Elevator_Running_Distance_Every_Month_Chart_Option}
          />
          <Map />
          <Elevator_Error_Every_Month_Chart />
          <Elevator_Error_Ratio_Chart />
          <Maintenance_Orders_And_Finish_Chart />
        </div>
      </Provider>
    );
  }
}
