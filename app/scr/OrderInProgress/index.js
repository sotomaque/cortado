import React from 'react';
import { View, StyleSheet, Linking, ListView, Image, InteractionManager } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Container, Content, Body, ListItem, Text, CheckBox, Footer, FooterTab, Header, Icon } from 'native-base';
import MapView from 'react-native-maps'
import call from 'react-native-phone-call'
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-simple-modal';
import Geocoder from 'react-native-geocoder';
import Intercom from 'react-native-intercom';

import * as DataParser from '../../utils/DataParser';
import {Address, User, Order} from '../../beans';
import { Fonts, Metrics, Colors, Images } from '../../themes';
import { Button, DrawerLayoutMenu } from '../../components';
import { HttpClientHelper } from '../../libs';
import LeftMenu from '../LeftMenu';
import Configs from '../../configs';
import styles from './styles';


const args = {
    number: Configs.SupportNumber, // String value with the number to call
    prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call
}


class OrderInProgress extends React.Component {

    autoRequestLocation = null;

    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.initData();

        let lat = Configs.defaultLocation.lat;
        let lng = Configs.defaultLocation.lng;

        if (Address.latitude !=0 || Address.longitude != 0) {
            lat = Address.latitude;
            lng = Address.longitude;
        }
        this.state = {
            InProgress: true,
            Pickup: false,
            Cleaning: false,
            Delivery: false,
            loading: false,
            modal: false,
            dataSource: this.ds.cloneWithRows(this.data),
            latitude: lat,
            longitude: lng
        };

