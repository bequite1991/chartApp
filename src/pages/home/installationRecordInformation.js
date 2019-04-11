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
export default class InstallationRecordInformation extends React.Component {
  uuid = '';
  devIdlist = '-1';
  constructor(props) {
    super(props);
    this.state = {};
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
    let arr = [];
    let list = sharedData.installRecordInformation ? sharedData.installRecordInformation : [];
    if (list) {
      list.forEach((ele, key) => {
        arr.push(
          <span key={key} className={styles.installationRecordInformationDetail}>
            {ele}
          </span>
        );
      });
    }

    return (
      <div className={styles.installationRecordInformation}>
        <span className={styles.title}>电梯安装记录</span>
        <div className={styles.installationRecordInformationContent}>{arr}</div>
      </div>
    );
  }
}
