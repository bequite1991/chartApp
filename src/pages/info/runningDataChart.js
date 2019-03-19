import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import {inject, observer} from 'mobx-react';
import {debug} from 'util';

@inject ('sharedDataInfo')
@observer
export default class RunningDataChart extends React.Component {
  constructor (props) {
    super (props);
    this.state = {};

    // setInterval (() => {
    //   const {sharedDataInfo} = this.props;
    //   //debugger;
    //   sharedDataInfo.runningDataOption = Math.ceil (Math.random () * 100) + '';
    // }, 5000);
  }
  componentWillUnmount () {}

  onChartClick (param, echarts) {
    console.log (param);
  }

  render () {
    let onEvents = {
      click: this.onChartClick.bind (this),
    };
    const {sharedDataInfo} = this.props;
    const option = sharedDataInfo.runningDataOption;
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
