import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import {inject, observer} from 'mobx-react';
import {debug} from 'util';

@inject ('sharedData', 'messageManager')
@observer
export default class RunningDataChart extends React.Component {
  flagReceive = false;
  constructor (props) {
    super (props);
    this.state = {};
    this.flagReceive = false;
    const {messageManager} = this.props;
    // messageManager.emit ('register', {cmd: '9001'});
    // messageManager.emit ('register', {cmd: '9002'});
    // messageManager.emit ('register', {cmd: '9003'});
    // messageManager.emit ('register', {cmd: '9004'});
    //messageManager.emit ('register', {cmd: '9006'});
    // messageManager.emit ('register', {cmd: '9007'});
    messageManager.emit ('register', {cmd: '9009', filter: '2019-02'});
    messageManager.emit ('register', {cmd: '9010'});
    //messageManager.emit ('register', {cmd: '9011'});
    messageManager.emit ('register', {cmd: '9012'});
  }

  componentWillUnmount () {
    const {messageManager} = this.props;
    messageManager.emit ('unregister', {cmd: '9012'});
  }

  onRunningDataOptionChange = () => {};

  onChartClick (param, echarts) {
    console.log (param);
  }

  render () {
    let onEvents = {
      click: this.onChartClick.bind (this),
    };
    const {sharedData} = this.props;
    const option = sharedData.runningDataOption;
    return (
      <ReactEcharts
        option={option}
        notMerge={true}
        lazyUpdate={true}
        onEvents={onEvents}
        style={{width: '100%', height: '20vh', minHeight: '100px'}}
      />
    );
  }
}
