import React, { PureComponent } from 'react';
import { Icon, Modal } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './elevatorInTimeIFrame.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import router from 'umi/router';

import { inject, observer } from 'mobx-react';
import { debug } from 'util';

const nodeUUID = require('node-uuid');

import QueryString from 'query-string';

import eventProxy from '../../../lib/eventProxy';

@inject('warningManager')
@observer
export default class elevatorInTimeIFrame extends React.Component {
  uuid = '';
  isShowFrame = false;
  url = '';
  constructor(props) {
    super(props);
    //debugger;
    const { warningManager } = this.props;
    const uuid_ = nodeUUID.v1();
    const devId = warningManager.getCurrFiter() || '';
    this.setState({
      elevatorInTimeIFrameOption: { open: false, url: '' },
      devId: devId,
      uuid: uuid_,
    });

    //warningManager.emit('register', { uuid: uuid_, cmd: '9001', filter: devId });

    eventProxy.on('msg-open-iframe-' + devId, msg => {
      debugger;
      const { uuid, devId } = this.state;
      this.setState({
        elevatorInTimeIFrameOption: msg.elevatorInTimeIFrameOption,
        devId: devId,
        uuid: uuid,
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { uuid, devId } = this.state;
    eventProxy.off('msg-open-iframe-' + devId);

    const { warningManager } = this.props;
    let uuid2 = nodeUUID.v1();
    let devId2 = warningManager.getCurrFiter() || '';
    this.setState({
      elevatorInTimeIFrameOption: { open: false, url: '' },
      devId: devId2,
      uuid: uuid2,
    });

    eventProxy.on('msg-open-iframe-' + devId2, msg => {
      debugger;
      const { uuid, devId } = this.state;
      this.setState({
        elevatorInTimeIFrameOption: msg.elevatorInTimeIFrameOption,
        devId: devId,
        uuid: uuid,
      });
    });
  }

  componentWillUnmount() {
    const { warningManager } = this.props;
    const { uuid, devId } = this.state;
    eventProxy.off('msg-open-iframe-' + devId);
    //warningManager.emit('unregister', { uuid: this.uuid, cmd: '9001' });
    //warningManager.emit('unregister', { uuid: this.uuid, cmd: '9004' });
  }

  componentWillUpdate() {
    // let warningManager = props.warningManager;
    // let elevatorInTimeIFrameOption = warningManager.elevatorInTimeIFrameOption;
    // let open = false;
    // if (elevatorInTimeIFrameOption) {
    //   open = elevatorInTimeIFrameOption.open;
    // }
    // this.state.open = open;
  }

  setModal1Visible(modal1Visible) {
    const { elevatorInTimeIFrameOption } = this.state;
    const { uuid, devId } = this.state;
    this.setState({
      elevatorInTimeIFrameOption: {
        url: elevatorInTimeIFrameOption.url,
        open: modal1Visible,
      },
      devId: devId,
      uuid: uuid,
    });
  }

  render() {
    const { elevatorInTimeIFrameOption } = this.state;
    debugger;
    const option = elevatorInTimeIFrameOption;
    let url = option ? option.url : '';
    let open = option ? option.open : false;

    return (
      <Modal
        width="100%"
        style={{ top: 0, height: '100vh' }}
        title="通话监视"
        visible={open}
        onOk={() => this.setModal1Visible(false)}
        onCancel={() => this.setModal1Visible(false)}
      >
        <div style={{ height: '78vh' }}>
          <iframe src={url} width="100%" height="100%" />
        </div>
      </Modal>
    );
  }
}
