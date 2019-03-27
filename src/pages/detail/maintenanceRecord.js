import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import {inject, observer} from 'mobx-react';
import {debug} from 'util';

@inject ('sharedData')
@observer
export default class MaintenanceOrdersAndFinishChart extends React.Component {
  constructor (props) {
    super (props);
    this.state = {};
  }
  componentWillUnmount () {}

  onChartClick (param, echarts) {
    console.log (param);
  }

  render () {
    let onEvents = {
      click: this.onChartClick.bind (this),
    };
    const {sharedData} = this.props;
    const elevatorStatus = sharedData.elevatorStatus;
    const totalInfo = sharedData.totalInfo;

    const total = totalInfo ? (totalInfo.total ? totalInfo.total : '0') : '0';
    const onLineTotal = totalInfo
      ? totalInfo.onLineTotal ? totalInfo.onLineTotal : '0'
      : '0';

    const arr = sharedData.maiUserInfo ? sharedData.maiUserInfo : [];
    const peopleArr = [];

    arr.forEach ((val, key) => {
      peopleArr.push (
        <div key={key} className={styles.peopleList}>
          姓名：
          <span>{val.name}</span>
            手机号：
          <span>{val.phone}</span>
            维保单位：
          <span>{val.corp}</span>
            维保区域：
          <span>{val.area}</span>
            目前位置：
          <span>{val.location}</span>
            维保时间：
          <span>{val.time}</span>
            维保人员：
          <span>{val.status == 0 ? '离线' : '在线'}</span>
        </div>
      );
    });

    return (
      <div className={styles.maintenanceRecord}>
        <span className={styles.title}>维保历史记录</span>
        {peopleArr}
      </div>
    );
  }
}
