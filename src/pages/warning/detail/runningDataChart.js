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

const nodeUUID = require('node-uuid');

import eventProxy from '../../../lib/eventProxy';

import {
  Elevator_Running_Data_Chart_Options,
  Elevator_System_Count_Chart_Options,
  Elevator_Offline_Count_Every_Month_Chart_Option,
  Elevator_Map_China_Options,
  Elevator_Error_Every_Month_Chart_Options,
  Elevator_Error_Ratio_Chart_Options,
  Elevator_Maintenance_OrdersAndFinish_Chart_Options,
  Elevator_maintenance_Orders_Month_Chart_Options,
  Map_Info_Value,
} from '../../../datacenter/chartConfig';

@inject('warningManager')
@observer
export default class RunningDataChart extends React.Component {
  constructor(props) {
    super(props);
    //debugger;
    const { warningManager } = this.props;
    const uuid_ = nodeUUID.v1();
    const devId = warningManager.getCurrFiter() || '';
    this.setState({ devId: devId, uuid: uuid_ });

    warningManager.emit('register', {
      cmd: '9012',
      uuid: uuid_,
      filter: devId,
    });

    eventProxy.on('msg-9012-' + devId, msg => {
      //debugger;
      const { uuid, devId } = this.state;
      this.setState({ runningDataOption: msg.runningDataOption, devId: devId, uuid: uuid });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { warningManager } = this.props;
    const { uuid, devId } = this.state;
    warningManager.emit('unregister', { uuid: uuid, cmd: '9012' });
    eventProxy.off('msg-9012-' + devId);

    let uuid2 = nodeUUID.v1();
    let devId2 = warningManager.getCurrFiter() || '';
    this.setState({ devId: devId2, uuid: uuid2 });
    warningManager.emit('register', { cmd: '9012', uuid: uuid2, filter: devId2 });
    eventProxy.on('msg-9012-' + devId2, msg => {
      debugger;
      const { uuid, devId } = this.state;
      this.setState({ runningDataOption: msg.runningDataOption, devId: devId, uuid: uuid });
    });
  }

  componentWillUnmount() {
    const { warningManager } = this.props;
    const { uuid, devId } = this.state;
    warningManager.emit('unregister', { uuid: uuid, cmd: '9012' });
    eventProxy.off('msg-9012-' + devId);
  }

  onRunningDataOptionChange = () => {};

  onChartClick(param, echarts) {
    console.log(param);
  }

  render() {
    let onEvents = {
      click: this.onChartClick.bind(this),
    };

    const { runningDataOption } = this.state;

    let option = runningDataOption;
    if (option == null) {
      option = Elevator_Running_Data_Chart_Options;
    }

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
