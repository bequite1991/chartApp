import React, { Component } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './map.less';
import ReactEcharts from 'echarts-for-react';
import { inject, observer } from 'mobx-react';
import router from 'umi/router';
import mapStyle from './custom_map_config.js';

require('echarts/map/js/china.js');

import QueryString from 'query-string';

const uuid = require('node-uuid');

var opts = {
  width: 250, // 信息窗口宽度
  height: 150, // 信息窗口高度
  title: '信息窗口', // 信息窗口标题
  enableMessage: true, //设置允许信息窗发送短息
};

var data = [
  { mapy: '32.94584', mapx: '112.894350', time: '12:30' },
  { mapy: '33.34683', mapx: '112.694300', time: '11:30' },
  { mapy: '33.54702', mapx: '112.094380', time: '10:30' },
  { mapy: '33.148780', mapx: '116.494390', time: '13:30' },
];

@inject('sharedData', 'messageManager')
@observer
export default class Map extends Component {
  //let markers = [];
  uuid = '';
  isQuit = false;
  devIdlist = '-1';
  markerClusterer = null;

  constructor(props) {
    super(props);

    this.onEvents = {
      click: this.onChartClick.bind(this),
      legendselectchanged: this.onChartLegendselectchanged.bind(this),
    };

    const dev_id_list = QueryString.parse(window.location.search).dev_id_list || '';

    this.devIdlist = dev_id_list;

    const { messageManager, sharedData } = this.props;

    this.uuid = uuid.v1();

    messageManager.emit('register', {
      uuid: this.uuid,
      cmd: '9006',
      filter: dev_id_list,
    });

    messageManager.emit('register', {
      uuid: this.uuid,
      cmd: '9001',
      filter: dev_id_list,
    });

    messageManager.emit('register', {
      uuid: this.uuid,
      cmd: '9004',
      filter: dev_id_list,
    });
  }

  componentWillReceiveProps(nextProps) {
    const dev_id_list = QueryString.parse(window.location.search).dev_id_list || '';

    if (dev_id_list == this.devIdlist) {
      return;
    }

    // let mapDataString = localStorage.getItem('map_markers');
    // if (mapDataString.length > 0) {
    //   debugger;
    //   let mapData = JSON.parse(mapDataString);
    //   if (mapData && mapData.length > 0) {
    //     this.mapUpdate(mapData);
    //   }
    // }

    this.devIdlist = dev_id_list;

    const { messageManager, sharedData } = this.props;

    if (this.uuid.length > 0) {
      messageManager.emit('unregister', { uuid: this.uuid, cmd: '9006' });
      messageManager.emit('unregister', { uuid: this.uuid, cmd: '9001' });
      messageManager.emit('unregister', { uuid: this.uuid, cmd: '9004' });
      this.uuid = '';
    }

    this.uuid = uuid.v1();

    messageManager.emit('register', {
      uuid: this.uuid,
      cmd: '9006',
      filter: dev_id_list,
    });
    messageManager.emit('register', {
      uuid: this.uuid,
      cmd: '9001',
      filter: dev_id_list,
    });
    messageManager.emit('register', {
      uuid: this.uuid,
      cmd: '9004',
      filter: dev_id_list,
    });
  }

  componentDidMount() {
    const { sharedData } = this.props;

    this.initMap();

    sharedData.on('map_markers', mapData => {
      if (mapData && mapData.length > 0) {
        //debugger;
        this.mapUpdate(mapData);
      }
    });

    setTimeout(() => {
      let anchrBL = document.getElementsByClassName('anchorBL')[0];
      if (anchrBL) {
        anchrBL.innerHTML = '';
      }
      setTimeout(() => {
        let anchrBL2 = document.getElementsByClassName('anchorBL')[1];
        if (anchrBL2) {
          anchrBL2.innerHTML = '';
        }
        //document.getElementsByClassName('anchorBL')[1].innerHTML = '';
      }, 1500);
    }, 500);
  }

  componentWillUpdate(nextProps) {}
  componentWillUnmount() {
    const { messageManager, sharedData } = this.props;
    messageManager.emit('unregister', {
      uuid: this.uuid,
      cmd: '9006',
    });
    messageManager.emit('unregister', {
      uuid: this.uuid,
      cmd: '9001',
    });
    messageManager.emit('unregister', {
      uuid: this.uuid,
      cmd: '9004',
    });
    this.uuid = '';
    sharedData.emit('cancel_map_markers', {});
    this.isQuit = true;
  }

