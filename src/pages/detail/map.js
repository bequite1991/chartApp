import React, { Component } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './map.less';
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
    let onEvents = {
        'click': this.onChartClick,
        'legendselectchanged': this.onChartLegendselectchanged
    };

    const arr = [
        {name:"维保一",phone:"1777777777",area:"上海市晒暖干海带额",location:"上海市晒暖干海"},
        {name:"维保一",phone:"1777777777",area:"上海市晒暖干海带额",location:"上海市晒暖干海"},
        {name:"维保一",phone:"1777777777",area:"上海市晒暖干海带额",location:"上海市晒暖干海"},
        {name:"维保一",phone:"1777777777",area:"上海市晒暖干海带额",location:"上海市晒暖干海"}
    ];
    const peopleArr = [];

    arr.forEach((val,key)=>{
        peopleArr.push(<p key={key}>姓名：<span>{val.name}</span>手机号：<span>{val.phone}</span>维保区域：<span>{val.area}</span>目前位置：<span>{val.location}</span></p>);
    });
    return (
        <div className='map-china'>
            <p className="title">慧保电梯管理平台</p>
            <div className="subtitle"><span>电梯在线数量：</span><span className="detail">25213</span><span>总安装数量：</span><span className="detail">41982</span></div>
            <ReactEcharts
                onEvents={onEvents}
                option={option}
                style={{height: '70vh', width: '100%'}}
                className='react_for_echarts' />
            <div>
                <p>维保人员：<span>在线</span></p>
                {peopleArr}
            </div>
        </div>
    );
  };
}