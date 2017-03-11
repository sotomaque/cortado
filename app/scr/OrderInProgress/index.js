// @flow
'use strict'

import React from 'react'
import { View, StyleSheet, Linking } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { Actions as NavigationActions } from 'react-native-router-flux'
import call from 'react-native-phone-call'
import { Container, Content, Body, ListItem, Text, CheckBox, Footer, FooterTab, Button } from 'native-base';

import * as DataParser from '../../utils/DataParser';
import { Fonts, Metrics, Colors, Images } from '../../themes'

const args = {
  number: '5125226489', // String value with the number to call
  prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call
}

class OrderInProgress extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      InProgress: true,
      Pickup: false,
      Cleaning: false,
      Delivery: false
    };
  }

  componentDidMount(props) {
    // hit action to get order status
    // action should hit api at /getWorld endpoint
    // then set order_phase in order obj = response.order_phase
    //Actions.getWorld()
    // if (World.order_phase = 'scheduled') {

    // }
  }

  render () {

    return (

      <Container>
        <Content>
            <MapView
              style={styles.mapView}
              initialRegion={{
                latitude: 30.268908,
                longitude: -97.740378,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003
              }} />
        </Content>
        <Content>
          <ListItem>
              <CheckBox checked={this.state.InProgress} />
              <Body>
                  <Text>Order Confirmed</Text>
              </Body>
          </ListItem>
          <ListItem>
              <CheckBox checked={this.state.Pickup} />
              <Body>
                  <Text>Pickup</Text>
              </Body>
          </ListItem>
           <ListItem>
              <CheckBox checked={this.state.Cleaning} />
              <Body>
                  <Text>Cleaning</Text>
              </Body>
          </ListItem>
           <ListItem>
              <CheckBox checked={this.state.Delivery} />
              <Body>
                  <Text>Delivery</Text>
              </Body>
          </ListItem>
        </Content>
        <Footer >
            <FooterTab>
                <Button onPress={() => Linking.openURL('https://www.yahoo.com')}>
                    <Text>Chat Support</Text>
                </Button>

                <Button onPress={() => call(args).catch(console.error)}>
                    <Text>Phone Support</Text>
                </Button>
            </FooterTab>
        </Footer>
      </Container>
    )
  }
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: Metrics.navBarHeight
    },
    mapView: {
      height: 1000,
      width: (Metrics.screenWidth)
    },
    buttons: {

      position: 'absolute',
      bottom: 0
    }
});

export default OrderInProgress
