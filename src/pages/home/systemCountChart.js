import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import {inject, observer} from 'mobx-react';
import {debug} from 'util';

@inject ('sharedData','messageManager')
@observer
export default class SystemCountChart extends React.Component {
  constructor (props) {
    super (props);
    this.state = {};
    const {messageManager} = this.props;
    messageManager.emit("register",{cmd:"9001"})
  }

  componentWillUnmount () {
    const {messageManager} = this.props;
    messageManager.emit("unregister",{cmd:"9001"})
  }

  onChartClick (param, echarts) {
    console.log (param);
  }

  render () {
    let onEvents = {
      click: this.onChartClick.bind (this),
    };

    const {sharedData} = this.props;
    const option = sharedData.systemCountOption;
    return (
      <ReactEcharts
        option={option}
        notMerge={true}
        lazyUpdate={true}
        onEvents={onEvents}
        style={{width: '100%', height: '20vh'}}
      />
    );
  }
}
