import React, {PureComponent} from 'react';
import {Icon,Modal} from 'antd';
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
    this.state = {
      open:props.sharedData.elevatorInTimeIFrameOption.open
    };
  }

  componentWillUnmount () {}
  componentWillUpdate(){
    // this.setState({ open:this.props.sharedData.elevatorInTimeIFrameOption.open});
    this.state.open = this.props.sharedData.elevatorInTimeIFrameOption.open;
  }

  setModal1Visible(modal1Visible) {
    debugger
    this.setState({ open:modal1Visible });
  }

  render () {
    const {sharedData} = this.props;
    const option = sharedData.elevatorInTimeIFrameOption;
    let url = option.url;
    let open = option.open;
    return (
      <Modal
          width="100%"
          style={{ top: 0,height:'100vh' }}
          title="通话监视"
          visible={this.state.open}
          onOk={() => this.setModal1Visible(false)}
          onCancel={() => this.setModal1Visible(false)}
        >
          <div style={{height:"78vh"}}>
          <iframe src={url} width="100%" height="100%" />
          </div>
        </Modal>
    )
  }
}
