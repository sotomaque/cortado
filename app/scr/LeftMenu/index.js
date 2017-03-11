import React from 'react';
import { View, Image } from 'react-native';
import { Container, Content, ListItem, Text, Separator, CheckBox, Footer, FooterTab, Body, Input, Item, Button as MenuButton, Icon, Left, Right, Title, Header } from 'native-base';
import { Images } from '../../themes';
import { Button } from '../../components';
import { Actions, ActionConst } from 'react-native-router-flux';
import { SessionManager } from '../../libs';

export default class LeftMenu extends React.Component {
  render() {
    return <Container>
      <Content>
        <ListItem style={{justifyContent: 'center', paddingBottom: 50, paddingTop: 50}}>
            <Image source={Images.logo2} style={{width: 50, height: 50}}/>
        </ListItem>
        <ListItem onPress={()=>{}}>
          <Body>
            <Text>Payment</Text>
          </Body>
        </ListItem>
        <ListItem onPress={()=>{
          GLOBAL.requestAnimationFrame(() => {
              Actions.pricing();
          });
        }}>
          <Body>
            <Text>Pricing</Text>
          </Body>
        </ListItem>
        <ListItem onPress={()=>{
          GLOBAL.requestAnimationFrame(() => {
              Actions.promotions();
          });
        }}>
          <Body>
            <Text>Promotions</Text>
          </Body>
        </ListItem>
        <ListItem onPress={()=>{
          GLOBAL.requestAnimationFrame(() => {
              Actions.freePress();
          });
        }}>
          <Body>
            <Text>Free Press</Text>
          </Body>
        </ListItem>
      </Content>
      <Footer style={{backgroundColor: '#ffffff', height: 50, alignItems: 'center'}}>
        <Button containerStyle={{padding: 10}} text="Logout" onPress={()=>{
          SessionManager.logout();
          GLOBAL.requestAnimationFrame(() => {
              Actions.login({type: ActionConst.REPLACE});
          });
        }} />
      </Footer>
    </Container>
  }
}
