import React from 'react';
import { View, ScrollView, TextInput, NetInfo, StyleSheet } from 'react-native';
import { Container, Content, ListItem, Left, Body, Right, Text, Header, Form, Item, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
import Stripe from 'react-native-stripe-api';

import * as Functions from '../../utils/Functions';
import Configs from '../../configs';
import Analytics from '../../utils/analytics';
import { PAYMENT_UPDATED } from '../../utils/analyticsEvents';
import { LiteCreditCardInput } from '../../components/CreditCardInput';
import { User } from '../../beans';
import { HttpClientHelper } from '../../libs';
import { Images, Metrics } from '../../themes';
import { Button } from '../../components';

const stripeClient = new Stripe(Configs.StripePublishableKey);

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f3f6'
    },
    content: {
        backgroundColor: '#f2f3f6',
        padding: 15,
    },
    label: {
        color: "black",
        fontSize: 12,
    },
    input: {
        fontSize: 16,
        fontFamily: 'OpenSans',
        color: "black",
    },
    card: {
        paddingTop: 7,
        paddingBottom: 5,
        marginTop: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        borderRadius: 2,
    },
    footer: {
        width: Metrics.screenWidth,
        position: 'absolute',
        bottom: 20,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    powered: {
        flexDirection: 'row',
        borderColor: '#565656',
        borderWidth: 1,
        padding: 4,
        borderRadius: 3
    }
});

class Payment extends React.Component {

    number_last4_placeholder = "";
    number_empty_placeholder = "1234 5678 1234 5678";

    constructor (props: Object) {
        super(props)
        this.state = {
            cardValid: false,
            loading: false,
            number_current_placeholder: this.number_empty_placeholder
        };
    }

    _onChange = (form) => {
        console.log(form);
        this.card = form;
        this.setState({
            cardValid: form.valid
        });
    };

    _onFocus = field => {
        if (field=='number') {
            this.setState({
                number_current_placeholder: this.number_empty_placeholder
            });
        }
    };

    updatePaymentLast4() {
        if (User.payment_last4 != null && User.payment_last4 != '') {
            this.number_last4_placeholder = "• • • •  • • • •  • • • • " + User.payment_last4;
        }
        if (this.number_last4_placeholder != '') {
            this.setState({
                number_current_placeholder: this.number_last4_placeholder
            });
        }
    }

    getPaymentInfoFromPress() {
        HttpClientHelper.get('payment', null, (error, data) => {
            if (!error) {
                const { last4 } = data;
                User.payment_last4 = last4;
                this.updatePaymentLast4();
            }
        });
    }

    async getPaymentToken() {
        let token = '';
        try {
            this.setState({loading: true});
            let expiry = this.card.values.expiry.split('/');
            const { id } = await stripeClient.createToken(this.card.values.number, expiry[0], expiry[1], this.card.values.cvc);
            token = id;
        } catch (e) {
            this.setState({loading: false});
            Functions.showAlert('', 'Error updating payment. Your card is invalid');
        }
        if (token == '' || token == null) {
            this.setState({loading: false});
            Functions.showAlert('', 'Error updating payment. Your card is invalid');
            return;
        } else {
            this.updatePayment(token);
        }
    }

    updatePayment(payment_token) {
        HttpClientHelper.put('payment', {payment_token}, (error, data) => {
            this.setState({loading: false});
            if (!error) {
                Analytics.sendEvent(PAYMENT_UPDATED);
                console.log('payment update', data);
                User.stripe_payment_token = payment_token;
                Actions.pop({refresh: {reload: true}});
            } else {
                Functions.showAlert('', error.error ? error.error : 'Error updating payment. Please try again later.');
            }
        });
    }

    handlePressSave() {
        if (this.state.cardValid) {
            this.getPaymentToken();
        }
    }

    componentDidMount() {
        this.updatePaymentLast4();
        this.getPaymentInfoFromPress();
    }

    renderHeader() {
        return (
            <Header style={{
                backgroundColor: '#fff',
                height: Metrics.navBarHeight,
                paddingBottom: 10,
                borderBottomColor: '#e0e0e0',
                borderBottomWidth: 1.0
            }}>
                <Button containerStyle={{width: 80, justifyContent: 'center'}} onPress={() => {
                    try {
                        Actions.pop();
                    } catch (e) {
                        console.log(e);
                    }
                }}>
                    <Text style={{
                        fontFamily: 'OpenSans-SemiBold',
                        color: '#565656',
                        fontSize: 14}}
                    >
                        Cancel
                    </Text>
                </Button>
                <Button containerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    padding: 5
                }}>
                    <Text style={{
                        fontFamily: 'OpenSans-SemiBold',
                        color: '#565656',
                        fontSize: 18
                    }}>
                        Payment
                    </Text>
                </Button>
                <Button onPress={() => this.handlePressSave()} containerStyle={{
                    width: 80,
                    alignItems: 'flex-end',
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        color: this.state.cardValid ? '#565656' : '#ccc',
                        fontSize: 14,
                        fontFamily: 'OpenSans-SemiBold'
                    }}>
                        Save
                    </Text>
                </Button>
            </Header>
        );
    }

    renderContent() {
        return (
            <View style={s.content}>
                <Text note style={{fontFamily: 'OpenSans', fontSize: 12, marginTop: 5}}>Keep a card on file.</Text>
                <Text note style={{fontFamily: 'OpenSans', fontSize: 12}}>You will not be charged until your orders are complete.</Text>
                <View style={s.card}>
                    <LiteCreditCardInput
                        ref={(ref)=>this.refs=ref}
                        // autoFocus
                        // requiresName
                        requiresCVC
                        labelStyle={s.label}
                        inputStyle={s.input}
                        validColor={"black"}
                        invalidColor={"red"}
                        placeholderColor={"darkgray"}
                        onFocus={this._onFocus}
                        onChange={this._onChange}
                        placeholders={{
                            number: this.state.number_current_placeholder,
                            expiry: "MM/YY",
                            cvc: "CVC",
                        }}
                    />

                </View>
                <Text style={{marginTop: 30, alignSelf: 'center', fontFamily: 'OpenSans'}} note>Available Credits</Text>
                <Text style={{marginTop: 2, alignSelf: 'center', fontSize: 35, fontFamily: 'OpenSans'}}>${User.total_free_credits}</Text>
                <View style={{marginTop: 30, flexDirection: 'row', alignSelf: 'center'}}>
                    <Text style={{fontSize: 13, fontFamily: 'OpenSans'}} note>Credits automatically applied.</Text>
                    <Text style={{fontSize: 13, fontFamily: 'OpenSans-SemiBold', color: '#555'}} onPress={()=>Actions.freePress()}> Earn more.</Text>
                </View>
            </View>
        );
    }

    renderFooter() {
        return (
            <View style={s.footer}>
                <View style={s.powered}>
                    <Text style={{fontSize: 13, color: '#565656'}}>Powered by </Text>
                    <Text style={{fontSize: 14, color: '#565656', fontWeight: 'bold'}}>stripe</Text>
                </View>
            </View>
        );
    }

    render () {
        return (
            <View style={s.container}>
                {this.renderHeader()}
                {this.renderContent()}
                {this.renderFooter()}
                <Spinner visible={this.state.loading} />
            </View>
        );
    }
}

module.exports = Payment;
