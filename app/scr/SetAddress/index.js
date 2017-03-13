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

export default class SetAddress extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      changed: false,
      street: Address.street,
      zipcode: Address.zipcode,
      notes: Address.notes,
      loading: false
    };
    this.handlePressSave = this.handlePressSave.bind(this);
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
          Functions.showAlert('', 'Please enter a valid zipcode. Please try again.');
        }
      });
    }
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
          <Text style={{color: '#565656', fontSize: 14}}>Cancel</Text>
        </Button>
        <Button containerStyle={{justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5}}>
          <Text style={{color: '#565656', fontSize: 18}}>Set Address</Text>
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
                <Input placeholder="Street, Apt #" onChangeText={(value)=>{
                  this.setState({
                    changed: true,
                    street: value
                  })
                }}
                value={this.state.street}/>
            </Item>
            <Item>
                <Input placeholder="Zipcode" onChangeText={(value)=>{
                  this.setState({
                    changed: true,
                    zipcode: value
                  })
                }}
                value={this.state.zipcode}/>
            </Item>
            <Item>
              <Input placeholder="Zipcode" onChangeText={(value)=>{
                this.setState({
                  changed: true,
                  zipcode: value
                })
              }} value={this.state.notes} placeholder="Notes" />
            </Item>
        </Form>
      </Content>
    );
  }

  renderMap() {
    return (
      <MapView
        style={styles.mapView}
        initialRegion={{
          latitude: 30.268908,
          longitude: -97.740378,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003
        }} />
    );
  }

  render() {
    return <View style={styles.container}>
      {this.renderMap()}
      {this.renderHeader()}
      {this.renderContent()}
      <Spinner visible={this.state.loading} />
    </View>
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
      height: Metrics.screenHeight/2,
      width: (Metrics.screenWidth)
    }
});
