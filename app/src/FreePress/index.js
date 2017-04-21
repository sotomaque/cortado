import React, { Component } from 'react'
import { View, StyleSheet, Text, Platform, Image, StatusBar, Alert, ActivityIndicator, Clipboard } from 'react-native'
import { Container, Content, Header, Icon, List, ListItem } from 'native-base'
import AlphabetListView from 'react-native-alphabetlistview';
import Permissions from 'react-native-permissions';
import Contacts from 'react-native-contacts';
import Toast from 'react-native-root-toast';

import { Metrics, Images } from '../../themes';
import { Actions } from 'react-native-router-flux';
import {User} from '../../beans';
import { NavigationBar, Button } from '../../components';
import Share from 'react-native-share';
import { HttpClientHelper } from '../../libs';

class FreePress extends Component {

    constructor(props, context) {
        super(props, context);

        this.onClickInvite = this.onClickInvite.bind(this);
        this._renderContactCell = this._renderContactCell.bind(this);
        this._handleAuthorizedPermission = this._handleAuthorizedPermission.bind(this);
        this._handleRestrictedPermission = this._handleRestrictedPermission.bind(this);
        this._handleUndeterminedPermission = this._handleUndeterminedPermission.bind(this);
        this._handleDeniedPermission = this._handleDeniedPermission.bind(this);

        this.state = {
            contactData: null,
            invitesLoading: {},  // {"<phone #>: true/false"}
            invitesSent: {},  // {"<phone #>: true/false"}
        };
    }

    componentDidMount() {
        Permissions.getPermissionStatus('contacts')
        .then(response => {
            console.log('Contacts permission: ' + response);
            this._callbackForContactsPermission(response)();
        })
        .catch((err) => {
            console.log('[ERROR] Get Contacts Permission Status', err);
        });
    }

    loadContacts() {
        Contacts.getAll((err, _contacts) => {
            if (err) {
                console.log('[ERROR] Getting Contacts', err)
            } else {
                var contacts = [];

                for (let i in _contacts) {
                    const contact = this._parseContact(_contacts[i])
                    if (contact) {
                        contacts.push(contact);
                    }
                }

                contacts.sort(function(c1, c2) {
                    return c1.fullName.toUpperCase().localeCompare(c2.fullName.toUpperCase());
                });

                var contactsGrouped = {};
                var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                for (var k = 0; k < alphabet.length; k++) {
                    contactsGrouped[alphabet[k]] = [];
                }

                for (let c in contacts) {
                    var section = contacts[c].fullName.toUpperCase()[0];
                    contactsGrouped[section].push(contacts[c]);
                }

                this.setState({
                    contactData: contactsGrouped
                });
            }
        })
    }

    _parseContact(contact) {
        var firstName = contact.givenName;
        var lastName = contact.familyName;
        var phoneNumber = this._parsePhoneNumber(contact);

        if (!phoneNumber || !firstName) {
            return null;
        }

        // Only accept names that begin with a letter
        if (!firstName[0].match(/[a-zA-Z]/i)) {
            return null;
        }

        var name = firstName;
        if (lastName) {
            name += ' ';
            name += lastName;
        }

        return {
            fullName: name,
            phoneNumber: phoneNumber
        };
    }

    _parsePhoneNumber(contact) {
        if (contact.phoneNumbers.length < 1) {
            return null;
        }

        var number = contact.phoneNumbers[0].number;
        for (let i in contact.phoneNumbers) {
            if (contact.phoneNumbers[i].label == 'mobile') {
                number = contact.phoneNumbers[i].number;
            }
        }

        return this._formatPhoneNumber(number);
    }

    _formatPhoneNumber(s) {
        var s2 = (""+s).replace('+1', '').replace('+ 1', '').replace(/\D/g, '');
        var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
        return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
    }

    _callbackForContactsPermission(permission) {
        const responseToFn = {
            'authorized': this._handleAuthorizedPermission,
            'restricted': this._handleRestrictedPermission,
            'undetermined': this._handleUndeterminedPermission,
            'denied': this._handleDeniedPermission
        };

        return responseToFn[permission];
    }

    _handleAuthorizedPermission() {
        this.loadContacts();
    }

    _handleRestrictedPermission() {
        return;
    }

    _handleUndeterminedPermission() {
        Alert.alert(
            '"Press" Would Like to Access Your Contacts',
            'Earn free laundry credits by referring your friends. Press can help you refer friends and family if you allow us to sync your contacts.',
            [
                {
                    text: "Don't Allow",
                    onPress: () => {
                        console.log('permission denied');
                    }
                },
                {
                    text: 'Ok',
                    onPress: () => {
                        Permissions.requestPermission('contacts')
                        .then(response => {
                            if (response == 'authorized') {
                                this.loadContacts();
                            }
                        })
                        .catch((err) => {
                            console.log('[ERROR] Get Contacts Permission Status', err);
                        });
                    }
                }
            ]
        );
    }

