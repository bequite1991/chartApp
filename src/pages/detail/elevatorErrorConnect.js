import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './elevatorErrorConnect.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import router from 'umi/router';

import { inject, observer } from 'mobx-react';
import { debug } from 'util';

const uuid = require('node-uuid');

import QueryString from 'query-string';

@inject('sharedData', 'messageManager')
@observer
export default class ElevatorErrorConnect extends React.Component {
  uuid = '';
  isShowFrame = false;
  url = '';
  constructor(props) {
    super(props);
    this.state = {};

    this.uuid = uuid.v1();
    // const dev_id = QueryString.parse(window.location.search).dev_id || '';
    // const { messageManager } = this.props;
    // messageManager.emit('register', {
    //   uuid: this.uuid,
    //   cmd: '9007',
    //   filter: dev_id,
    // });
    // this.isShowFrame = false;
  }

  componentWillUnmount() {
    // const { messageManager } = this.props;
    // messageManager.emit('unregister', { uuid: this.uuid, cmd: '9007' });
    // this.uuid = '';
  }

  onChartClick(param, echarts) {
    const { sharedData } = this.props;
    const option = sharedData.elevatorConnectOption;
    //console.log (param);
    router.push(option.url);
  }

  handlePhone = () => {
    debugger;

    const { sharedData } = this.props;
    const option = sharedData.elevatorConnectOption;
    //router.push (option.url);
    this.url = option.url;
    if (this.url && this.url.length > 0) {
      const w = window.open('about:blank');
      w.location.href = this.url;
      // sharedData.emit('open_iframe', {
      //   url: this.url,
      //   open: true,
      // });
    }
  };

  handleVideo = () => {
    debugger;

    const { sharedData } = this.props;
    const option = sharedData.elevatorConnectOption;
    //router.push (option.url);
    this.url = option.url;
    if (this.url && this.url.length > 0) {
      const w = window.open('about:blank');
      w.location.href = this.url;

      // sharedData.emit('open_iframe', {
      //   url: this.url,
      //   open: true,
      // });
      // sharedData.elevatorInTimeIFrameOption = {
      //   url: this.url,
      //   open: true,
      // };
    }
  };

  render() {
    const { sharedData } = this.props;
    const option = sharedData.elevatorConnectOption;
    //router.push (option.url);
    let url = option.url;
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
