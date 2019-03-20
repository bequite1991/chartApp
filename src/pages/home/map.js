import React, { Component } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './map.less';
import ReactEcharts from 'echarts-for-react';
import {inject, observer} from 'mobx-react';
import router from 'umi/router';


require('echarts/map/js/china.js');


@inject ('sharedData')
@observer
export default class Map extends Component {
  constructor(props) {
    super(props);
    this.onEvents = {
        'click': this.onChartClick.bind(this),
        'legendselectchanged': this.onChartLegendselectchanged.bind(this)
    };
  }

  componentDidMount() {

  };
  componentWillUnmount() {
  };
  randomData() {
    return Math.round(Math.random()*10000);
  };
  onChartClick(val){
    const {sharedData} = this.props;
    sharedData.mapInfo = val.data;
    router.push('/info');
  }
  onChartLegendselectchanged(){
  }
  render() {
    const {sharedData} = this.props;
    const option = sharedData.mapChinaOption;

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
        <div className={styles.mapChina}>
            <p className={styles.title}>慧保电梯管理平台</p>
            <div className={styles.subtitle}><span className={styles.subtitleInfo}>电梯在线数量：<span className={styles.detail}>25213</span></span><span className={styles.subtitleInfo}>总安装数量：<span className={styles.detail}>41982</span></span></div>
            <ReactEcharts
                onEvents={this.onEvents}
                option={option}
                style={{height: '65vh', width: '100%'}}
                className='react_for_echarts' />
            <div>
                <p>维保人员：<span>在线</span></p>
                {peopleArr}
            </div>
        </div>
    );
  };
}
