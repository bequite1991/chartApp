import React, {Component} from 'react';
import {Icon} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './map.less';
import ReactEcharts from 'echarts-for-react';
import {inject, observer} from 'mobx-react';
import router from 'umi/router';

import QueryString from 'query-string';

const uuid = require ('node-uuid');

require ('echarts/map/js/china.js');

var opts = {
  width: 250, // 信息窗口宽度
  height: 80, // 信息窗口高度
  title: '信息窗口', // 信息窗口标题
  enableMessage: true, //设置允许信息窗发送短息
};

var data = [
  {mapy: '32.94584', mapx: '112.894350', time: '12:30'},
  {id: '1', mapy: '33.34683', mapx: '112.694300', time: '11:30'},
  {mapy: '33.54702', mapx: '112.094380', time: '10:30'},
  {mapy: '33.148780', mapx: '116.494390', time: '13:30'},
];

@inject ('sharedData', 'messageManager')
@observer
export default class Map extends Component {
  uuid = '';
  constructor (props) {
    super (props);
    this.onEvents = {
      click: this.onChartClick.bind (this),
      legendselectchanged: this.onChartLegendselectchanged.bind (this),
    };

    const dev_id = QueryString.parse (window.location.search).dev_id || '';

    this.uuid = uuid.v1 ();
    const {messageManager} = this.props;
    messageManager.emit ('register', {
      uuid: this.uuid,
      cmd: '9006',
      filter: dev_id,
    });

    messageManager.emit ('register', {
      uuid: this.uuid,
      cmd: '9001',
      filter: dev_id,
    });
  }

  componentDidMount () {
    // this.initMap ();
  }
  componentWillUnmount () {
    const {messageManager} = this.props;
    messageManager.emit ('unregister', {uuid: this.uuid, cmd: '9006'});
    messageManager.emit ('unregister', {uuid: this.uuid, cmd: '9001'});
  }

  randomData () {
    return Math.round (Math.random () * 10000);
  }

  onChartClick (val) {
    const {sharedData} = this.props;
    sharedData.mapInfo = val.data;
    router.push ('/info');
  }
  onChartLegendselectchanged () {}

  //初始化百度地图
  initMap () {
    // var BMap = window.BMap
    // var map = new BMap.Map("allmap"); // 创建Map实例
    // map.centerAndZoom(new BMap.Point(116.404, 39.915), 5); // 初始化地图,设    置中心点坐标和地图级别
    // map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
    // map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
    // map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

    // 百度地图API功能
    var map = new BMap.Map ('allmap');
    map.centerAndZoom (new BMap.Point (116.404, 39.915), 4);
    map.enableScrollWheelZoom ();
    var myIcon2 = new BMap.Icon ('tb1_0.png', new BMap.Size (30, 40));

    var markers = new Array ();
    data.forEach ((item, i) => {
      var point = new BMap.Point (item.mapx, item.mapy);
      var marker = new BMap.Marker (point);
      var content = item.time;
      this.addClickHandler (content, marker); //添加点击事件

      markers.push (marker);
    });
    //添加聚合效果。
    var markerClusterer = new BMapLib.MarkerClusterer (map, {markers: markers});
    this.map = map;
  }

  addClickHandler (content, marker) {
    const t = this;
    marker.addEventListener ('click', function (e) {
      t.openInfo (content, e);
    });
  }

  openInfo (content, e) {
    var p = e.target;
    var point = new BMap.Point (p.getPosition ().lng, p.getPosition ().lat);
    var infoWindow = new BMap.InfoWindow (content, opts); // 创建信息窗口对象
    this.map.openInfoWindow (infoWindow, point); //开启信息窗口
  }

  render () {
    const {sharedData} = this.props;
    const option = sharedData.mapChinaOption;
    const totalInfo = sharedData.totalInfo;

    const total = totalInfo ? (totalInfo.total ? totalInfo.total : '0') : '0';
    const onLineTotal = totalInfo
      ? totalInfo.onLineTotal ? totalInfo.onLineTotal : '0'
      : '0';

    const arr = sharedData.maiUserInfo ? sharedData.maiUserInfo : [];
    const peopleArr = [];

    arr.forEach ((val, key) => {
      peopleArr.push (
        <span key={key} className={styles.peopleList}>
          姓名：
          <span>{val.name}</span>
          手机号：
          <span>{val.phone}</span>
          维保单位：
          <span>{val.corp}</span>
          维保区域：
          <span>{val.area}</span>
          目前位置：
          <span>{val.location}</span>
          维保时间：
          <span>{val.time}</span>
          维保人员：
          <span>{val.status == 0 ? '离线' : '在线'}</span>
        </span>
      );
    });

    return (
      <div className={styles.mapChina}>
        <p className={styles.title}>慧保电梯管理平台</p>
        <div className={styles.subtitle}>
          <span className={styles.subtitleInfo}>
            电梯在线数量：<span className={styles.detail}>{total}</span>
          </span>
          <span className={styles.subtitleInfo}>
            总安装数量：<span className={styles.detail}>{onLineTotal}</span>
          </span>
        </div>
        <div className={styles.elevator1}></div>
        <div className={styles.peopleListContent}>
          {peopleArr}
        </div>
      </div>
    );
  }
}
