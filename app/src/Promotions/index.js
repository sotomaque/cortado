import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Container, Content, Item, Input, Header } from 'native-base'
import { Metrics } from '../../themes'
import { NavigationBar, Button } from '../../components';
import { User } from '../../beans';
import { Actions } from 'react-native-router-flux';
import { HttpClientHelper } from '../../libs';
import * as DataParser from '../../utils/DataParser';
import * as Functions from '../../utils/Functions';
import Spinner from 'react-native-loading-spinner-overlay';

class Promotion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            loading: false
        }
        this.refreshUser = this.refreshUser.bind(this);
    }

    refreshUser() {
        HttpClientHelper.get('world', null, (error, data) => {
          if (!error) {
            try {
              let user = data.user;
              if (user) {
                user.intercom_enabled = data.intercom_enabled;
                DataParser.initializeUser(user);
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            console.log(error);
          }
        });
    }

    handleSubmit() {
        if (!Functions.validateForm('Promotion code', this.state.code))
            return;

        let params = {
            url_params: {
                code: this.state.code,
            }
        }

        this.setState({loading: true});
        HttpClientHelper.post('promotion', params, (error, params) => {
            this.setState({loading: false});
            if (!error) {
                Functions.showAlert('', 'Promotion applied successfully.');
                this.refreshUser();
            } else {
                Functions.showAlert('', error.error ? error.error : 'Your promo code is invalid. Please try again');
            }
        });
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
            <Button containerStyle={{width: 80, justifyContent: 'center'}} onPress={()=>{
              try {
                Actions.pop();
              } catch (e) {
                console.log(e);
              }
            }}>
              <Text style={{fontFamily: 'OpenSans-SemiBold', color: '#565656', fontSize: 14}}>Cancel</Text>
            </Button>
            <Button containerStyle={{justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5}}>
              <Text style={{color: '#565656', fontSize: 18, fontFamily: 'OpenSans-SemiBold', }}>Promotions</Text>
            </Button>
            <Button containerStyle={{width: 80, alignItems: 'flex-end', justifyContent: 'center'}} onPress={()=>this.handleSubmit()}>
              <Text style={{color: this.state.code ?'#565656':'#ccc', fontSize: 14, fontFamily: 'OpenSans-SemiBold'}}>Save</Text>
            </Button>
          </Header>
        );
    }

    render() {
        return (
            <Container style={{backgroundColor: '#f2f3f6'}}>
                {this.renderHeader()}
                <Content style={{marginBottom: Metrics.navBarHeight}} scrollEnabled={false}>
                    <Item style={{marginTop: 20, borderWidth: 1, borderColor: '#f3f3f3', backgroundColor: '#fff'}}>
                        <Input
                            style={{fontFamily: 'OpenSans', textAlign: 'center', color: '#171717', backgroundColor: '#fff', opacity: 0.7}}
                            placeholder='Enter Promo Code'
                            value={this.state.code}
                            onChangeText={(val) => this.setState({code: val})}
                        />
                    </Item>
                    <View ref='text' style={styles.text}>
                        <Text style={{fontFamily: 'OpenSans', alignSelf: 'center', color: '#aaa'}} note>You have ${User.total_free_credits} of available credit.</Text>
                    </View>
                </Content>
                <Spinner visible={this.state.loading} />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        marginTop: 10,
        padding: 10,
        alignSelf: 'center',
        justifyContent: 'center'
    }
});

export default Promotion;
