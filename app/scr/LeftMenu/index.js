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
        if (User.profile_picture_url != undefined && User.profile_picture_url != '') {
            avatar = {uri: User.profile_picture_url};
        }

        let textStyle = {
            fontFamily: 'OpenSans'
        };

        let itemStyle = {
            backgroundColor: '#fff',
            borderColor: '#fff',
            marginLeft: 0,
            paddingLeft: 10
        };

        return (
            <Container style={{backgroundColor: '#fff'}}>
                <Content>
                    <ListItem style={{justifyContent: 'center', paddingBottom: 30, paddingTop: 30, borderColor: '#fff'}}>
                            <Image source={avatar} style={{width: 70, height: 70, borderWidth: 0, borderRadius: 35}}/>
                    </ListItem>
                    <ListItem style={itemStyle} onPress={()=>{
                        GLOBAL.requestAnimationFrame(() => {
                                Actions.payment();
                        });
                    }}>
                        <Body>
                            <Text style={textStyle}>Payment</Text>
                        </Body>
                    </ListItem>
                    <ListItem style={itemStyle} onPress={()=>{
                        GLOBAL.requestAnimationFrame(() => {
                                Actions.pricing();
                        });
                    }}>
                        <Body>
                            <Text style={textStyle}>Pricing</Text>
                        </Body>
                    </ListItem>
                    <ListItem style={itemStyle} onPress={()=>{
                        GLOBAL.requestAnimationFrame(() => {
                                Actions.promotions();
                        });
                    }}>
                        <Body>
                            <Text style={textStyle}>Promotions</Text>
                        </Body>
                    </ListItem>
                    <ListItem style={itemStyle} onPress={()=>{
                        GLOBAL.requestAnimationFrame(() => {
                                Actions.freePress();
                        });
                    }}>
                        <Body>
                            <Text style={textStyle}>Free Press</Text>
                        </Body>
                    </ListItem>
                    <ListItem style={itemStyle} onPress={()=>{
                        GLOBAL.requestAnimationFrame(() => {
                            Intercom.displayMessageComposer();
                        });
                    }}>
                        <Body>
                            <Text style={textStyle}>Chat Support</Text>
                        </Body>
                    </ListItem>
                </Content>
                <Footer style={{backgroundColor: '#ffffff', height: 50, alignItems: 'center'}}>
                    <Button containerStyle={{padding: 10}} textStyle={textStyle} text="Logout" onPress={()=>{
                        SessionManager.logout();
                        GLOBAL.requestAnimationFrame(() => {
                                Actions.login({type: ActionConst.REPLACE});
                        });
                    }} />
                </Footer>
            </Container>
        )
    }
}
