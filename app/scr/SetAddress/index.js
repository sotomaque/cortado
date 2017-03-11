import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Content, ListItem, Left, Body, Right, Text, Header, Form, Item, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';
import MapView, { Marker } from 'react-native-maps'
import { Metrics } from '../../themes';
import { Button } from '../../components';

export default class SetAddress extends React.Component {

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
        <Button containerStyle={{width: 80, alignItems: 'flex-end', justifyContent: 'center'}}>
          <Text style={{color: '#565656', fontSize: 14}}>Save</Text>
        </Button>
      </Header>
    );
  }

  renderContent() {
    return (
      <Content>
        <Form>
            <Item>
                <Input placeholder="Street, Apt #" />
            </Item>
            <Item>
                <Input placeholder="Zipcode" />
            </Item>
            <Item>
                <Input placeholder="Notes" />
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
      {this.renderHeader()}
      {this.renderContent()}
      {this.renderMap()}
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
