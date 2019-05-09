import React, { PureComponent } from 'react';
import { Icon, List } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import { inject, observer } from 'mobx-react';
import { debug } from 'util';

import AutoMoveList from '../../components/AutoMoveList';

import CountPower from '../../components/CountPower';

@inject('sharedData')
@observer
export default class MaintenanceRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    let countPower = new CountPower();
  }
  componentWillUnmount() {}

  componentWillReceiveProps(nextProps) {
    const { sharedData } = this.props;
    sharedData.maintenanceRecordData = [];
  }

  onChartClick(param, echarts) {
    console.log(param);
  }

  render() {
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

    let arr2 = [];
    if (list) {
      list.forEach((ele, key) => {
        arr2.push({
          key: key,
          itemValue: ele,
        });
      });
    }
    /**
     *   <marquee loop="-1" direction="up" scrolldelay="100">
            {arr}
          </marquee>
     */
    //debugger;
    return (
      <div className={styles.maintenanceRecord}>
        <span className={styles.title}>电梯维保记录</span>
        <div className={styles.maintenanceRecordContent} id="chatListDOMParent">
          <AutoMoveList items={arr2} activeId="0" />
        </div>
      </div>
    );
  }
}
