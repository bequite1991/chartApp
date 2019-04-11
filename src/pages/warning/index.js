import React, { PureComponent } from 'react';
import { inject, observer } from 'mobx-react';
import Debounce from 'lodash-decorators/debounce';
import { Icon, Row, Col, Button, notification, Modal } from 'antd';
import styles from './index.less';

import { Provider } from 'mobx-react';

import QueryString from 'query-string';

import sharedData from '../../stores/sharedData';
import messageManager from '../../stores/messageManager';

//电梯故障详情
import Detail_Index from './detail';

@inject('sharedData', 'messageManager')
@observer
export default class Warning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
    // const {sharedData} = this.props;
    // const warningMessage = sharedData.warningMessage;
    // if (sharedData.warningMessage) {
    //   this.openNotification(warningMessage)
    // }
    // this.openNotification();
  }

  componentWillUnmount() {}

  /* eslint-disable*/

  // shouldComponentUpdate (nextProps, nextState) {
  //   if (this.props.option === nextProps.option) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  // componentWillReceiveProps(nextProps) {
  //   const { sharedData } = nextProps;
  //   const warningMessage = sharedData.warningMessage;
  //   debugger;
  //   console.info('open: warningMessage:' + warningMessage.id);
  //   if (warningMessage && warningMessage.id > 0) {
  //     this.openNotification(warningMessage);
  //   }
  // }

  //打开通知窗口
  notificationClose(key, t) {
    console.log(
      'Notification was closed. Either the close button was clicked or duration time elapsed.'
    );
    notification.close(key);
  }

  //打开通知
  openNotification(warningMessage) {
    const t = this;
    const key = warningMessage.id; //`open${Date.now ()}`;
    const contents = (
      <div className={styles.notification}>
        <span className={styles.notificationInfo}>{warningMessage.message}</span>
        <Button
          className={styles.button}
          type="primary"
          size="small"
          onClick={() => {
            //t.cancel(key);
            t.notificationClose(key, t);
            t.setModalVisible(true);
          }}
        >
          故障处理
        </Button>
        <Button
          className={styles.button}
          type="default"
          size="small"
          onClick={() => {
            //t.cancel(key);
            t.notificationClose(key, t);
            //t.setModalVisible(true);
          }}
        >
          取消
        </Button>
      </div>
    );
    notification.open({
      duration: null,
      type: 'warning',
      message: '故障警报',
      description: contents,
      key,
      onClose: t.notificationClose(key, t),
      placement: 'bottomRight',
    });
  }

  cancel(key) {
    const { messageManager } = this.props;
    const params =
      QueryString.parse(window.location.search).dev_id ||
      QueryString.parse(window.location.search).dev_id_list ||
      '';
    messageManager.emit('send', {
      cmd: '9008',
      filter: params,
      id: key,
    });
  }

  //关闭弹窗
  setModalVisible(param) {
    this.setState({ modalVisible: param });
  }

  render() {
    const { modalVisible } = this.state;
    const { sharedData } = this.props;
    const warningMessage = sharedData.warningMessage;
    console.info('open: warningMessage:' + warningMessage.id);
    if (warningMessage && warningMessage.id > 0) {
      //debugger;
      this.openNotification(warningMessage);
    }

    return (
      <Modal
        width="60%"
        style={{ top: '5vh', height: '78vh' }}
        title="故障详情"
        visible={modalVisible}
        onOk={() => this.setModalVisible(false)}
        onCancel={() => this.setModalVisible(false)}
      >
        <div style={{ overflow: 'scroll', height: '68vh' }}>
          <Detail_Index className="styles.content" warningMessage={warningMessage} />
        </div>
      </Modal>
    );
  }
}