    _handleDeniedPermission() {
        Alert.alert(
            'Sync Contacts?',
            'Press can help you refer friends and family if you allow us to sync your contacts.',
            [
                {
                    text: 'Cancel',
                    onPress: () => {
                        console.log('permission denied');
                    }
                },
                {
                    text: 'Open Settings',
                    onPress: Permissions.openSettings
                }
            ]
        );
    }

    showShareActionSheet = () => {
        let shareOptions = {
            title: "Free Press",
            message: `Get $10 off your first laundry & dry cleaning delivery with Press. Sign up with my link: https://www.presscleaners.com/i/${User.promo_code}/`,
            url: this.props.url,
            subject: "Free Press" //  for email
        };
        setTimeout(() => {
            Share.open(shareOptions);
        }, 300);
    }

    renderHeader() {
        return (
            <Header style={{
                backgroundColor: '#5933af',
                height: Metrics.navBarHeight,
                paddingBottom: Platform.OS == 'ios' ? 10 : 0,
                borderBottomColor: '#4b279e',
                borderBottomWidth: 1.0
            }}>
            <Button containerStyle={{width: 80, justifyContent: 'center'}} onPress={()=>{
                try {
                    Actions.pop();
                } catch (e) {
                    console.log(e);
                }
            }}>
                <Text style={{fontFamily: 'OpenSans-SemiBold', color: '#fff', fontSize: 14}}>Done</Text>
            </Button>
            <Button containerStyle={{justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5}}>
                <Text style={{color: '#fff', fontSize: 18, fontFamily: 'OpenSans-SemiBold'}}>Get Free Press</Text>
            </Button>
            <Button onPress={this.showShareActionSheet} containerStyle={{width: 80, alignItems: 'flex-end', justifyContent: 'center'}}>
                <Icon name='share' style={{color: '#ffffff', fontSize: 27, marginTop: 2, marginRight: 3}}/>
            </Button>
          </Header>
        );
    }

    renderInfoContainer() {
        return (
            <View style={styles.infoContainer}>
                <Text style={styles.mainDescription}>
                    Invite your friends to Press and you'll each get $10 after they complete their first order.
                </Text>
                <Button text={null} onPress={this.onClickPromoCode}>
                    <View style={styles.promoBox}>
                        <Text style={styles.promoCode}>{User.promo_code}</Text>
                    </View>
                </Button>
            </View>
        );
    }

    onClickPromoCode() {
        Clipboard.setString(User.promo_code);
        let toast = Toast.show('Copied', {
            duration: 400,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true
        });
    }

    renderSearchContainer() {
        return null;

        return (
            <View style={styles.searchContainer}>
                        
            </View>
        );
    }

    renderContactList() {
        return (
            <View style={styles.contactListContainer}>
                <AlphabetListView
                    data={this.state.contactData}
                    cell={this._renderContactCell}
                    cellHeight={55.0}
                    sectionListItem={this._renderContactSectionListItem}
                    sectionHeader={this._renderContactSectionHeader}
                    sectionHeaderHeight={19.0}
                    enableEmptySections={true}
                    updateScrollState={true}
                />
            </View>
        );
    }

    renderSyncButton() {
        var listItemStyle = {
            height: 55,
            borderColor: '#e0e0e0',
            marginLeft: 20
        };

        return (
            <Content style={{
                backgroundColor: '#ffffff',
                flex: 1
            }}>
                <List>
                    <ListItem style={listItemStyle}/>
                    <ListItem style={listItemStyle}/>
                    <ListItem style={listItemStyle}/>
                    <ListItem style={listItemStyle}/>
                    <ListItem style={listItemStyle}/>
                    <ListItem style={listItemStyle}/>
                    <ListItem style={listItemStyle}/>
                    <ListItem style={listItemStyle}/>
                    <ListItem style={listItemStyle}/>
                    <ListItem style={listItemStyle}/>
                </List>
            </Content>
        );
    }

