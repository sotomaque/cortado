import React from 'react';
import { View } from 'react-native';
import { Container, Content, Body, ListItem, Text, CheckBox, Footer, FooterTab, Header, Icon, Input, Item } from 'native-base';
import StarRating from 'react-native-star-rating';
import { Actions, ActionConst } from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';

import { Button } from '../../components';
import { Metrics } from '../../themes';
import { HttpClientHelper } from '../../libs';
import { Order } from '../../beans';


export default class OrderRating extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            score: 0,
            feedback: '',
            loading: false
        };
    }

    handleSubmit() {
        this.setState({loading: true});
        let params = {
            url_params: {
                order_id: Order.order_id
            },
            rating: this.state.score,
            feedback: this.state.feedback
        }
        HttpClientHelper.post('order_rating', params, (error, data)=>{
            this.setState({loading: false});
            if (!error) {
                Actions.presentation({type: ActionConst.REPLACE})
            } else {

            }
        });
    }

    render() {
        return <Container>
            <Content style={{marginBottom: Metrics.navBarHeight}}>
                <View style={{backgroundColor: '#f2f3f6', padding: 20, paddingBottom: 10, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#333', fontFamily: 'OpenSans-SemiBold', fontSize: 20}}>Order Summary</Text>
                    <Text style={{fontSize: 40, padding: 10, fontFamily: 'OpenSans'}}>{Order.total_price_string!=null && Order.total_price_string!=undefined && Order.total_price_string!=''?Order.total_price_string:'$0.00'}</Text>
                    <Text style={{fontFamily: 'OpenSans'}} note>*You will receive an itemized receipt via email.</Text>
                </View>
                <View style={{padding: 30, paddingBottom: 10, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#aaa', fontFamily: 'OpenSans'}}>Rate your experience</Text>
                    <View style={{width: 260, padding: 5}}>
                        <StarRating
                            style={{backgroundColor: 'transparent'}}
                            emptyStar={'ios-star-outline'}
                            fullStar={'ios-star'}
                            halfStar={'ios-star-half'}
                            iconSet={'Ionicons'}
                            maxStars={5}
                            rating={this.state.score}
                            starSize={45}
                            selectedStar={(score) => {
                                this.setState({score})
                            }}
                            emptyStarColor={'#e0e0e0'}
                            starColor={'#694CB5'}/>
                    </View>
                </View>
                <View style={{padding: 20}}>
                    <View style={{minHeight: 80, borderColor: '#e0e0e0', borderWidth: 1, borderRadius: 1, backgroundColor: '#f2f3f6', paddingLeft: 10, paddingRight: 10}}>
                        <Input
                            placeholder='Optional Feedback'
                            multiline={true}
                            singleline={false}
                            autoCorrect={false}
                            maxLength={400}
                            value={this.state.feedback}
                            style={{fontFamily: 'OpenSans', fontSize: 14, lineHeight: 20}}
                            onChangeText={(feedback) => this.setState({feedback})} />
                    </View>
                </View>
            </Content>
            <Button
                disabled={this.state.score==0}
                containerStyle={{position: "absolute", height: 50, left: 20, bottom: 20, right: 20, marginTop: 10, backgroundColor: this.state.score == 0 ? '#ddd':'#4B2D8F', borderRadius: 3, alignItems: 'center', justifyContent: 'center'}}
                text="Submit"
                textStyle={{color: '#fff', fontSize: 16, fontFamily: 'OpenSans-Bold'}}
                onPress={()=>this.handleSubmit()}
            />
            <Spinner visible={this.state.loading} />
        </Container>
    }
}
