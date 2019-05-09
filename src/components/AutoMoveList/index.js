import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Item from './ListItem';

import styles from './index.less';

export default class AutoListMove extends Component {
  constructor(props) {
    super(props);
    this.start = false;
  }

  onScrollHandle(event) {
    debugger;
    const clientHeight = event.target.clientHeight;
    const scrollHeight = event.target.scrollHeight;
    const scrollTop = event.target.scrollTop;
    const isBottom = clientHeight + scrollTop === scrollHeight;
    console.log('is bottom:' + isBottom);
  }

  componentDidMount() {
    debugger;
    // if (this.contentNode) {
    //   this.contentNode.addEventListener('scroll', this.onScrollHandle.bind(this));
    // }
  }

  top = () => {
    const obj = this.node; //document.getElementsByClassName('list-view')[0];
    const clientHeight = obj.clientHeight;
    const scrollHeight = obj.scrollHeight;
    const scrollTop = obj.scrollTop;
    const isBottom = clientHeight + scrollTop === scrollHeight;
    debugger;

    this.timer = setInterval(() => {
      //debugger;
      if (obj.scrollTop < clientHeight) {
        obj.scrollTop += 10;
      } else {
        clearInterval(this.timer);
      }
    }, 1);
  };

  doScrollBottom = () => {
    this.chatListDOM = this.refs.chatListDOM;
    if (this.chatListDOM) {
      this.setChatListScrollBottom();
      this.start = true;
    }
  };

  // 18939842953
  setChatListScrollBottom() {
    debugger;
    console.log(this.chatListDOM);
    var scrollTop = this.chatListDOM.scrollTop;
    var clientHeight = this.chatListDOM.scrollHeight;
    var tab = document.getElementById('chatListDOMParent');
    var tab1 = document.getElementById('demo1');
    var tab2 = document.getElementById('demo2');
    var offsetHeight = tab2.offsetTop;
    tab2.innerHTML = tab1.innerHTML;
    this.timer = setInterval(() => {
      //debugger;
      offsetHeight = tab2.offsetTop;
      scrollTop = tab.scrollTop;
      if (offsetHeight - scrollTop < 0) {
        debugger;
        scrollTop -= tab1.offsetTop;
        tab.scrollTo(0, scrollTop);
      } else {
        scrollTop++;
        tab.scrollTo(0, scrollTop);
      }
    }, 10);

    console.log(this.chatListDOM.scrollTop, this.chatListDOM.scrollHeight);
    // document.body.scrollTop = this.refs.chatList.scrollHeight;
    // console.log(this.refs.chatList, this.refs.chatList && this.refs.chatList.scrollTop, document.body.scrollTop)
  }

  setChatListScrollBottom2() {
    this.chatListDOM = this.refs.chatListDOM;
    if (!this.chatListDOM) {
      return;
    }

    var speed = 10; //控制速度
    var tab = document.getElementById('chatListDOMParent');
    var tab1 = document.getElementById('demo1');
    var tab2 = document.getElementById('demo2');
    var scrollTop = tab.scrollTop;
    debugger;
    tab2.innerHTML = tab1.innerHTML;
    function Marquee() {
      //debugger;
      if (tab2.offsetHeight - tab.scrollTop < 0) {
        debugger;
        //tab.scrollTop -= tab1.offsetHeight;
        //this.scrollTop -= tab1.offsetHeight;
        tab.scrollTo(0, -tab1.offsetHeight);
      } else {
        //debugger;
        //tab.scrollTop++;
        tab.scrollTo(0, scrollTop++);
      }
    }
    //定时器
    var MyMar = setInterval(Marquee, speed);
  }

  render() {
    const { items } = this.props;

    if (items.length > 0 && this.start == false) {
      debugger;
      this.doScrollBottom();
      //this.setChatListScrollBottom2();
      //this.start = true;
    }
    //debugger;
    return (
      <div ref="chatListDOM" id="indemo" className={styles.indemo}>
        <div id="demo1">{items.map(this.renderItem)}</div>
        <div id="demo2" />
      </div>
    );
  }

  renderItem(item) {
    // const { activeId } = this.props;
    // var active = item.id === activeId;
    var props = { key: item.id, item: item, active: 0 };
    // if (active) {
    //   props.ref = 'activeItem';
    // }
    return <Item {...props} />;
  }

  componentDidUpdate(prevProps) {
    // const { activeId } = this.props;
    // // only scroll into view if the active item changed last render
    // if (activeId !== prevProps.activeId) {
    //   this.ensureActiveItemVisible();
    // }
  }

  ensureActiveItemVisible() {
    // var itemComponent = this.refs.activeItem;
    // if (itemComponent) {
    //   var domNode = React.findDOMNode(itemComponent);
    //   this.scrollElementIntoViewIfNeeded(domNode);
    // }
  }

  scrollElementIntoViewIfNeeded(domNode) {
    var containerDomNode = React.findDOMNode(this);
    // Determine if `domNode` fully fits inside `containerDomNode`.
    // If not, set the container's scrollTop appropriately.
  }
}
