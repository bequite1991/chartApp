import React, {PureComponent} from 'react';
import {Icon} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './elevatorInTimeIFrame.less';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import router from 'umi/router';

import {inject, observer} from 'mobx-react';
import {debug} from 'util';

const uuid = require ('node-uuid');

import QueryString from 'query-string';

@inject ('sharedData')
@observer
export default class elevatorInTimeIFrame extends React.Component {
  uuid = '';
  isShowFrame = false;
  url = '';
  constructor (props) {
    super (props);
    this.state = {};
  }

  componentWillUnmount () {}

  render () {
    const {sharedData} = this.props;
    const option = sharedData.elevatorInTimeIFrameOption;
    const url = option.url;
    const open = option.open;
    debugger;
    return open && open == true
      ? <div className={styles.iframe}>
          <iframe src={url} width="600px" height="400px" />
        </div>
      : <div className={styles.empty} />;
  }
}
