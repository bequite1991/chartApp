import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './elevatorLog.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import { inject, observer } from 'mobx-react';
import { debug } from 'util';

import QueryString from 'query-string';

const uuid = require('node-uuid');

@inject('sharedData', 'messageManager')
@observer
export default class ElevatorLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.uuid = uuid.v1();
    const dev_id = QueryString.parse(window.location.search).dev_id || '';
    const { messageManager } = this.props;
    messageManager.emit('register', {
      uuid: this.uuid,
      cmd: '9002',
      filter: dev_id,
    });
    this.timer = null;
    this.intervaler = null;
  }
  componentWillUnmount() {
    const { messageManager } = this.props;
    messageManager.emit('unregister', { uuid: this.uuid, cmd: '9002' });
    this.uuid = '';
  }

  onChartClick(param, echarts) {
    console.log(param);
  }

  render() {
    let onEvents = { click: this.onChartClick.bind(this) };

    const { sharedData } = this.props;
    const elevatorLog = sharedData.elevatorLog;

    let arr = [];
    let list = elevatorLog ? elevatorLog : [];
    if (list) {
      list.forEach((ele, key) => {
        arr.push(
          <span key={key} className={styles.elevatorLogDetail}>
            {ele}
          </span>
        );
      });
    }

    const elevatorLogDetailContentRef = this.refs.elevatorLogDetailContent;
    if (elevatorLogDetailContentRef && list.length > 0) {
      debugger;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(() => {
        const arr1 = document.getElementById('arr1');
        const arr2 = document.getElementById('arr2');
        const elevatorLogDetailContent = document.getElementById('elevatorLogDetailContent');

        const height = arr1.clientHeight;
        if (height > 0) {
          elevatorLogDetailContent.style.height = height;
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
     * <span>电梯编号：{elevatorLog.dev_id}</span>
        <span>电梯名称：{elevatorLog.dev_cname}</span>
        <span>上线时间：{elevatorLog.on_time}</span>
        <span>下线时间：{elevatorLog.off_time}</span>
         <marquee loop="-1" direction="up" scrolldelay="100">
            {arr}
          </marquee>
     */
    return (
      <div className={styles.elevatorLog}>
        <span className={styles.title}>电梯上下线日志</span>
        <div className={styles.elevatorLogDetailContent0} id="elevatorLogDetailContent0">
          <div
            ref="elevatorLogDetailContent"
            className={styles.elevatorLogDetailContent}
            id="elevatorLogDetailContent"
          >
            <div id="arr1">{arr}</div>
            <div id="arr2">{arr}</div>
          </div>
        </div>
      </div>
    );
  }
}
