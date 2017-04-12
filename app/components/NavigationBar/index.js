import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Content, ListItem, Text, Separator, CheckBox, Footer, FooterTab, Body, Input, Item, Button as MenuButton, Icon, Left, Right, Title, Header } from 'native-base';
import { Metrics, Colors, Images } from '../../themes';
import { Button } from '../../components';
import { Actions } from 'react-native-router-flux';

export default class NavigationBar extends React.Component {
    render() {
        return  (
            <Header style={{
                backgroundColor: '#fff',
                height: Metrics.navBarHeight,
                paddingBottom: 10,
                borderBottomColor: '#e0e0e0',
                borderBottomWidth: 1.0
            }}>
                <Button containerStyle={{width: 50, justifyContent: 'center'}} onPress={()=>{
                    try {
                        Actions.pop();
                    } catch (e) {
                        console.log(e);
                    }
                }}>
                    <Icon style={{color: '#565656'}} name='arrow-back' />
                </Button>
                <Button containerStyle={{justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5}}>
                    <Text style={{color: '#565656', fontSize: 18, fontFamily: 'OpenSans-SemiBold'}}>{this.props.title}</Text>
                </Button>
                <Button containerStyle={{width: 50, alignItems: 'center', justifyContent: 'center'}} />
            </Header>
        )
    }
}
