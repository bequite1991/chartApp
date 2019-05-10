import React, { PureComponent } from 'react';
import { Icon, List } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import QueryString from 'query-string';

const uuid = require('node-uuid');

import { inject, observer } from 'mobx-react';
import { debug } from 'util';

@inject('sharedData', 'messageManager')
@observer
export default class InstallationRecordInformation extends React.Component {
  uuid = '';
  devIdlist = '-1';
  constructor(props) {
    super(props);
    this.state = {};
    this.timer = null;
    this.intervaler = null;
  }

  componentWillUnmount() {}

  onChartClick(param, echarts) {
    console.log(param);
  }

  render() {
    let onEvents = { click: this.onChartClick.bind(this) };

    const { sharedData } = this.props;
    let arr = [];
    let list = sharedData.installRecordInformation ? sharedData.installRecordInformation : [];
    if (list) {
      list.forEach((ele, key) => {
        arr.push(
          <span key={key} className={styles.installationRecordInformationDetail}>
            {ele}
          </span>
        );
      });
    }

    const installationRecordInformationContentRef = this.refs.installationRecordInformationContent;
    if (installationRecordInformationContentRef && list.length > 0) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(() => {
        const arr1 = document.getElementById('list1');
        const arr2 = document.getElementById('list2');
        const installationRecordInformationContent = document.getElementById(
          'installationRecordInformationContent'
        );

        const height = arr1.clientHeight;
        if (height > 0) {
          installationRecordInformationContent.style.height = height;
        }

        let hide = 0;
        if (this.intervaler) {
          clearInterval(this.intervaler);
          this.intervaler = null;
        }

        this.intervaler = setInterval(() => {
          if (-hide < height) {
            //debugger;
            hide = hide - 4;
            arr1.style.position = 'absolute';
            arr2.style.position = 'absolute';
            arr1.style.top = hide + 'px';
            arr2.style.top = height + hide + 'px';
          } else {
            hide = 0;
          }
        }, 200);
      }, 2000);
    }

    /**
     * <marquee loop="-1" direction="up" vspace="0" scrolldelay="100">
            {arr}
          </marquee>
     */
    return (
      <div className={styles.installationRecordInformation}>
        <span className={styles.title}>电梯安装记录</span>
        <div
          className={styles.installationRecordInformationContent0}
          id="installationRecordInformationContent0"
        >
          <div
            ref="installationRecordInformationContent"
            className={styles.installationRecordInformationContent}
            id="installationRecordInformationContent"
          >
            <div id="list1">{arr}</div>
            <div id="list2">{arr}</div>
          </div>
        </div>
      </div>
    );
  }
}
