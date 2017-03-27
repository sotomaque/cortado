import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Content, ListItem, Left, Body, Right, Text, Header, Form, Item, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
import MapView, { Marker } from 'react-native-maps'
import { Metrics } from '../../themes';
import { Button } from '../../components';
import { Address } from '../../beans';
import { SessionManager, HttpClientHelper } from '../../libs';
import * as Functions from '../../utils/Functions';
import Geocoder from 'react-native-geocoder';
import * as DataParser from '../../utils/DataParser';
import Configs from '../../configs';

export default class SetAddress extends React.Component {

  autoRequestLocation = null;

  constructor(props) {
    super(props);

    let lat = Configs.defaultLocation.lat;
    let lng = Configs.defaultLocation.lng;

    if(Address.latitude!=0 || Address.longitude!=0) {
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
    HttpClientHelper.get('me', null, (error, data)=>{
      if(!error) {
        DataParser.initializeUser(data);
        if(!this.state.changed)
          this.setState({reload: !this.state.reload});
      }
    })
  }

  handlePressSave() {
    if(this.state.changed) {
      this.setState({changed: false, loading: true});
      const {street, zipcode, notes} = this.state;
      HttpClientHelper.post('address', {street, zipcode, notes}, (error, data)=>{
        this.setState({loading: false});
        if(!error) {
          Address.street = this.state.street;
          Address.zipcode = this.state.zipcode;
          Address.notes = this.state.notes;
          SessionManager.saveUserInfo();
          Actions.pop({refresh: {reload: true, address_changed: true}});
        } else {
          Functions.showAlert('', error.error?error.error:'Please enter a valid zipcode. Please try again.');
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
    })
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
      if(this.autoRequestLocation!=null) {
        clearTimeout(this.autoRequestLocation);
        this.autoRequestLocation = null;
      }
    } catch (e) { console.log(e); }
  }

  animatedToNewRegion() {
    if(this.map!=undefined)
      this.map.animateToRegion(this.getRegion());
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
    let address = this.state.street;
    if(address!='' && address!=undefined) {
      if(this.state.zipcode!='' && this.state.zipcode!=undefined) {
        address = address+", "+ this.state.zipcode
      }
    } else {
      address = this.state.zipcode;
    }
    return address;
  }

  requestLocation() {
    this.clearRequest();
    if(this.state.street=='' && this.state.zipcode=='') return;
    this.autoRequestLocation = setTimeout(()=>{
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
      <Header style={{backgroundColor: '#fff', height: Metrics.navBarHeight, paddingBottom: 3}}>
        <Button containerStyle={{width: 80, justifyContent: 'center'}} onPress={()=>{
          try {
            Actions.pop();
          } catch (e) {
            console.log(e);
          }
        }}>
          <Text style={{color: '#565656', fontSize: 14, fontWeight :'bold'}}>Cancel</Text>
        </Button>
        <Button containerStyle={{justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5}}>
          <Text style={{color: '#565656', fontSize: 18, fontWeight :'bold'}}>Address</Text>
        </Button>
        <Button containerStyle={{width: 80, alignItems: 'flex-end', justifyContent: 'center'}} onPress={this.handlePressSave}>
          <Text style={{color: this.state.changed?'#565656':'#ccc', fontSize: 14}}>Save</Text>
        </Button>
      </Header>
    );
  }

  renderContent() {
    return (
      <Content>
        <Form style={{backgroundColor: '#ffffff'}}>
            <Item>
                <Input placeholder="Street, Apt #" onChangeText={(value)=>{this.handleStreetChanged(value)}}
                value={this.state.street} style={{fontWeight: 'bold'}}/>
            </Item>
            <Item>
                <Input 
                  placeholder="Zipcode" 
                  onChangeText={(value)=>{this.handleZipcodeChanged(value)}}
                  value={this.state.zipcode} 
                  style={{fontWeight: 'bold'}}
                /> 
            </Item>
            <Item>
              <Input 
                placeholder="Notes (gate code, leave with the front desk, etc)" 
                onChangeText={(value)=>{this.handleNodesChanged(value)}}
                value={this.state.notes} 
                style={{overflow: 'hidden'}}
                
              />
            </Item>
        </Form>
      </Content>
    );
  }

  renderMap() {
    return (
      <MapView
        ref={ref => { this.map = ref; }}
        style={styles.mapView}
        region={this.getRegion()}>
        <MapView.Marker
          pinColor="#4b3486"
          coordinate={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
          }}
          title={"My location"}
          description={Address.street+", "+Address.zipcode}
        />
      </MapView>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderMap()}
        {this.renderHeader()}
        {this.renderContent()}
        <Spinner visible={this.state.loading} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    mapView: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      height: Metrics.screenHeight/1.5,
      width: (Metrics.screenWidth)
    }
});
