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
export default class OfflineCountEveryMonthChart extends React.Component {
  uuid = '';
  devIdlist = '-1';
  constructor(props) {
    super(props);
    this.state = {};

    const dev_id_list = QueryString.parse(window.location.search).dev_id_list || '';

    this.devIdlist = dev_id_list;

    const { messageManager } = this.props;

    if (this.uuid.length > 0) {
      messageManager.emit('unregister', {
        uuid: this.uuid,
        cmd: '9003',
      });
    }

    this.uuid = uuid.v1();

    messageManager.emit('register', {
      uuid: this.uuid,
      cmd: '9003',
      filter: dev_id_list,
    });
  }

  componentWillReceiveProps(nextProps) {
    const dev_id_list = QueryString.parse(window.location.search).dev_id_list || '';

    if (dev_id_list == this.devIdlist) {
      return;
    }

    this.devIdlist = dev_id_list;

    const { messageManager } = this.props;

    if (this.uuid.length > 0) {
      messageManager.emit('unregister', {
        uuid: this.uuid,
        cmd: '9003',
      });
    }

    this.uuid = uuid.v1();

    messageManager.emit('register', {
      uuid: this.uuid,
      cmd: '9003',
      filter: dev_id_list,
    });
  }

  componentWillUnmount() {
    const { messageManager } = this.props;
    messageManager.emit('unregister', {
      uuid: this.uuid,
      cmd: '9003',
    });
  }

  onChartClick(param, echarts) {
    console.log(param);
  }

  render() {
    let onEvents = {
      click: this.onChartClick.bind(this),
    };
    const { sharedData } = this.props;
    const option = sharedData.offlineCountOption;
    return (
      <ReactEcharts
        option={option}
        notMerge={true}
        lazyUpdate={true}
        onEvents={onEvents}
        style={{ width: '110%', height: '35vh', minHeight: '100px' }}
      />
    );
  }
}
