import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './errorMonthChart.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import {inject, observer} from 'mobx-react';
import {debug} from 'util';

@inject ('sharedData', 'messageManager')
@observer
export default class SystemCountChart extends React.Component {
  constructor (props) {
    super (props);
    this.state = {};
    const {messageManager} = this.props;
    messageManager.emit ('register', {cmd: '9007'});
  }

  componentWillUnmount () {
    const {messageManager} = this.props;
    messageManager.emit ('unregister', {cmd: '9007'});
  }

  onChartClick (param, echarts) {
    console.log (param);
  }

  render () {
    let onEvents = {
      click: this.onChartClick.bind (this),
    };

    const {sharedData} = this.props;
    const option = sharedData.elevatorErrorEveryMonthOption;
    return (
      <div className={styles.control}>
        <div className={styles.button}><Icon type="phone" className={styles.icon}/><span>通话</span></div>
        <div className={styles.button}><Icon type="dashboard" className={styles.icon}/><span>监视</span></div>
      </div>
    );
  }
}
