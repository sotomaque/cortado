import React from 'react';
import { View } from 'react-native';
import { Container, Content, Body, ListItem, Text, CheckBox, Footer, FooterTab, Header, Icon, Input, Item } from 'native-base';
import StarRating from 'react-native-star-rating';
import { Button } from '../../components';
import { Metrics } from '../../themes';
import { HttpClientHelper } from '../../libs';
import { Order } from '../../beans';
import { Actions, ActionConst } from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';

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
      if(!error) {
        Actions.presentation({type: ActionConst.REPLACE})
      } else {

      }
    });
  }

  render() {
    return <Container>
      <Content style={{marginBottom: Metrics.navBarHeight}}>
        <View style={{backgroundColor: '#f2f2f2', padding: 20, paddingBottom: 10, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: '#565656'}}>ORDER SUMMARY</Text>
          <Text style={{fontSize: 40, padding: 10}}>{Order.total_price_string!=null && Order.total_price_string!=undefined && Order.total_price_string!=''?Order.total_price_string:'$0.00'}</Text>
          <Text note>*You will receive an itemized receipt via email.</Text>
        </View>
        <View style={{padding: 30, paddingBottom: 10, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: '#565656'}}>RATE YOUR EXPERIENCE</Text>
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
                emptyStarColor={'#ccc'}
                starColor={'#6e279f'}/>
          </View>
        </View>
        <View style={{padding: 20}}>
          <View style={{minHeight: 80, borderColor: '#f0f0f0', borderWidth: 1, borderRadius: 1, backgroundColor: '#f2f2f2', paddingLeft: 10, paddingRight: 10}}>
            <Input
              placeholder='Optional Feedback'
              multiline={true}
              singleline={false}
              autoCorrect={false}
              maxLength={400}
              value={this.state.feedback}
              onChangeText={(feedback) => this.setState({feedback})} />
          </View>
        </View>
      </Content>
      <Button
        disabled={this.state.score==0}
        containerStyle={{position: "absolute", height: 50, left: 10, bottom: 10, right: 10, backgroundColor: this.state.score==0?'#999':'#000', borderRadius: 3, alignItems: 'center', justifyContent: 'center'}}
        text="SUBMIT"
        textStyle={{color: '#fff', fontSize: 16}}
        onPress={()=>this.handleSubmit()}
      />
      <Spinner visible={this.state.loading} />
    </Container>
  }
}
