import React from "react";

// import "antd/dist/antd.less";
// import "../../asset/style.less";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            client: undefined,
            connect: undefined,
            subscribe: undefined,
            unSubscribe: undefined,
            hasSubscribe: ["/inshn_dtimao/huibao/dev_info/15051841028"]
        };

        this.initSubscribe = this.initSubscribe.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.unSubscribe = this.unSubscribe.bind(this);
    }

    componentWillMount() {
        // const { setConnect, setMessage } = this.props;
        var setConnect = function(){}
        var setMessage = function(){}
        let i = 0;

        const client = new Paho.MQTT.Client('121.43.165.110', 3994, "JSClient-Demo-" + new Date().toLocaleTimeString());
        // const client = new Paho.MQTT.Client('iot.wokooyun.com', 8083, "JSClient-Demo-" + new Date().toLocaleTimeString());
        const connectOpt = {
            userName: '15051841028',
            password: 'huibao1841028',
            cleanSession: true,
            timeout: 30,
            keepAliveInterval: 30,
            onSuccess: () => {
                setConnect(true);
                this.initSubscribe();
                console.log("mqtt connect success");
            },
            onFailure: () => (setConnect(false), console.log("mqtt connect failure"))
        };

        client.onConnectionLost = () => {
            setConnect(true);
            client.connect(connectOpt);
            console.log("mqtt reConnect ...");
        };

        client.onMessageArrived = (message) => {
            message._index = ++i;
            setMessage(message);
        };

        client.connect(connectOpt);

        console.log("mqtt connect ...");

        this.setState({
            client
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.subscribe !== this.state.subscribe) {
            this.subscribe(nextProps.subscribe);
        }
        if (nextProps.unSubscribe !== this.state.unSubscribe) {
            this.unSubscribe(nextProps.unSubscribe);
        }
    }

    initSubscribe() {
        const {client, hasSubscribe} = this.state;
        if (!client.isConnected()) {
            return;
        }
        for (let i = 0, l = hasSubscribe.length; i < l; i++) {
            hasSubscribe[i] && client.subscribe(hasSubscribe[i]);
        }
    }

    subscribe(filter) {
        if(!filter) {
            return;
        }
        const {client, hasSubscribe} = this.state;
        client.isConnected() && client.subscribe(filter);
        hasSubscribe.push(filter);
        this.setState({
            subscribe: filter,
            hasSubscribe
        });
        console.log("mqtt subscribe", filter);
    }

    unSubscribe(filter) {
        const {client, hasSubscribe} = this.state;
        client.isConnected() && client.unsubscribe(filter);
        for (let i = 0, l = hasSubscribe.length; i < l; i++) {
            if (filter == hasSubscribe[i]) {
                hasSubscribe.splice(i, 1);
            }
        }
        this.setState({
            unSubscribe: filter,
            hasSubscribe
        });
        console.log("mqtt unsubscribe", filter);
    }

    render() {

        return (
            <div>
                { this.props.children }
            </div>
            );
    }
}

export default Main;