        this.renderRow = this.renderRow.bind(this);
    }

    initData() {
        this.data = [
            ['Order Confirmed', '', DataParser.getCurrentOrderStatus() >= Order.CONFIRMED, false],
            ['Pickup', Order.pickup_date_string, DataParser.getCurrentOrderStatus() >= Order.PICKUP, DataParser.getCurrentOrderStatus() == Order.PICKUP],
            ['Cleaning', '', DataParser.getCurrentOrderStatus() >= Order.CLEANING, DataParser.getCurrentOrderStatus() == Order.CLEANING],
            ['Delivery', Order.dropoff_date_string, DataParser.getCurrentOrderStatus() >= Order.DELIVERY, DataParser.getCurrentOrderStatus() == Order.DELIVERY]
        ]

        if (DataParser.getCurrentOrderStatus() >= Order.COMPLETE) {
            InteractionManager.runAfterInteractions(() => {
                Actions.orderRating({type: ActionConst.REPLACE});
            });
        }
    }

    componentDidMount() {
        this.updateOrderProgress();
        this.registerIntercom();
        this.requestLocation();
    }

    componentWillUnmount() {
        if (this.timer != null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    componentWillMount() {
        if (this.timer != null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.timer = setTimeout(()=>this.updateOrderProgress(), Configs.OrderUpdateTime);
    }

    async registerIntercom() {
        Intercom.registerIdentifiedUser({ email: "" + User.email }).then(() => {
            console.log('registerIdentifiedUser done');
        }).catch((err) => {
            console.log('registerIdentifiedUser ERROR', err);
        });
    }

    timer = null;

    updateOrderProgress() {
        HttpClientHelper.get('world', {}, (error, data) => {
            if (!error) {
                let current_order = data.current_order;
                if (current_order != null && current_order != undefined && current_order != '') {
                    DataParser.initCurrentOrder(current_order);
                }
                if (data.order_phase) {
                    DataParser.updateCurrentOrderStatus(data.order_phase);
                }
                this.initData();
                this.setState({dataSource: this.ds.cloneWithRows(this.data)});
            }
        });
        if (this.timer != null) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => this.updateOrderProgress(), Configs.OrderUpdateTime);
    }

    handleCancelPress() {
        this.setState({loading: true});
        HttpClientHelper.delete('order', null, (error, data) => {
            this.setState({loading: false});
            if (!error) {
                Actions.presentation({type:ActionConst.REPLACE});
            } else {
                Functions.showAlert('', error.error ? error.error : 'Cannot cancel the order');
            }
        });
    }

    getRegion() {
        return {
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.004,
            longitudeDelta: 0.004
        };
    }

    getAddress() {
        let address = Address.street;
        if (address != '' && address != undefined) {
            if (Address.zipcode != '' && Address.zipcode != undefined) {
                address = address + ", " + Address.zipcode;
            }
        } else {
            address = Address.zipcode;
        }
        return address;
    }

    requestLocation() {
        this.clearRequest();
        if (Address.street == '' && Address.zipcode == '') {
            return;
        }
        this.autoRequestLocation = setTimeout(() => {
            try {
                console.log('address', this.getAddress());
                Geocoder.geocodeAddress(this.getAddress()).then(res => {
                console.log(res);
                try {
                    let address = res[0];
                    let location = address.position;
                    this.setState({
                        latitude: location.lat,
                        longitude: location.lng,
                    });
                    this.animatedToRegion();
                } catch (e) {
                    console.log(e);
                }
            }).catch(err => console.log(err));
                this.clearRequest();
            } catch (e) {}
        }, 300);
    }

    clearRequest() {
        try {
            if (this.autoRequestLocation != null) {
                clearTimeout(this.autoRequestLocation);
                this.autoRequestLocation = null;
            }
        } catch (e) {
            console.log(e);
        }
    }

    animatedToNewRegion() {
        if (this.map!=undefined) {
            this.map.animateToRegion(this.getRegion());
        }
    }

    renderHeader() {
        let canNotCancel = DataParser.getCurrentOrderStatus() >= Order.PICKUP;
        return (
            <Header style={{
                backgroundColor: '#fff',
                height: Metrics.navBarHeight,
                paddingBottom: 3
            }}>
                <Button containerStyle={{width: 50, justifyContent: 'center', marginLeft: 5}} onPress={() => this.toggleMenu()}>
                    <Icon style={{color: '#565656'}} name='menu' />
                </Button>
                <Button containerStyle={{justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5}}>
                    <Text
                        style={{
                            marginTop: -5,
                            backgroundColor: 'transparent',
                            fontFamily: 'OpenSans',
                            fontSize: 13,
                            color: '#AAAAAA'
                        }}
                        note
                    >
                        Delivering to
                    </Text>
                    <Text style={{
                        color: '#111111',
                        fontSize: 16,
                        marginTop: -2,
                        backgroundColor: 'transparent',
                        fontFamily: 'OpenSans-SemiBold'
                    }}>
                        {DataParser.getAddress()}
                    </Text>
                </Button>
                <Button
                    disabled={canNotCancel}
                    containerStyle={{width: 50, justifyContent: 'center', alignItems: 'flex-end', marginRight: 5}}
                    onPress={() => this.setState({modal: true})}
                >
                    <Text style={{
                        fontFamily: 'OpenSans-SemiBold',
                        color: canNotCancel ? '#DDDDDE' : '#444444',
                        fontSize: 14
                    }}>
                        Cancel
                    </Text>
                </Button>
            </Header>
        );
    }

    renderFooter() {
        return (
            <Footer style={{backgroundColor: '#ffffff', height: Metrics.navBarHeight}}>
                <Button
                    containerStyle={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    text="Chat Support"
                    textStyle={styles.bottomButtonText}
                    onPress={() => {
                        GLOBAL.requestAnimationFrame(() => {
                        Intercom.displayMessageComposer();
                    });
                }}/>
                <View style={{
                    width: 1,
                    height: Metrics.navBarHeight,
                    backgroundColor: '#f2f2f2'
                }}/>
                <Button
                    containerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                    textStyle={styles.bottomButtonText}
                    text="Phone Support"
                    onPress={() => call(args).catch(console.error)}
                />
            </Footer>
        );
    }

    renderModal() {
        return (
            <Modal
                offset={this.state.offset}
                open={this.state.modal}
                modalDidOpen={() => console.log('modal did open')}
                modalDidClose={() => this.setState({modal: false})}
                style={{alignItems: 'center'}}
            >
                <View>
                    <Text style={{fontFamily: 'OpenSans', fontSize: 20, marginBottom: 10, alignSelf: 'center'}}>Cancel Order?</Text>
                    <Text style={{alignSelf: 'center', textAlign: 'center', fontSize: 16, color: '#565656', fontFamily: 'OpenSans'}}>{`Are you sure you want to\ncancel current order?`}</Text>
                    <Button
                        containerStyle={{backgroundColor: '#4b3486', padding: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20}}
                        textStyle={{color: '#ffffff', fontFamily: 'OpenSans'}}
                        onPress={() => {
                            this.setState({modal: false});
                            this.handleCancelPress();
                        }}
                        text="CANCEL ORDER"
                    />
                    <Button
                        containerStyle={{marginTop: 5, backgroundColor: '#4b3486', padding: 10, justifyContent: 'center', alignItems: 'center'}}
                        textStyle={{color: '#ffffff', fontFamily: 'OpenSans'}}
                        onPress={() => this.setState({modal: false})}
                        text="OK"
                    />
                </View>
            </Modal>
        );
    }

    renderRow(rowData, sectionID, rowID, highlightRow) {
        const total = this.state.dataSource.getRowCount();

        var dotStyle = styles.dot;
        if (rowData[2]) {
            dotStyle = styles.dotComplete;
        }
        if (rowData[3]) {
            dotStyle = styles.dotInProgress;
        }

        return (
            <View style={styles.row}>
                <View style={styles.timeline}>
                    <View style={styles.line}>
                        <View style={rowID == 0 ? [styles.topLine, styles.hiddenLine] : styles.topLine} />
                        <View style={rowID == total - 1 ? [styles.bottomLine, styles.hiddenLine] : styles.bottomLine} />
                    </View>
                    <View style={dotStyle}>
                        {(rowData[2] && !rowData[3]) && <Image source={Images.check} style={{width: 10, height: 10, margin: 4, resizeMode: 'contain'}} />}
                    </View>
                </View>
                <View style={styles.content}>
                    <Text style={{
                        fontFamily: 'OpenSans-SemiBold',
                        fontSize: 16,
                        color: '#292929'
                    }}>{rowData[0]}</Text>
                    {rowData[1] != '' && <Text style={{
                        marginTop: 0,
                        fontFamily: 'OpenSans',
                        fontSize: 13
                    }} note>
                        {rowData[1]}
                    </Text>}
                </View>
            </View>
        );
    }

    renderRows() {
        return (
            <ListView 
                style={styles.listView}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                scrollEnabled={true}
            />
        )
    }

    renderMap() {
        return (
            <MapView
                ref={ref => { this.map = ref; }}
                style={styles.mapView}
                region={this.getRegion()}
            >
                <MapView.Marker
                    image={require('../../images/pin.png')}
                    coordinate={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                    }}
                />
            </MapView>
        );
    }

    toggleMenu() {
        this._drawer.toggle();
    }

    render () {
        let menu = <LeftMenu />
        let content = <Container style={{backgroundColor: '#fff'}}>
            {this.renderHeader()}
            <Content scrollEnabled={true}>
                {this.renderMap()}
                {this.renderRows()}
            </Content>
            {this.renderFooter()}
            {this.renderModal()}
            <Spinner visible={this.state.loading} />
        </Container>;

        return (
            <DrawerLayoutMenu
                menu={menu}
                menuPosition='left'
                ref={(ref) => this._drawer = ref}
                openMenuOffset={Metrics.screenWidth - 80}
            >
                {content}
            </DrawerLayoutMenu>
        );
    }
}

export default OrderInProgress;
