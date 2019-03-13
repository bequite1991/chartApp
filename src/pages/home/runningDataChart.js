import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import {inject, observer} from 'mobx-react';
import {debug} from 'util';

@inject ('runningData')
@observer
export default class RunningDataChart extends React.Component {
  constructor (props) {
    super (props);
    this.state = {};

    // setInterval (() => {
    //   //cleanup();
    //   let runningData = this.props.runningData;
    //   //debugger;
    //   runningData.runningDataOption = Math.ceil (Math.random () * 100) + '';
    // }, 5000);
  }
  componentWillUnmount () {}
  /* eslint-disable*/
  // @Debounce(600)
  getOption () {
    const option = {
      title: {
        text: '电梯运行数据',
        subtext: '数据来自网络',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['2019年', '2012年'],
      },
      toolbox: {
        show: true,
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          magicType: {show: true, type: ['line', 'bar']},
          restore: {show: true},
          saveAsImage: {show: true},
        },
      },
      calculable: true,
      xAxis: [
        {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
      ],
      yAxis: [
        {
          type: 'category',
          data: ['自运行总天数（天）', '运行总距离（KM）', '运行总时长（小时）'],
        },
      ],
      series: [
        {
          name: '2019年',
          type: 'bar',
          data: [200, 1000, 800],
        },
        // {
        //     name:'2012年',
        //     type:'bar',
        //     data:[300, 1200, 900]
        // }
      ],
    };
    return option;
  }

  onChartClick (param, echarts) {
    console.log (param);
  }

  render () {
    let onEvents = {
      click: this.onChartClick.bind (this),
    };
    const {runningData} = this.props;
    const option = runningData.runningDataOption;
    return (
      <ReactEcharts
        option={option}
        notMerge={true}
        lazyUpdate={true}
        onEvents={onEvents}
        style={{width: '1200px', height: '200px'}}
      />
    );
  }
}
