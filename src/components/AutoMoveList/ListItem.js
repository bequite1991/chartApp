import { Component } from 'react';
import styles from './index.less';

export default class ListItem extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.ensureVisible();
  }

  componentDidUpdate() {
    this.ensureVisible();
  }

  ensureVisible() {
    if (this.props.active) {
      this.props.scrollIntoView(React.findDOMNode(this));
    }
  }

  render() {
    const { item } = this.props;
    const itemValue = item.itemValue;
    const key = item.key;
    //debugger;
    console.info('key:' + key);
    return (
      <span key={key} className={styles.maintenanceRecordDetail}>
        {itemValue}
      </span>
    );
  }
}
