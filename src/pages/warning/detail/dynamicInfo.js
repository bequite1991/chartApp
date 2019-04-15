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

import eventProxy from '../../../lib/eventProxy';

const nodeUUID = require('node-uuid');

@inject('warningManager')
@observer
export default class DynamicInfo extends React.Component {
  constructor(props) {
    super(props);
    //debugger;
    const { warningManager } = this.props;
    const uuid_ = nodeUUID.v1();
    const devId = warningManager.getCurrFiter() || '';
    this.state = {
      devId: devId,
      uuid: uuid_,
      option: {
        regtelType: -1,
        isDoorOpen: '0',
        elevatorCode: '',
        status: '',
        floorDisplaying: '',
        isAnyone: '-1',
        floors: 0,
        energy: '',
        signal: '',
      },
    };

    eventProxy.on('msg-1001-' + devId, msg => {
      const { uuid, devId } = this.state;
      this.setState({ option: msg.dynamicInfoOption, devId: devId, uuid: uuid });
    });

    if (warningManager) {
      warningManager.emit('ws-register', { uuid: uuid_, cmd: '1001', filter: devId });
    }
  }

  componentWillReceiveProps(nextProps) {
    debugger;
    const { devId, uuid } = this.state;
    eventProxy.off('msg-1001-' + devId);
    const { warningManager } = this.props;
    warningManager.emit('ws-unregister', { uuid: uuid, cmd: '1001' });

    let uuid2 = nodeUUID.v1();
    let devId2 = warningManager.getCurrFiter() || '';
    this.state = {
      devId: devId2,
      uuid: uuid2,
      option: {
        regtelType: -1,
        isDoorOpen: '0',
        elevatorCode: '',
        status: '',
        floorDisplaying: '',
        isAnyone: '-1',
        floors: 0,
        energy: '',
        signal: '',
      },
    };

    eventProxy.on('msg-1001-' + devId2, msg => {
      debugger;
      const { uuid, devId } = this.state;
      this.setState({ option: msg.dynamicInfoOption, devId: devId, uuid: uuid });
    });

    debugger;
    if (warningManager) {
      warningManager.emit('ws-register', { uuid: uuid2, cmd: '1001', filter: devId2 });
    }
  }

  componentWillUnmount() {
    const { devId, uuid } = this.state;
    eventProxy.off('msg-1001-' + devId);
    const { warningManager } = this.props;
    warningManager.emit('ws-unregister', { uuid: uuid, cmd: '1001' });
  }

  onChartClick(param, echarts) {
    console.log(param);
  }

  render() {
    let onEvents = { click: this.onChartClick.bind(this) };

    const { option } = this.state;
    //const option = option; //warningManager.dynamicInfoOption;
    if (!option) {
      return <div />;
    } else {
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
            电梯是否有人:
            {option.isAnyone ? (option.isAnyone == '1' ? '有' : '无') : '未知'}
          </span>
          <span>当前楼层：{option.floors}</span>
          <span>电量：{option.energy}</span>
          <span>信号：{option.signal}</span>
          <span>手机号码运营商:{regtelTypeContent}</span>
        </div>
      );
    }
  }
}
