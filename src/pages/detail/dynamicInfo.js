import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './systemCountChart.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import {inject, observer} from 'mobx-react';
import {debug} from 'util';

import QueryString from 'query-string';

const uuid = require ('node-uuid');

@inject ('sharedData', 'messageManager')
@observer
export default class DynamicInfo extends React.Component {
  uuid = '';
  constructor (props) {
    super (props);
    this.state = {};

    this.uuid = uuid.v1 ();
    const dev_id = QueryString.parse (window.location.search).dev_id || '';
    const {messageManager} = this.props;
    debugger;

    // messageManager.emit ('ws-unregister', {
    //   uuid: this.uuid,
    //   cmd: '1001',
    // });

    messageManager.emit ('ws-register', {
      uuid: this.uuid,
      cmd: '1001',
      filter: dev_id,
    });
  }

  componentWillUnmount () {
    const {messageManager} = this.props;
    messageManager.emit ('ws-unregister', {
      uuid: this.uuid,
      cmd: '1001',
    });
  }

  onChartClick (param, echarts) {
    console.log (param);
  }

  render () {
    let onEvents = {
      click: this.onChartClick.bind (this),
    };

    const {sharedData} = this.props;
    const option = sharedData.dynamicInfoOption;
    debugger;
    return (
      <div className={styles.elevatorStatus}>
        <span className={styles.title}>电梯动态信息</span>
        <span>运行状态：{option.status}</span>
        <span>楼层：{option.floors}</span>
        <span>电量：{option.energy}</span>
        <span>信号：{option.signal}</span>
      </div>
    );
  }
}
