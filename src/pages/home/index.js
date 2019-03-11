import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import Chart1 from './chart1';
import Chart2 from './chart2';
import Chart3 from './chart3';
import Chart4 from './chart4';
import Chart5 from './chart5';
import Map from './map';


export default class GlobalHeader extends PureComponent {
  constructor (props) {
    super (props);
    this.state = {}
  }
  componentWillUnmount() {
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const { collapsed, isMobile, logo } = this.props;
    return (
      <div>
        <Chart1></Chart1>
        <Chart2></Chart2>
        <Chart3></Chart3>
        <Map></Map>
      </div>
    );
  }
}
