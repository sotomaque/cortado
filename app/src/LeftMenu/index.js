import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Container, Content, ListItem, Text, Separator, CheckBox, Footer, FooterTab, Body, Input, Item, Button as MenuButton, Icon, Left, Right, Title, Header } from 'native-base';
import { Images } from '../../themes';
import { Button } from '../../components';
import { Actions, ActionConst } from 'react-native-router-flux';
import { SessionManager } from '../../libs';
import { User } from '../../beans';
import ChatSupport from '../../utils/chatSupport';

export default class LeftMenu extends React.Component {

    render() {
        let avatar = Images.logo2;
        if (User.profile_picture_url != undefined && User.profile_picture_url != '') {
            avatar = {uri: User.profile_picture_url};
        }

        let textStyle = {
            fontFamily: 'OpenSans',
            fontSize: 16,
            color: '#171717'
        };

        let itemStyle = {
            backgroundColor: '#fff',
            borderColor: '#fff',
            marginLeft: 0,
            paddingLeft: 10,
            paddingBottom: 12,
            paddingTop: 12
        };

        let iconStyle = {
            fontSize: 28,
            width: 30,
            marginLeft: 10,
            marginTop: 4
        }

        return (
            <Container style={{
                backgroundColor: '#ffffff',
                borderRightWidth: 0,
                borderColor: '#e8e8e8'
            }}>
                <Content>
                    <ListItem style={{
                        justifyContent: 'flex-start',
                        paddingBottom: 16,
                        paddingTop: 34,
                        paddingLeft: 20,
                        marginBottom: 10,
                        borderColor: '#f2f3f6',
                        borderBottomWidth: 1,
                        marginLeft: 0
                    }}>
                        <Image source={avatar} style={{width: 52, height: 52, borderWidth: 0, borderRadius: 26}}/>
                        <View>
                            <Text style={{fontFamily: 'OpenSans-SemiBold', fontSize: 15, marginLeft: 16, color: '#333333', alignSelf: 'flex-start'}}>{User.full_name}</Text>
                            <Text style={{fontFamily: 'OpenSans-SemiBold', fontSize: 13, marginLeft: 16, color: '#888888', alignSelf: 'flex-start'}}>{User.email}</Text>
                        </View>
                    </ListItem>
                    <ListItem style={itemStyle} onPress={() => {
                        GLOBAL.requestAnimationFrame(() => {
                            Actions.payment();
                        });
                    }}>
                        <Left>
                            <Icon name="card" style={iconStyle}/>
                            <Text style={textStyle}>Payment</Text>
                        </Left>
                    </ListItem>
                    <ListItem style={itemStyle} onPress={() => {
                        GLOBAL.requestAnimationFrame(() => {
                            Actions.freePress();
                        });
                    }}>
                        <Left>
                            <Icon ios="ios-cash" android="md-cash" style={StyleSheet.flatten([iconStyle, {color: '#694CB5'}])}/>
                            <Text style={StyleSheet.flatten([textStyle, {color: '#694CB5', fontFamily: 'OpenSans-SemiBold'}])}>Get Free Press</Text>
                        </Left>
                    </ListItem>
                    <ListItem style={itemStyle} onPress={() => {
                        GLOBAL.requestAnimationFrame(() => {
                            Actions.promotions();
                        });
                    }}>
                        <Left>
                            <Icon name="ribbon" style={iconStyle}/>
                            <Text style={textStyle}>Redeem Promotion</Text>
                        </Left>
                    </ListItem>
                    <ListItem style={itemStyle} onPress={() => {
                        GLOBAL.requestAnimationFrame(() => {
                            Actions.pricing();
                        });
                    }}>
                        <Left>
                            <Icon name="pricetags" style={iconStyle}/>
                            <Text style={textStyle}>Pricing</Text>
                        </Left>
                    </ListItem>
                    <ListItem style={itemStyle} onPress={() => {
                        GLOBAL.requestAnimationFrame(() => {
                            ChatSupport.open();
                        });
                    }}>
                        <Left>
                            <Icon name="help-buoy" style={iconStyle}/>
                            <Text style={textStyle}>Chat Support</Text>
                        </Left>
                    </ListItem>
                    <ListItem style={itemStyle} onPress={() => {
                        SessionManager.logout();
                        GLOBAL.requestAnimationFrame(() => {
                            Actions.login({type: ActionConst.REPLACE});
                        });
                    }}>
                        <Left>
                            <Icon name="exit" style={iconStyle}/>
                            <Text style={textStyle}>Logout</Text>
                        </Left>
                    </ListItem>
                </Content>
                <Footer style={{justifyContent: 'flex-start', backgroundColor: '#ffffff', borderTopWidth: 0, paddingLeft: 20}}>
                    
                </Footer>
            </Container>
        )
    }
}
