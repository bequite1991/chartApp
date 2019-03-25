import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './errorMonthChart.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import {inject, observer} from 'mobx-react';
import {debug} from 'util';

const uuid = require ('node-uuid');

import QueryString from 'query-string';

@inject ('sharedData', 'messageManager')
@observer
export default class SystemCountChart extends React.Component {
  uuid = '';
  constructor (props) {
    super (props);
    this.state = {};

    this.uuid = uuid.v1 ();
    const dev_id = QueryString.parse (window.location.search).dev_id || '';
    const {messageManager} = this.props;
    messageManager.emit ('register', {
      uuid: this.uuid,
      cmd: '9007',
      filter: dev_id,
    });
  }

  componentWillUnmount () {
    const {messageManager} = this.props;
    messageManager.emit ('unregister', {uuid: this.uuid, cmd: '9007'});
  }

  onChartClick (param, echarts) {
    console.log (param);
  }

  render () {
    let onEvents = {
      click: this.onChartClick.bind (this),
    };

    const {sharedData} = this.props;
    const option = sharedData.elevatorConnectOption;
    return (
      <div className={styles.control}>
        <div className={styles.button}>
          <Icon type="phone" className={styles.icon} /><span>通话</span>
        </div>
        <div className={styles.button}>
          <Icon type="dashboard" className={styles.icon} /><span>监视</span>
        </div>
      </div>
    );
  }
}
