import React, {PureComponent} from 'react';
import {inject, observer} from 'mobx-react';
import Debounce from 'lodash-decorators/debounce';
import {Icon,Row, Col,Button, notification,Modal} from 'antd';
import styles from './index.less';

import {Provider} from 'mobx-react';

import sharedData from '../../stores/sharedData';
import messageManager from '../../stores/messageManager';

//电梯故障详情
import Detail_Index from './detail';

@inject ('sharedData')
@observer
export default class Home extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      modalVisible:false
    };
    const {sharedData} = this.props;
    const warningMessage = sharedData.warningMessage;
    if (sharedData.warningMessage) {
      this.openNotification(warningMessage)
    }
    // this.openNotification();
  }

  componentWillUnmount () {}

  /* eslint-disable*/

  // shouldComponentUpdate (nextProps, nextState) {
  //   if (this.props.option === nextProps.option) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  componentWillReceiveProps(nextProps){
    const {sharedData} = nextProps;
    const warningMessage = sharedData.warningMessage;
    if (sharedData.warningMessage) {
      this.openNotification(warningMessage)
    }
  }
  //打开通知窗口
  notificationClose(key,t){
    console.log('Notification was closed. Either the close button was clicked or duration time elapsed.');
    notification.close(key);
  };
  //打开通知
  openNotification(warningMessage){
    const t = this;
    const key = `open${Date.now()}`;
    const contents = (
      <div className={styles.notification}>
        <span className={styles.notificationInfo}>{warningMessage.message}</span>
        <Button className={styles.button} type="primary" size="small" onClick={() => {t.notificationClose(key,t);t.setModalVisible(true);}}>
          故障处理
        </Button>
        <Button className={styles.button} type="default" size="small" onClick={() => {t.notificationClose(key,t);}}>
          取消
        </Button>
      </div>
    );
    notification.open({
      duration:null,
      type:"warning",
      message: '故障警报',
      description:contents,
      key,
      onClose: t.notificationClose(key,t),
      placement:"bottomRight"
    });
  };

  //关闭弹窗
  setModalVisible(param) {
    this.setState({modalVisible:param});
  }

  render () {
    const {modalVisible} = this.state;
    const {sharedData} = this.props;
    const warningMessage = sharedData.warningMessage;
    return (
      <Modal
        width="50%"
        title="故障详情"
        centered
        visible={modalVisible}
        onOk={() => this.setModalVisible(false)}
        onCancel={() => this.setModalVisible(false)}
      >
        <Detail_Index warningMessage={warningMessage}/>
      </Modal>
    );
  }
}
