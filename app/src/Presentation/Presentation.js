import React from 'react';
import { View, InteractionManager, StyleSheet, Image, Platform } from 'react-native';
import { Container, Content, ListItem, Text, Separator, CheckBox, Footer, FooterTab, Body, Input, Item, Button as MenuButton, Icon, Left, Right, Title, Header, Radio } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-simple-modal';
import Geocoder from 'react-native-geocoder';
import call from 'react-native-phone-call';

import * as DataParser from '../../utils/DataParser';
import * as Functions from '../../utils/Functions';
import Analytics from '../../utils/analytics';
import ChatSupport from '../../utils/chatSupport';
import { ORDER_PLACED } from '../../utils/analyticsEvents';
import { Button, Touchable, DrawerLayoutMenu, TimePicker } from '../../components';
import { Metrics, Images } from '../../themes'
import { Address, User } from '../../beans';
import { SessionManager, HttpClientHelper } from '../../libs';
import Configs from '../../configs';
import styles from './styles';
import Notes from './Notes';
import LeftMenu from '../LeftMenu';


export default class Presentation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            wf: false,
            dc: false,
            modal: false,
            pickup: null,
            dropoff: null,
            address: '',
            modal_title: '',
            modal_message: '',
            reload: false,
            availability: null,
            loading: false,
            showButtonCall: false,
            showIOSPicker: false,
        };
        this.services = '';
        this.handleOnPressPickUp = this.handleOnPressPickUp.bind(this);
        this.handleOnPressDropoff = this.handleOnPressDropoff.bind(this);
        this.handleOnPressWash = this.handleOnPressWash.bind(this);
        this.handleOnPressDryClean = this.handleOnPressDryClean.bind(this);
        this.handleOnPress = this.handleOnPress.bind(this);
    }

    getAddressString() {
        let address = this.state.street;
        if (address!='' && address != undefined) {
            if (this.state.zipcode != '' && this.state.zipcode!=undefined) {
                address = address + ", " + this.state.zipcode
            }
        } else {
            address = this.state.zipcode;
        }
        return address;
    }

    requestLocation() {
        if ((Address.street=='' && Address.zipcode=='') || Address.latitude!=0 || Address.longitude!=0) return;
        setTimeout(()=>{
            try {
                Geocoder.geocodeAddress(this.getAddressString()).then(res => {
                    try {
                        let address = res[0];
                        let location = address.position;
                        Address.latitude = location.lat;
                        Address.longitude = location.lng;
                    } catch (e) {
                            console.log(e);
                    }
                })
                .catch(err => console.log(err));
            } catch (e) { }
        }, 300);
    }

    componentDidMount() {
        this.getUserInfoFromPress();
        ChatSupport.identifyUser(User.email);
        this.requestLocation();
    }

    componentDidUnMount() {
        SessionManager.saveUserInfo();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.reload) {
            this.setState({
                reload: !this.state.reload
            })
            InteractionManager.runAfterInteractions(() => {
                this.getUserInfoFromPress();
                if (nextProps.address_changed && (this.state.wf || this.state.dc)) {
                    this.getAvailability();
                }
            });
        }
    }

    getUserInfoFromPress() {
        HttpClientHelper.get('me', null, (error, data)=>{
            if (!error) {
                // console.log(data);
                DataParser.initializeUser(data);
                console.log(DataParser.getUserInfo());
                let current_order = data.current_order;
                if (current_order != null && current_order != undefined && current_order != '') {
                    DataParser.initCurrentOrder(current_order);
                    InteractionManager.runAfterInteractions(() => {
                        Actions.orderInProgress({type: ActionConst.REPLACE})
                    });
                } else {
                    this.setState({reload: !this.state.reload});
                }
            }
        })
    }

    checkAddress() {
        if (DataParser.getAddress() === 'Set Address') {
            this.setState({
                modal: true,
                modal_message: 'Please set your address\nto continue.',
                modal_title: 'Set Address',
            })
            return false;
        }
        return true;
    }

    checkService() {
        if (!(this.state.wf || this.state.dc)) {
            this.setState({
                modal: true,
                modal_message: 'Please select at least one\nservice to continue.',
                modal_title: 'Select Services',
            })
            return false;
        }
        if (this.state.availability == null) {
            this.setState({loading: true});
            return false;
        }
        return true;
    }

    checkPickupTime() {
        if (!(this.state.pickup)) {
            this.setState({
                modal: true,
                modal_message: 'Please set a pickup time\nto continue.',
                modal_title: 'Set Pickup Time',
            })
            return false;
        }
        return true;
    }

    checkAvailability() {
        if ((!this.state.availability || this.state.availability.length == 2) && !this.state.loading) {
            this.setState({
                modal: true,
                showButtonCall: true,
                modal_message: 'All providers for the selected service are currently at maximum capacity. To schedule a pickup, call or message our customer success team.',
                modal_title: 'Increased Demand',
            })
            return false;
        }
        return true;
    }

    getTimeAstring(data, nodata) {
        if (data) {
            try {
                return data.date + ", " + data.time;
            } catch (e) {}
        }
        return nodata;
    }

    handleOnPressWash = () => {
        if (!this.checkAddress()) return;
        this.setState({
            wf: !(this.state.wf),
            dc: false,
            pickup: null,
            dropoff: null
        });
        this.getAvailability();
    }

    handleOnPressDryClean = () => {
        if (!this.checkAddress()) {
            return;
        };
        this.setState({
            dc: !(this.state.dc),
            wf: false,
            pickup: null,
            dropoff: null
        });
        this.getAvailability();
    }

    getAvailability() {
        this.setState({availability: null});
        InteractionManager.runAfterInteractions(() => {
            this.services = '';
            if (!this.state.wf && !this.state.dc) {
                return;
            } else {
                if (this.state.wf && this.state.dc) {
                    this.services = 'wnf,dc';
                } else if (this.state.wf) {
                    this.services = 'wnf'
                } else {
                    this.services = 'dc'
                }
                this.setState({loading: true});
                HttpClientHelper.get('availability', {zipcode: Address.zipcode, services: this.services}, (error, data) => {
                    this.setState({loading: false});
                    if (!error) {
                        // console.log(data);
                        this.setState({
                            pickup: null,
                            dropoff: null,
                            availability: JSON.stringify(data)
                        });
                    }
                })
            }
        });
    }

    handleConfirmOrder() {
        this.setState({loading: true});
        Address.id = Address.address_id;
        let params = {
            address: DataParser.getAddressSerialize(),
            pickup_window: this.getTimeAstring(this.state.pickup),
            dropoff_window: this.getTimeAstring(this.state.dropoff),
            services: this.services,
            special_instructions: this.special_instructions.getText()
        }
        HttpClientHelper.post('order', params, (error, data) => {
            this.setState({loading: false});
            if (!error) {
                Analytics.sendEvent(ORDER_PLACED, {
                    is_wnf: this.state.wf,
                    is_dc: this.state.dc,
                    zipcode: Address.zipcode
                });
                this.getUserInfoFromPress();
            } else {
                Functions.showAlert('', error.error ? error.error : 'Error during order creation. Please try again');
            }
        })
    }

    handleOnPress() {
        if (DataParser.getAddress() === 'Set Address') {
            Actions.setAddress();
            return;
        } else if (!(this.state.wf || this.state.dc)) {
            return;
        } else if (this.state.pickup === null) {
            this.handleOnPressPickUp();
            return;
        } else if (this.state.dropoff === null) {
            this.handleOnPressDropoff();
            return;
        } else if (User.stripe_payment_token == '' || User.stripe_payment_token == null) {
            Actions.payment();
            return;
        }
        this.handleConfirmOrder();
    }

    getCurrentDateSelected(data) {
        let currentDate = null;
        let currentTime = null;
        try {
            currentDate = data.date;
            currentTime = data.time;
        } catch (e) {}
        return {currentDate, currentTime};
    }

    handleOnPressDropoff() {
        if (!this.checkAddress()) return;
        if (!this.checkService()) return;
        if (!this.checkAvailability()) return;
        if (!this.checkPickupTime()) return;
        const {currentDate, currentTime} = this.getCurrentDateSelected(this.state.dropoff);
        this.setState({showIOSPicker: true});
        TimePicker.show(currentDate, currentTime, this.state.availability, 'Select Dropoff Window', 'When should we drop off your clean clothes?', (error, data) => {
            this.setState({showIOSPicker: false});
            if (!error) {
                this.setState({
                    dropoff: data
                });
            }
        });
    }

    handleOnPressPickUp() {
        if (!this.checkAddress()) return;
        if (!this.checkService()) return;
        if (!this.checkAvailability()) return;
        const {currentDate, currentTime} = this.getCurrentDateSelected(this.state.pickup);
        this.setState({showIOSPicker: true});
        TimePicker.show(currentDate, currentTime, this.state.availability, 'Select Pickup Window', 'When should we pick up your dirty clothes?', (error, data) => {
            this.setState({showIOSPicker: false});
            if (!error) {
                this.setState({
                    pickup: data,
                    dropoff: null
                });
            }
        });
    }

    getButtonNextTitle() {
        if (DataParser.getAddress() === 'Set Address') {
            return "Set Address";
        } else if (!(this.state.wf || this.state.dc)) {
            return "Choose Service";
        } else if (this.state.pickup === null) {
            return "Set Pickup Time";
        } else if (this.state.dropoff === null) {
            return "Set Dropoff Time";
        } else if (User.stripe_payment_token == '' || User.stripe_payment_token == null) {
            return "Update Payment";
        } else {
            return "Confirm Order";
        }
    }

    renderHeader() {
        return (
            <Header style={{
                backgroundColor: '#fff',
                height: Metrics.navBarHeight,
                paddingBottom: Platform.OS == 'ios' ? 10 : 0,
                borderBottomColor: Platform.OS == 'ios' ? '#e0e0e0' : 'transparent',
                borderBottomWidth: 1.0
            }}>
                <Button onPress={() => this.toggleMenu()} containerStyle={{
                    width: 50,
                    justifyContent: 'center',
                    marginLeft: 8
                }}>
                    <Image source={Images.person} style={{
                        resizeMode: 'contain',
                        width: 18,
                        marginBottom: 0
                    }}/>
                </Button>
                <Button onPress={() => Actions.setAddress()} containerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    padding: 5
                }}>
                    <Text style={{
                        marginTop: -5,
                        backgroundColor: 'transparent',
                        fontFamily: 'OpenSans',
                        fontSize: 14,
                        color: '#AAAAAA'
                    }}>
                        Delivering to
                    </Text>
                    <Text style={{
                        color: '#111111',
                        fontSize: 17,
                        marginTop: -3,
                        backgroundColor: 'transparent',
                        overflow: 'hidden',
                        fontFamily: 'OpenSans-SemiBold'
                    }}>
                        {DataParser.getAddress()}
                    </Text>
                </Button>
                <Button onPress={() => ChatSupport.open()} containerStyle={{
                    width: 50,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    marginRight: 8
                }}>
                    <Image source={Images.chat} style={{resizeMode: 'contain', width: 22, marginBottom: -4}}/>
                </Button>
            </Header>
        );
    }

    renderContent() {
        return (
            <Content scrollEnabled={true}>
                <View style={styles.container}>
                    <Separator style={{backgroundColor: '#f2f3f6'}}>
                        <Text style={{fontFamily: 'OpenSans', color: '#AAAAAA', fontSize: 14, marginTop: 6}}>Choose Service</Text>
                    </Separator>
                    <View style={styles.sectionContainer}>
                        <ListItem onPress={this.handleOnPressWash} style={{paddingTop: 10, paddingBottom: 13}}>
                            <CheckBox
                                activeOpacity={0.8}
                                checked={this.state.wf}
                                onPress={this.handleOnPressWash}
                                style={StyleSheet.flatten(this.state.wf ? styles.serviceItemCheckboxSelected : styles.serviceItemCheckbox)}
                            />
                            <Body>
                                <Text style={{fontFamily: 'OpenSans-SemiBold', color: this.state.wf ? '#171717' : '#656565', fontSize: 17, marginTop: 0}}>Wash & Fold</Text>
                                <Text style={{fontFamily: 'OpenSans', color: this.state.wf ? '#AAAAAA' : '#BBBBBB', fontSize: 14, marginBottom: 0}}>Everyday laundry. Returned neatly folded.</Text>
                            </Body>
                        </ListItem>
                        <ListItem onPress={this.handleOnPressDryClean} last style={{paddingTop: 10, paddingBottom: 13, marginBottom: -1}}>
                            <CheckBox
                                activeOpacity={0.8}
                                checked={this.state.dc}
                                onPress={this.handleOnPressDryClean}
                                style={StyleSheet.flatten(this.state.dc ? styles.serviceItemCheckboxSelected : styles.serviceItemCheckbox)}
                            />
                            <Body>
                                <Text style={{fontFamily: 'OpenSans-SemiBold', color: this.state.dc ? '#171717' : '#656565', fontSize: 17, marginTop: 0}}>Dry Cleaning</Text>
                                <Text style={{fontFamily: 'OpenSans', color: this.state.dc ? '#AAAAAA' : '#BBBBBB', fontSize: 14, marginBottom: 0}}>Delicate garments. Returned on hangers.</Text>
                            </Body>
                        </ListItem>
                    </View>
                    <Separator style={{backgroundColor: '#f2f3f6'}}>
                        <Text style={{ fontFamily: 'OpenSans', color: '#AAAAAA', fontSize: 14, marginTop: 6}}>Schedule</Text>
                    </Separator>
                    <View style={styles.sectionContainer}>
                        <ListItem onPress={() => {
                            GLOBAL.requestAnimationFrame(() => {
                                this.handleOnPressPickUp();
                            });
                        }}>
                            <Body>
                                <Text style={{ fontFamily: 'OpenSans', marginLeft: 0, fontSize: 15, color: '#999999', marginTop: -2 }}>Pickup Time</Text>
                                <Text style={{ marginLeft: 0, fontFamily: 'OpenSans-SemiBold', fontSize: 17, color: '#111111' }}>{this.getTimeAstring(this.state.pickup, 'Set Pickup Time')}</Text>
                            </Body>
                        </ListItem>
                        <ListItem 
                            onPress={() => {
                                GLOBAL.requestAnimationFrame(() => {
                                    this.handleOnPressDropoff();
                                });
                            }}
                            style={{marginBottom: -1}}
                            last
                        >
                            <Body>
                                <Text style={{ fontFamily: 'OpenSans', marginLeft: 0, fontSize: 15, color: '#999999', marginTop: -2 }}>Dropoff Time</Text>
                                <Text style={{ marginLeft: 0, fontFamily: 'OpenSans-SemiBold', fontSize: 17, color: '#111111' }}>{this.getTimeAstring(this.state.dropoff, 'Set Dropoff Time')}</Text>
                            </Body>
                        </ListItem>
                    </View>
                    <Notes ref={(ref) => this.special_instructions=ref} />
                </View>
            </Content>
        );
    }

    renderFooter() {
        let disabled = this.getButtonNextTitle() === 'Choose Service';
        return (<Footer style={{height: Metrics.navBarHeight, backgroundColor: 'black'}}>
            <Button
                disabled={disabled}
                onPress={this.handleOnPress}
                containerStyle={disabled ? styles.primaryButtonInactive : styles.primaryButton}
                textStyle={styles.primaryButtonText}
                text={this.getButtonNextTitle()}
            />
        </Footer>);
    }

    renderModal() {
        return (<Modal
            offset={this.state.offset}
            open={this.state.modal}
            modalDidOpen={() => console.log('modal did open')}
            modalDidClose={() => this.setState({
                modal: false,
                showButtonCall: false,
            })}
            modalStyle={{borderRadius: 5}}
        >
            <View>
                <Text style={{fontFamily: 'OpenSans-SemiBold', fontSize: 20, marginBottom: 10, marginTop: 10, alignSelf: 'center'}}>{this.state.modal_title}</Text>
                <Text style={{fontFamily: 'OpenSans', alignSelf: 'center', textAlign: 'center', fontSize: 14, color: '#777', padding: 10, paddingTop: 0, paddingBottom: 15}}>{this.state.modal_message}</Text>
                {this.state.showButtonCall && <Button
                    containerStyle={{margin: 5, backgroundColor: '#4B2D8F', padding: 12, justifyContent: 'center', alignItems: 'center', borderRadius: 4}}
                    textStyle={{color: '#ffffff', fontFamily: 'OpenSans-Bold', fontSize: 16}}
                    onPress={() => {
                        call({
                            number: Configs.SupportNumber, // String value with the number to call
                            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call
                        }).catch(console.error);
                    }}
                    text="Call to Schedule"
                />}
                <Button
                    containerStyle={{margin: 5, backgroundColor: '#FFFFFF', padding: 12, justifyContent: 'center', alignItems: 'center', borderRadius: 4, borderWidth: 1, borderColor: '#e0e0e0'}}
                    textStyle={{color: '#555555', fontFamily: 'OpenSans-Bold', fontSize: 16}}
                    onPress={() => this.setState({modal: false})}
                    text="Got It"
                />
            </View>
        </Modal>);
    }

    renderOverlayIOS() {
        if (Platform.OS == 'ios' && this.state.showIOSPicker) {
            return (
                <Touchable
                    onPress={() => {
                        TimePicker.hide();
                        this.setState({showIOSPicker: false});
                    }}
                    style={{
                        position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.7)',
                        width: Metrics.screenWidth, height: Metrics.screenHeight
                    }}
                />
            );
        } else {
            return null;
        }
    }
    
    toggleMenu() {
        this._drawer.toggle()
    }

    render() {
        let menu = <LeftMenu />
        let content = <Container style={{backgroundColor: '#f2f3f6'}}>
            {this.renderHeader()}
            {this.renderContent()}
            {this.renderFooter()}
            <Spinner visible={this.state.loading} />
        </Container>;

        return (<DrawerLayoutMenu
            menu={menu}
            menuPosition='left'
            ref={(ref) => this._drawer = ref}
            openMenuOffset={Metrics.screenWidth - 80}
        >
            {content}
            {this.renderModal()}
            {this.renderOverlayIOS()}
        </DrawerLayoutMenu>);
    }
}
