import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

export default class GlobalHeader extends PureComponent {
  constructor (props) {
    super (props);
    this.state = {};
  }
  componentWillUnmount () {}
  /* eslint-disable*/
  // @Debounce(600)
  getOption () {
    const option = {
      title: {
        text: '电梯系统安装数量',
        subtext: '纯属虚构',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['总数'],
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
          type: 'category',
          data: ['2014年', '2015年', '2016年', '2017年', '2018年'],
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: '总数',
          type: 'bar',
          data: [1000, 1500, 2000, 2500, 3000],
          markPoint: {
            data: [{type: 'max', name: '最大值'}, {type: 'min', name: '最小值'}],
          },
          markLine: {
            data: [{type: 'average', name: '平均值'}],
          },
        },
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
    return (
      <ReactEcharts
        option={this.getOption ()}
        notMerge={true}
        lazyUpdate={true}
        onEvents={onEvents}
        style={{width: '600px', height: '200px'}}
      />
    );
  }
}
