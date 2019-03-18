import React, { Component } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import ReactEcharts from 'echarts-for-react';
import {inject, observer} from 'mobx-react';
require('echarts/map/js/china.js');


@inject ('sharedData')
@observer
export default class Map extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  };
  componentWillUnmount() {
  };
  randomData() {
    return Math.round(Math.random()*10000);
  };
  onChartClick(){
    debugger
  }
  onChartLegendselectchanged(){
    debugger
  }
  render() {
    const {sharedData} = this.props;
    const option = sharedData.mapChinaOptionValue;
    debugger
    let onEvents = {
        'click': this.onChartClick,
        'legendselectchanged': this.onChartLegendselectchanged
    };
    return (
      <div className='examples'>
        <div className='parent'>
          <ReactEcharts
            onEvents={onEvents}
            option={option}
            style={{height: '500px', width: '100%'}}
            className='react_for_echarts' />
        </div>
      </div>
    );
  };
}
