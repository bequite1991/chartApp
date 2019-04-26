import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import { inject, observer } from 'mobx-react';
import { debug } from 'util';

import QueryString from 'query-string';

const uuid = require('node-uuid');

@inject('sharedData', 'messageManager')
@observer
export default class RunningDataChart extends React.Component {
  flagReceive = false;
  uuid = '';
  constructor(props) {
    super(props);
    this.state = {};
    this.flagReceive = false;

    this.uuid = uuid.v1();
    const dev_id = QueryString.parse(window.location.search).dev_id || '';
    const { messageManager } = this.props;
    messageManager.emit('register', {
      cmd: '9012',
      uuid: this.uuid,
      filter: dev_id,
    });
  }

  componentWillUnmount() {
    const { messageManager } = this.props;
    messageManager.emit('unregister', { uuid: this.uuid, cmd: '9012' });
  }

  onRunningDataOptionChange = () => {};

  onChartClick(param, echarts) {
    console.log(param);
  }

  render() {
    let onEvents = {
      click: this.onChartClick.bind(this),
    };
    const { sharedData } = this.props;
    const option = sharedData.runningDataOption;
    return (
      <ReactEcharts
        option={option}
        notMerge={true}
        lazyUpdate={true}
        onEvents={onEvents}
        style={{ width: '100%', height: '25vh', minHeight: '100px' }}
      />
    );
  }
}