  randomData() {
    return Math.round(Math.random() * 10000);
  }

  onChartClick(val) {
    const { sharedData } = this.props;
    sharedData.mapInfo = val.data;
    router.push('/info');
  }
  onChartLegendselectchanged() {}

  //初始化百度地图
  initMap() {
    const t = this;
    // var BMap = window.BMap
    // var map = new BMap.Map("allmap"); // 创建Map实例
    // map.centerAndZoom(new BMap.Point(116.404, 39.915), 5); // 初始化地图,设    置中心点坐标和地图级别
    // map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
    // map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
    // map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

    // 百度地图API功能
    let map = new BMap.Map('allmap');
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 5);
    map.enableScrollWheelZoom();
    map.setMapStyle({
      style: 'midnight',
    });
    // var myIcon2 = new BMap.Icon ('tb1_0.png', new BMap.Size (30, 40));

    //添加聚合效果。
    //this.markerClusterer = new BMapLib.MarkerClusterer(this.map, { markers: [] });

    debugger;

    map.addEventListener('moveend', function(e) {
      console.info('moveend');
      t.updateMarkerClusterer();
    });

    map.addEventListener('zoomend', function(e) {
      console.info('zoomend');
      t.updateMarkerClusterer();
    });

    this.map = map;
  }

  updateMarkerClusterer() {
    if (this.markerClusterer) {
      this.markerClusterer.clearMarkers();
    }

    let mapDataString = localStorage.getItem('map_markers');
    if (mapDataString.length > 0) {
      let mapData = JSON.parse(mapDataString);
      if (mapData && mapData.length > 0) {
        this.mapUpdate(mapData);
      }
    }
  }

  mapUpdate(mapData = []) {
    //debugger;
    if (this.markerClusterer) {
      this.markerClusterer.clearMarkers();
    }

    var fineMarkers = new Array();
    var errorMarkers = new Array();
    var offlineMarkers = new Array();
    var markers = new Array();
    mapData.forEach((item, i) => {
      var iconImg;
      var iconPath = 'mapcorp_' + item.real_info + '.png';
      console.info('iconPath:' + iconPath);
      //if (item.real_info == '0') {
      iconImg = new BMap.Icon(iconPath, new BMap.Size(20, 40));
      //   // offlineMarkers.push (marker);
      // } else if (item.real_info == '1') {
      //   iconImg = new BMap.Icon('Info-Point-green.png', new BMap.Size(30, 30), {
      //     offset: new BMap.Size(10, 30),
      //     imageOffset: new BMap.Size(0, 0), // 设置图片偏移
      //   });
      //   // fineMarkers.push (marker);
      // } else {
      //   iconImg = new BMap.Icon('Info-Point-red.png', new BMap.Size(30, 30), {
      //     offset: new BMap.Size(10, 30),
      //     imageOffset: new BMap.Size(0, 0), // 设置图片偏移
      //   });
      //   // errorMarkers.push (marker);
      // }
      var point = new BMap.Point(item.longitude, item.latitude);
      var marker = new BMap.Marker(point, { icon: iconImg });
      var content = item.ara_addr_name;
      this.addClickHandler(item, marker); //添加点击事件
      marker.info = item;
      markers.push(marker);
    });

    this.markerClusterer = new BMapLib.MarkerClusterer(this.map, {
      markers: markers,
    });

    // this.addClickClusterer (fineMarkerClusterer);
    // this.addClickClusterer (errorMarkerClusterer);
    // this.addClickClusterer (offlineMarkerClusterer);
    this.addClickClusterer(this.markerClusterer);
    // markerClusterer._clusters[0]._clusterMarker._domElement.addEventListener ('click', function (e) {
    //   debugger
    // });

    setTimeout(() => {
      let anchrBL = document.getElementsByClassName('anchorBL')[0];
      if (anchrBL) {
        anchrBL.innerHTML = '';
      }
      setTimeout(() => {
        let anchrBL2 = document.getElementsByClassName('anchorBL')[1];
        if (anchrBL2) {
          anchrBL2.innerHTML = '';
        }
        //document.getElementsByClassName('anchorBL')[1].innerHTML = '';
      }, 1500);
    }, 500);
  }
  //聚合点点击
  addClickClusterer(markerClusterer) {
    const t = this;
    //debugger;
    if (markerClusterer._clusters.length) {
      markerClusterer._clusters.forEach((cluster, key) => {
        if (!cluster._clusterMarker._domElement) {
          return;
        } else {
          cluster._clusterMarker.onclick = function() {
            //debugger;
            t.goInfo(cluster, markerClusterer);
          };
          // ele._clusterMarker._domElement.addEventListener ('click', function (
          //   e
          // ) {
          //   debugger;
          //   t.goInfo (ele, markerClusterer, e);
          // });
        }
      });
    }
  }

  //单个电梯点击
  addClickHandler(content, marker) {
    const t = this;
    marker.addEventListener('click', function(e) {
      t.openInfo(content, e);
      t.goDetail(content, e);
    });
  }

  openInfo(content, e) {
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(JSON.stringify(content), opts); // 创建信息窗口对象
    this.map.openInfoWindow(infoWindow, point); //开启信息窗口
  }

  goInfo(cluster, markerClusterer) {
    const { sharedData } = this.props;
    let dev_id;
    const t = this;
    const ids = new Array();
    cluster._markers.forEach((mark, index) => {
      if (dev_id) {
        dev_id = dev_id + ',' + mark.info.dev_id;
      } else {
        dev_id = mark.info.dev_id;
      }
      ids.push(mark.info.dev_id);
    });

    if (ids.length > 0) {
      markerClusterer.clearMarkers();
      console.info('点击聚合点');
      const url = '/home?dev_id_list=' + dev_id;
      sharedData.devIdList = ids;
      //window.location.href = url;
      sharedData.maiUserInfo = [];
      router.push(url);
      let mapDataString = localStorage.getItem('map_markers');
      if (mapDataString.length > 0) {
        let mapData = JSON.parse(mapDataString);
        if (mapData && mapData.length > 0) {
          this.mapUpdate(mapData);
        }
      }
    }

    /**
    curCluster._markerClusterer._clusters.forEach ((item, key) => {
      marks = marks.concat (item._markers);
      debugger;
      if (key == curCluster._markerClusterer._clusters.length - 1) {
        const ids = new Array ();
        marks.forEach ((mark, index) => {
          if (dev_id) {
            dev_id = dev_id + ',' + mark.info.dev_id;
          } else {
            dev_id = mark.info.dev_id;
          }
          ids.push (mark.info.dev_id);
          if (index == marks.length - 1) {
            console.info ('点击聚合点');
            const url = '/home?dev_id_list=' + dev_id;
            sharedData.devIdList = ids;
            //window.location.href = url;
            sharedData.maiUserInfo = [];
            router.push (url);
            markerClusterer.clearMarkers ();
          }
        });
      }
    });
    **/
  }

  goDetail(content, e) {
    //debugger;
    const url = '/detail?dev_id=' + content.dev_id;
    router.push(url);
  }

  render() {
    const { sharedData } = this.props;
    // const option = sharedData.mapChinaOption;
    const totalInfo = sharedData.totalInfo;

    const total = totalInfo ? (totalInfo.total ? totalInfo.total : '0') : '0';
    const onLineTotal = totalInfo ? (totalInfo.onLineTotal ? totalInfo.onLineTotal : '0') : '0';

    const dev_id_list = QueryString.parse(window.location.search).dev_id_list || '';
    let maintenance;
    const peopleArr = [];
    let list = [];
    let title = '';
    if (dev_id_list && dev_id_list.length > 0) {
      list = sharedData.maintenanceInformation ? sharedData.maintenanceInformation : [];
      if (list) {
        list.forEach((ele, key) => {
          peopleArr.push(
            <span key={key} className={styles.peopleList}>
              {ele}
            </span>
          );
        });
      }
      title = '剩余维保时间';
    } else {
      list = sharedData.maiUserInfo ? sharedData.maiUserInfo : [];
      list.forEach((val, key) => {
        peopleArr.push(
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

      title = '维保人员信息'; //
    }
    return (
      <div className={styles.mapChina}>
        <p className={styles.title}>慧保电梯管理平台</p>
        <div className={styles.line} />
        <div className={styles.subtitle}>
          <span className={styles.subtitleInfo}>
            电梯在线数量：<span className={styles.detail}>{onLineTotal}</span>
          </span>
          <span className={styles.subtitleInfo}>
            总安装数量：<span className={styles.detail}>{total}</span>
          </span>
        </div>
        <div className={styles.allmap} id="allmap" />
        <div className={styles.peopleListContent}>
          <span className={styles.title}>{title}</span>
          <div className={styles.maintenanceInfomation}>
            <marquee loop="-1" direction="up" vspace="0" scrolldelay="100">
              {peopleArr}
            </marquee>
          </div>
        </div>
      </div>
    );
  }
}
