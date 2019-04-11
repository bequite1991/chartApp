import React, { PureComponent } from 'react';
import { Icon, List } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import { inject, observer } from 'mobx-react';
import { debug } from 'util';

@inject('sharedData')
@observer
export default class MaintenanceRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillUnmount() {}

  onChartClick(param, echarts) {
    console.log(param);
  }

  render() {
    let onEvents = {
      click: this.onChartClick.bind(this),
    };

    const { sharedData } = this.props;
    let arr = [];
    let list = sharedData.maintenanceRecordData ? sharedData.maintenanceRecordData : [];
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
