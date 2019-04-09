import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import { inject, observer } from 'mobx-react';
import { debug } from 'util';

@inject('sharedData')
@observer
export default class InstallationRecord extends React.Component {
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
