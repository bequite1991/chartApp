import React, { PureComponent } from 'react';
import { Icon, List } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import QueryString from 'query-string';

const uuid = require('node-uuid');

import { inject, observer } from 'mobx-react';
import { debug } from 'util';

@inject('sharedData', 'messageManager')
@observer
export default class InstallationRecord extends React.Component {
  uuid = '';
  devIdlist = '-1';
  constructor(props) {
    super(props);
    this.state = {};

    const dev_id_list = QueryString.parse(window.location.search).dev_id_list || '';

    const { messageManager } = this.props;

    this.devIdlist = dev_id_list;

    this.uuid = uuid.v1();

    messageManager.emit('register', { uuid: this.uuid, cmd: '9013', filter: dev_id_list }); //filter: '2019-02',
  }

  componentWillReceiveProps(nextProps) {
    const dev_id_list = QueryString.parse(window.location.search).dev_id_list || '';

    if (dev_id_list == this.devIdlist) {
      return;
    }

    this.devIdlist = dev_id_list;

    const { messageManager } = this.props;

    if (this.uuid.length > 0) {
      messageManager.emit('unregister', { uuid: this.uuid, cmd: '9013' });
      this.uuid = '';
    }

    this.uuid = uuid.v1();

    messageManager.emit('register', { uuid: this.uuid, cmd: '9013', filter: dev_id_list }); //filter: '2019-02',
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
    const installRecordDatas = sharedData.installRecordData;
    let arr = [];
    if (sharedData.installRecordData) {
      sharedData.installRecordData.forEach((ele, key) => {
        arr.push(
          <span key={key} className={styles.installRecordDetail}>
            {ele}
          </span>
        );
      });
    }

    return (
      <div className={styles.installRecord}>
        <span className={styles.title}>小区安装记录</span>
        {arr}
      </div>
    );
  }
}
