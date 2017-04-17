import React from 'react';
import { TextInput, Text, View, Image, Keyboard, StyleSheet, Platform } from 'react-native';
import { Container, Content, ListItem, Left, Body, Right, Header, Form, Item, Input, Label, Icon} from 'native-base';
import { Actions } from 'react-native-router-flux';
import Geocoder from 'react-native-geocoder';
import Spinner from 'react-native-loading-spinner-overlay';
import MapView, { Marker } from 'react-native-maps'

import * as Functions from '../../utils/Functions';
import * as DataParser from '../../utils/DataParser';
import Configs from '../../configs';
import Analytics from '../../utils/analytics';
import { ADDRESS_UPDATED } from '../../utils/analyticsEvents';
import { Metrics, Images } from '../../themes';
import { Touchable, Button, Panel } from '../../components';
import { Address } from '../../beans';
import { SessionManager, HttpClientHelper } from '../../libs';


export default class SetAddress extends React.Component {

    autoRequestLocation = null;

    constructor(props) {
        super(props);

        let lat = Configs.defaultLocation.lat;
        let lng = Configs.defaultLocation.lng;

        if (Address.latitude != 0 || Address.longitude != 0) {
            lat = Address.latitude;
            lng = Address.longitude;
        }

        this.state = {
            changed: false,
            street: Address.street,
            zipcode: Address.zipcode,
            notes: Address.notes,
            latitude: lat,
            longitude: lng,
            loading: false
        };
        this.handlePressSave = this.handlePressSave.bind(this);
    }

    getUserInfoFromPress() {
        HttpClientHelper.get('me', null, (error, data) => {
            if (!error) {
                DataParser.initializeUser(data);
                if (!this.state.changed) {
                    this.setState({reload: !this.state.reload});
                }
            }
        })
    }

    handlePressSave() {
        if (this.state.changed) {
            this.setState({changed: false, loading: true});
            const {street, zipcode, notes} = this.state;
            HttpClientHelper.post('address', {street, zipcode, notes}, (error, data) => {
                this.setState({loading: false});
                if (!error) {
                    Analytics.sendEvent(ADDRESS_UPDATED, {
                        street: this.state.street,
                        zipcode: this.state.zipcode
                    });

                    Address.street = this.state.street;
                    Address.zipcode = this.state.zipcode;
                    Address.notes = this.state.notes;
                    SessionManager.saveUserInfo();
                    Actions.pop({refresh: {reload: true, address_changed: true}});
                } else {
                    Functions.showAlert('', error.error ? error.error : 'Please enter a valid zipcode. Please try again.');
                }
            });
        }
    }

    componentDidMount() {
        this.requestLocation();
        this.getUserInfoFromPress();
    }

    handleStreetChanged(value) {
        this.setState({
            changed: true,
            street: value
        });
        this.requestLocation();
    }

    handleZipcodeChanged(value) {
        this.setState({
            changed: true,
            zipcode: value
        });
        this.requestLocation();
    }

    handleNodesChanged(value) {
        this.setState({
            changed: true,
            notes: value
        });
    }

    clearRequest() {
        try {
            if (this.autoRequestLocation != null) {
                clearTimeout(this.autoRequestLocation);
                this.autoRequestLocation = null;
            }
        } catch (e) { console.log(e); }
    }

    animatedToNewRegion() {
        if (this.map != undefined) {
            this.map.animateToRegion(this.getRegion());
        }
    }

    getRegion() {
        return {
            latitude: this.state.latitude * 1.00003,
            longitude: this.state.longitude,
            latitudeDelta: 0.004,
            longitudeDelta: 0.004
        };
    }

    getAddress() {
        let address = this.state.street;
        if (address != '' && address != undefined) {
            if (this.state.zipcode != '' && this.state.zipcode != undefined) {
                address = address + ", " + this.state.zipcode;
            }
        } else {
            address = this.state.zipcode;
        }
        return address;
    }

    requestLocation() {
        this.clearRequest();
        if (this.state.street == '' || this.state.zipcode == '') return;
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
                })
                .catch(err => console.log(err));
                this.clearRequest();
            } catch (e) { }
        }, 300);
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
                <Button containerStyle={{width: 80, justifyContent: 'center'}} onPress={() => {
                    try {
                        Actions.pop();
                    } catch (e) {
                        console.log(e);
                    }
                }}>
                    <Text style={{fontFamily: 'OpenSans-SemiBold', color: '#565656', fontSize: 14}}>Cancel</Text>
                </Button>
                <Button containerStyle={{justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5}}>
                    <Text style={{color: '#565656', fontSize: 18, fontFamily: 'OpenSans-SemiBold'}}>Address</Text>
                </Button>
                <Button containerStyle={{width: 80, alignItems: 'flex-end', justifyContent: 'center'}} onPress={this.handlePressSave}>
                    <Text style={{color: this.state.changed ? '#565656' : '#ccc', fontSize: 14, fontFamily: 'OpenSans-SemiBold'}}>Save</Text>
                </Button>
            </Header>
        );
    }

    renderMap() {
        return (
            <MapView
                ref={ref => { this.map = ref; }}
                style={styles.mapView}
                region={this.getRegion()}
            >
                <MapView.Marker
                    coordinate={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude
                    }}
                    centerOffset={{
                        x: 6,
                        y: -29
                    }}
                >
                    <Image source={Images.mapPin} style={{
                        resizeMode: 'contain',
                        width: 40
                    }}/>
                </MapView.Marker>
            </MapView>
        );
    }

    renderForm() {
        return (
            <Form>
                <Item style={StyleSheet.flatten(styles.inputContainer)} fixedLabel>
                    <Label style={StyleSheet.flatten(styles.inputLabel)}>Street, Apt #</Label>
                    <Input
                        placeholder='Your Street and Apt #'
                        value={this.state.street}
                        onChangeText={(value)=>{this.handleStreetChanged(value)}}
                        style={StyleSheet.flatten(styles.inputField)}
                        returnKeyType="next"
                    />
                </Item>
                <Item style={StyleSheet.flatten(styles.inputContainer)} fixedLabel>
                    <Label style={StyleSheet.flatten(styles.inputLabel)}>Zip Code</Label>
                    <Input
                        placeholder='12345'
                        value={this.state.password}
                        onChangeText={(value)=>{this.handleZipcodeChanged(value)}}
                        value={this.state.zipcode}
                        style={StyleSheet.flatten(styles.inputField)}
                        returnKeyType="next"
                    />
                </Item>
                <Item style={StyleSheet.flatten(styles.inputContainer)} fixedLabel>
                    <Label style={StyleSheet.flatten(styles.inputLabel)}>Address Notes</Label>
                    <Input 
                        placeholder="Gate code, doorman, etc." 
                        onChangeText={(value)=>{this.handleNodesChanged(value)}}
                        value={this.state.notes} 
                        style={StyleSheet.flatten([styles.inputField, styles.inputFieldNotes])}
                    />
                </Item>
            </Form>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderMap()}
                {this.renderHeader()}
                <View style={{margin: 8}}>
                    <Panel>
                        {this.renderForm()}
                    </Panel>
                </View>
                
                <Spinner visible={this.state.loading} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inputLabel: {
        fontFamily: 'OpenSans',
        fontSize: 14
    },
    inputField: {
        fontFamily: 'OpenSans',
        fontSize: 16
    },
    inputFieldNotes: {
        fontSize: 13
    },
    inputContainer: {
        borderBottomColor: '#e8e8e8',
        marginLeft: 0
    },
    mapView: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        top: 0,
        width: Metrics.screenWidth
    }
});