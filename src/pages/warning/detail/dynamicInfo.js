import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './dynamicInfo.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import { inject, observer } from 'mobx-react';
import { debug } from 'util';

import QueryString from 'query-string';

const uuid = require('node-uuid');

@inject('sharedData', 'messageManager')
@observer
export default class DynamicInfo extends React.Component {
  uuid = '';
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
    const dev_id = this.props.devId || '';
    const { messageManager } = this.props;
    messageManager.emit('ws-register', {
      uuid: this.uuid,
      cmd: '1001',
      filter: dev_id,
    });
  }

  componentWillUnmount() {
    const { messageManager } = this.props;
    messageManager.emit('ws-unregister', {
      uuid: this.uuid,
      cmd: '1001',
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
    const option = sharedData.dynamicInfoOption;

    const regtelType = option.regtelType;
    let regtelTypeContent = '未知';
    switch (regtelType) {
      case 1:
        regtelTypeContent = '联通';
        break;
      case 2:
        regtelTypeContent = '移动';
        break;
      case 3:
        regtelTypeContent = '电信';
        break;
      default:
        regtelTypeContent = '未知';
        break;
    }

    return (
      <div className={styles.elevatorStatus}>
        <span className={styles.title}>电梯动态信息</span>
        <span>电梯编号：{option.elevatorCode}</span>
        <span>运行状态：{option.status}</span>
        <span>
          电梯门开启：
          {option.isDoorOpen ? (option.isDoorOpen == '1' ? '开启' : '关闭') : '未知'}
        </span>
        <span>总楼层数:{option.floorDisplaying}</span>
        <span>
          电梯是否有人:{option.isAnyone ? (option.isAnyone == '1' ? '有' : '无') : '未知'}
        </span>
        <span>当前楼层：{option.floors}</span>
        <span>电量：{option.energy}</span>
        <span>信号：{option.signal}</span>
        <span>手机号码运营商:{regtelTypeContent}</span>
      </div>
    );
  }
}
