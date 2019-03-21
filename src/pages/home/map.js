import React, { Component } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './map.less';
import ReactEcharts from 'echarts-for-react';
import {inject, observer} from 'mobx-react';
import router from 'umi/router';


require('echarts/map/js/china.js');


@inject ('sharedData','messageManager')
@observer
export default class Map extends Component {
  constructor(props) {
    super(props);
    this.onEvents = {
        'click': this.onChartClick.bind(this),
        'legendselectchanged': this.onChartLegendselectchanged.bind(this)
    };
  

     const {messageManager} = this.props;
    messageManager.emit ('register', {cmd: '9006'});
  }

  componentDidMount () {
    this.initMap();

  }
  componentWillUnmount () {
    const {messageManager} = this.props;
    messageManager.emit ('unregister', {cmd: '9006'});
  }

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
  initMap(){
    var BMap = window.BMap
    var map = new BMap.Map("allmap"); // 创建Map实例
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 5); // 初始化地图,设    置中心点坐标和地图级别
    map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
    map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
  }
  render() {
    const {sharedData} = this.props;
    const option = sharedData.mapChinaOption;
    const totalInfo = sharedData.totalInfo;

    const total = totalInfo ? (totalInfo.total ? totalInfo.total : '0') : '0';
    const onLineTotal = totalInfo
      ? totalInfo.onLineTotal ? totalInfo.onLineTotal : '0'
      : '0';

    const arr = [
        {name:"维保一",phone:"1777777777",area:"上海市晒暖干海带额",location:"上海市晒暖干海"},
        {name:"维保一",phone:"1777777777",area:"上海市晒暖干海带额",location:"上海市晒暖干海"},
        {name:"维保一",phone:"1777777777",area:"上海市晒暖干海带额",location:"上海市晒暖干海"},
        {name:"维保一",phone:"1777777777",area:"上海市晒暖干海带额",location:"上海市晒暖干海"}
    ];
    const peopleArr = [];

    arr.forEach((val,key)=>{
        peopleArr.push(<span key={key} className={styles.peopleList}>姓名：<span>{val.name}</span>手机号：<span>{val.phone}</span>维保区域：<span>{val.area}</span>目前位置：<span>{val.location}</span></span>);
    });
    return (
        <div className={styles.mapChina}>
            <p className={styles.title}>慧保电梯管理平台</p>
            <div className={styles.subtitle}>
            <span className={styles.subtitleInfo}>电梯在线数量：<span className={styles.detail}>{total}</span></span><span className={styles.subtitleInfo}>总安装数量：<span className={styles.detail}>{onLineTotal}</span></span></div>
            <ReactEcharts
                onEvents={this.onEvents}
                option={option}
                style={{height: '0vh', width: '100%'}}
                className='react_for_echarts' />
            <div className={styles.allmap} id="allmap"></div>
            <div className={styles.peopleListContent}>
                <p>维保人员：<span>在线</span></p>
                {peopleArr}
            </div>
            
        </div>
    );
  };
}
