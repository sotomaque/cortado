import React from 'react';
import { View, Image } from 'react-native';
import { Container, Content, ListItem, Text, Separator, CheckBox, Footer, FooterTab, Body, Input, Item, Button as MenuButton, Icon, Left, Right, Title, Header } from 'native-base';
import { Images } from '../../themes';
import { Button } from '../../components';
import { Actions, ActionConst } from 'react-native-router-flux';
import { SessionManager } from '../../libs';
import { User } from '../../beans';
import Intercom from 'react-native-intercom';

export default class LeftMenu extends React.Component {

  render() {

    let avatar = Images.logo2;
    if(User.profile_picture_url!=undefined && User.profile_picture_url!='') {
      avatar = {uri: User.profile_picture_url};
    }

    return <Container style={{backgroundColor: '#fcfcfc'}}>
      <Content>
        <ListItem style={{justifyContent: 'center', paddingBottom: 50, paddingTop: 50}}>
            <Image source={avatar} style={{width: 60, height: 60, borderWidth: 0, borderRadius: 30}}/>
        </ListItem>
        <ListItem onPress={()=>{
          GLOBAL.requestAnimationFrame(() => {
              Actions.payment();
          });
        }}>
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
        <ListItem onPress={()=>{
          GLOBAL.requestAnimationFrame(() => {
            Intercom.displayMessageComposer();
          });
        }}>
          <Body>
            <Text>Chat Support</Text>
          </Body>
        </ListItem>
      </Content>
      <Footer style={{backgroundColor: '#fcfcfc', height: 50, alignItems: 'center'}}>
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
