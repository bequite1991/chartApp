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
        text: '每月电梯运行距离',
        subtext: '大数据',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['运行距离', '故障数'],
      },
      toolbox: {
        show: true,
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore: {show: true},
          saveAsImage: {show: true},
        },
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: [
            '2017-06',
            '2017-07',
            '2017-08',
            '2017-09',
            '2017-10',
            '2017-11',
            '2017-12',
            '2017-12',
            '2018-01',
            '2018-02',
            '2018-03',
            '2018-04',
            '2018-05',
            '2018-06',
            '2018-07',
          ],
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: '运行距离',
          type: 'line',
          smooth: true,
          itemStyle: {normal: {areaStyle: {type: 'default'}}},
          data: [
            1000,
            1200,
            1200,
            1100,
            1300,
            1500,
            1600,
            1800,
            1400,
            1200,
            1500,
            1200,
            1100,
            1300,
            1500,
          ],
        },
        {
          name: '故障数',
          type: 'line',
          smooth: true,
          itemStyle: {normal: {areaStyle: {type: 'default'}}},
          data: [1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0],
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

    let options = this.props.options;
    return (
      <ReactEcharts
        option={options}
        notMerge={true}
        lazyUpdate={true}
        onEvents={onEvents}
        style={{width: '100%', height: '20vh'}}
      />
    );
  }
}
