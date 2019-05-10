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
    this.timer = null;
    this.intervaler = null;
    //let countPower = new CountPower();
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

    const maintenanceRecordContentRef = this.refs.maintenanceRecordContent;
    if (maintenanceRecordContentRef && list.length > 0) {
      debugger;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(() => {
        const arr1 = document.getElementById('arrlist1');
        const arr2 = document.getElementById('arrlist2');
        const maintenanceRecordContent = document.getElementById('maintenanceRecordContent');

        const height = arr1.clientHeight;
        if (height > 0) {
          maintenanceRecordContent.style.height = height;
        }

        if (this.intervaler) {
          clearInterval(this.intervaler);
          this.intervaler = null;
        }

        let hide = 0;
        this.intervaler = setInterval(() => {
          if (-hide < height) {
            //debugger;
            hide = hide - 4;
            arr1.style.position = 'absolute';
            arr2.style.position = 'absolute';
            arr1.style.top = hide + 'px';
            arr2.style.top = height + hide + 'px';
          } else {
            hide = 0;
          }
        }, 200);
      }, 1000);
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
        <div className={styles.maintenanceRecordContent0} id="maintenanceRecordContent0">
          <div
            ref="maintenanceRecordContent"
            className={styles.maintenanceRecordContent}
            id="maintenanceRecordContent"
          >
            <div id="arrlist1">{arr}</div>
            <div id="arrlist2">{arr}</div>
          </div>
        </div>
      </div>
    );
  }
}
