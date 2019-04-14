import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './elevatorErrorConnect.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import router from 'umi/router';

import classNames from 'classnames';

import eventProxy from '../../../lib/eventProxy';

import { inject, observer } from 'mobx-react';
import { debug } from 'util';

const nodeUUID = require('node-uuid');

import QueryString from 'query-string';

@inject('warningManager')
@observer
export default class ElevatorErrorConnect extends React.Component {
  uuid = '';
  isShowFrame = false;
  url = '';
  constructor(props) {
    super(props);
    //debugger;
    const { warningManager } = this.props;
    const uuid_ = nodeUUID.v1();
    const devId = warningManager.getCurrFiter() || '';
    this.state = { devId: devId, uuid: uuid_ };

    warningManager.emit('register', { uuid: uuid_, cmd: '9001', filter: devId });

    eventProxy.on('msg-9001-' + devId, msg => {
      debugger;
      const { uuid, devId } = this.state;
      this.setState({
        elevatorConnectOption: msg.elevatorConnectOption,
        devId: devId,
        uuid: uuid,
      });
    });

    this.isShowFrame = false;
  }

  componentWillReceiveProps(nextProps) {
    debugger;
    const { warningManager } = this.props;
    const { uuid, devId } = this.state;
    eventProxy.off('msg-9001-' + devId);

    let uuid2 = nodeUUID.v1();
    let devId2 = warningManager.getCurrFiter() || '';
    this.state = { devId: devId2, uuid: uuid2 };

    warningManager.emit('register', { uuid: uuid2, cmd: '9001', filter: devId2 });

    eventProxy.on('msg-9001-' + devId2, msg => {
      debugger;
      const { uuid, devId } = this.state;
      this.setState({
        elevatorConnectOption: msg.elevatorConnectOption,
        devId: devId,
        uuid: uuid,
      });
    });
  }

  componentWillUnmount() {
    const { warningManager } = this.props;
    const { uuid, devId } = this.state;
    warningManager.emit('unregister', { uuid: uuid, cmd: '9001' });
    eventProxy.off('msg-9001-' + devId);
  }

  onChartClick(param, echarts) {
    const { elevatorConnectOption } = this.state;
    const option = elevatorConnectOption;
    //console.log (param);
    if (option) {
      router.push(option.url);
    }
  }

  handlePhone = () => {
    debugger;
    const { warningManager } = this.props;
    const { elevatorConnectOption, devId } = this.state;
    const option = elevatorConnectOption;
    if (option) {
      debugger;
      let url = option.url;
      if (url && url.length > 0) {
        warningManager.emit('open_iframe', { devId: devId, url: url, open: true });
      }
    }
  };

  handleVideo = () => {
    debugger;
    const { warningManager } = this.props;
    const { elevatorConnectOption, devId } = this.state;
    const option = elevatorConnectOption;
    if (option) {
      debugger;
      let url = option.url;
      if (url && url.length > 0) {
        warningManager.emit('open_iframe', { devId: devId, url: url, open: true });
      }
    }
  };

  render() {
    const { elevatorConnectOption } = this.state;
    const option = elevatorConnectOption;
    let url = option ? (option.url ? option.url : '') : '';
    let active = false;
    if (url && url.length > 0) {
      active = true;
    }

    return (
      <div className={styles.control}>
        <div className={styles.button} onClick={this.handlePhone}>
          <Icon type="phone" className={active == true ? styles.icon_active : styles.icon} />
          <span>通话</span>
        </div>
        <div className={styles.button} onClick={this.handleVideo}>
          <Icon type="dashboard" className={active == true ? styles.icon_active : styles.icon} />
          <span>监视</span>
        </div>
      </div>
    );
  }
}