    _renderContactCell(props) {
        const {item, isLast} = props;

        const isLoading = this.state.invitesLoading[item.phoneNumber] === true;
        const isInvited = this.state.invitesSent[item.phoneNumber] === true;

        leftContent = (
            <Button
                text={isInvited ? "👍" : (isLoading ? null : "INVITE")}
                containerStyle={[styles.sendButton, (isInvited || isLoading) && styles.sendButtonLoading]}
                textStyle={[styles.sendButtonText, isInvited && styles.sendButtonInvitedText]}
                onPress={this.onClickInvite.bind(this, item)}
                disabled={isLoading}
            >

                {!isInvited && isLoading && <ActivityIndicator/>}
            </Button>
        );

        return (
            <View style={styles.contactListCellContainer}>
                <View style={[styles.contactListCellContent, isLast && styles.contactListCellContentLast]}>
                    {leftContent}
                    <Text style={styles.contactNameText}>{item.fullName}</Text>
                    <Text style={styles.contactPhoneText}>{item.phoneNumber}</Text>
                </View>
            </View>
        );
    }

    _renderContactSectionListItem(props) {
        const {title} = props;

        return (
            <Text style={styles.contactListSectionListItemText}>{title}</Text>
        );
    }

    _renderContactSectionHeader(props) {
        const {title} = props;

        return (
            <View style={styles.contactListSectionHeader}>
                <Text style={styles.contactListSectionHeaderText}>{title}</Text>
            </View>
        );
    }

    onClickInvite(contact) {
        this.setInviteLoading(contact, true);

        var requestData = {
            "type": "sms",
            "recipients": [contact.phoneNumber]
        };

        HttpClientHelper.post('create_referrals', requestData, (error, data) => {
            this.setInviteLoading(contact, false);

            if (error) {
                console.log(error);
            } else if (!data.referrals[contact.phoneNumber].success) {
                console.log(data.referrals[contact.phoneNumber].error);
            } else {
                this.setInviteSent(contact, true);
            }
        });
    }

    setInviteLoading(contact, loading) {
        var invitesLoading = Object.assign({}, this.state.invitesLoading);
        invitesLoading[contact.phoneNumber] = loading;
        this.setState({invitesLoading});
    }

    setInviteSent(contact, loading) {
        var invitesSent = Object.assign({}, this.state.invitesSent);
        invitesSent[contact.phoneNumber] = loading;
        this.setState({invitesSent});
    }

    render() {
        return (
            <Container style={StyleSheet.flatten(styles.container)}>
                {this.renderHeader()}
                <StatusBar barStyle="light-content"/>
                <View style={styles.contentContainer}>
                    {this.renderInfoContainer()}
                    {this.renderSearchContainer()}
                    {this.state.contactData && this.renderContactList()}
                    {!this.state.contactData && this.renderSyncButton()}
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff'
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    infoContainer: {
        flex: 0,
        backgroundColor: '#5933af',
        padding: 15,
        paddingTop: 10
    },
    searchContainer: {
        flex: 0,
        height: 50,
        backgroundColor: '#ffffff'
    },
    contactListContainer: {
        flex: 1
    },
    mainDescription: {
        fontFamily: 'OpenSans',
        fontSize: 13,
        textAlign: 'center',
        color: '#ffffff'
    },
    promoBox: {
        borderWidth: 1,
        borderColor: '#311769',
        borderStyle: 'dashed',
        borderRadius: 4,
        alignSelf: 'center',
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10
    },
    promoCode: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 15,
        textAlign: 'center',
        color: '#ffffff'
    },
    contactListSectionHeader: {
        height: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#ececec',
        backgroundColor: '#f5f6f9'
    },
    contactListSectionHeaderText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 12,
        color: '#000000',
        opacity: 0.7,
        marginLeft: 13
    },
    contactListSectionListItemText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: (Metrics.screenHeight < 600 ? 9 : 11),
        color: '#999999'
    },
    contactListCellContainer: {
        height: 55,
        paddingLeft: 13,
        position: 'relative'
    },
    contactListCellContent: {
        padding: 10,
        paddingLeft: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f3f6'
    },
    contactListCellContentLast: {
        borderBottomWidth: 0
    },
    contactNameText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 15,
        color: '#000000',
        opacity: 0.9,
        marginLeft: 74
    },
    contactPhoneText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 12,
        color: '#000000',
        opacity: 0.6,
        marginLeft: 74
    },
    sendButton: {
        position: 'absolute',
        left: 0,
        top: 15,
        borderColor: '#5933af',
        borderWidth: 1,
        padding: 3,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 2,
        width: 62
    },
    sendButtonLoading: {
        borderWidth: 0
    },
    sendButtonText: {
        alignSelf: 'center',
        margin: 0,
        fontFamily: 'OpenSans-SemiBold',
        color: '#5933af'
    },
    sendButtonInvitedText: {
        fontSize: 26,
        marginTop: -7
    }
});

export default FreePress;
