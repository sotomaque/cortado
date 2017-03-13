import React from 'react';
import { View, NativeModules, InteractionManager } from 'react-native';
import { Container, Content, ListItem, Text, Separator, CheckBox, Footer, FooterTab, Body, Input, Item, Button as MenuButton, Icon, Left, Right, Title, Header } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Button, Touchable, DrawerLayoutMenu } from '../../components';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from './styles';
import Notes from './Notes';
import LeftMenu from '../LeftMenu';
import Modal from 'react-native-simple-modal';
import { Metrics } from '../../themes'
const TimePicker = NativeModules.RNTimePicker;
import * as DataParser from '../../utils/DataParser';
import * as Functions from '../../utils/Functions';
import {Address, User} from '../../beans';
import { SessionManager, HttpClientHelper } from '../../libs';

export default class Presentation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      wf: false,
      dc: false,
      modal: false,
      pickup: null,
      dropoff: null,
      address: '',
      modal_title: '',
      modal_message: '',
      reload: false,
      availability: null,
      loading: false
    };
    this.services = '';
    this.handleOnPressPickUp = this.handleOnPressPickUp.bind(this);
    this.handleOnPressDropoff = this.handleOnPressDropoff.bind(this);
    this.handleOnPressWash = this.handleOnPressWash.bind(this);
    this.handleOnPressDryClean = this.handleOnPressDryClean.bind(this);
    this.handleOnPress = this.handleOnPress.bind(this);
  }

  componentDidMount() {
    this.getUserInfoFromPress();
  }

  componentDidUnMount() {
    SessionManager.saveUserInfo();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.reload) {
      this.setState({
        reload: !this.state.reload
      })
      InteractionManager.runAfterInteractions(() => {
        this.getUserInfoFromPress();
        if(nextProps.address_changed && (this.state.wf || this.state.dc)) {
          this.getAvailability();
        }
      });
    }
  }

  getUserInfoFromPress() {
    HttpClientHelper.get('me', null, (error, data)=>{
      if(!error) {
        DataParser.initializeUser(data);
        // console.log(DataParser.getUserInfo());
        let current_order = data.current_order;
        if(current_order!=null && current_order!=undefined && current_order!='') {
          DataParser.initCurrentOrder(current_order);
          InteractionManager.runAfterInteractions(() => {
            Actions.orderInProgress({type: ActionConst.REPLACE})
          });
        } else {
          this.setState({reload: !this.state.reload});
        }
      }
    })
  }

  checkAddress() {
    if(DataParser.getAddress()==='Set Address') {
      this.setState({
        modal: true,
        modal_message: 'Please set your address\nto continue.',
        modal_title: 'Set Address',
      })
      return false;
    }
    return true;
  }

  checkService() {
    if(!(this.state.wf || this.state.dc)) {
      this.setState({
        modal: true,
        modal_message: 'Please select at least one\nservice to continue.',
        modal_title: 'Select Services',
      })
      return false;
    }
    if(this.state.availability==null) {
      this.setState({loading: true});
      return false;
    }
    return true;
  }

  checkPickupTime() {
    if(!(this.state.pickup)) {
      this.setState({
        modal: true,
        modal_message: 'Please set a pickup time\nto continue.',
        modal_title: 'Set Pickup Time',
      })
      return false;
    }
    return true;
  }

  getTimeAstring(data, nodata) {
    if(data) {
      try {
        return data.date+", "+data.time;
      } catch (e) { }
    }
    return nodata;
  }

  handleOnPressWash = () => {
    if(!this.checkAddress()) return;
    this.setState({
      wf: !(this.state.wf)
    });
    this.getAvailability();
  }

  handleOnPressDryClean = () => {
    if(!this.checkAddress()) return;
    this.setState({
      dc: !(this.state.dc)
    });
    this.getAvailability();
  }

  getAvailability() {
    this.setState({availability: null});
    InteractionManager.runAfterInteractions(() => {
      this.services = '';
      if(!this.state.wf && !this.state.dc) {
        return;
      } else {
        if (this.state.wf && this.state.dc) {
          this.services = 'wnf,dc';
        } else if (this.state.wf) {
          this.services = 'wnf'
        } else {
          this.services = 'dc'
        }
        // console.log(this.services);
        HttpClientHelper.get('availability', {zipcode: Address.zipcode, services: this.services}, (error, data)=>{
          if(!error) {
            // console.log(data);
            this.setState({
              pickup: null,
              dropoff: null,
              availability: JSON.stringify(data)
            })
            if(this.state.loading==true) {
              this.setState({loading: false});
              InteractionManager.runAfterInteractions(() => {
                this.handleOnPressPickUp();
              });
            }
          }
        })
      }
    });
  }

  handleConfirmOrder() {
    this.setState({loading: true});
    Address.id = Address.address_id;
    let params = {
      address: DataParser.getAddressSerialize(),
      pickup_window: this.getTimeAstring(this.state.pickup),
      dropoff_window: this.getTimeAstring(this.state.dropoff),
      services: this.services,
      special_instructions: this.special_instructions.getText()
    }
    HttpClientHelper.post('order', params, (error, data)=>{
      this.setState({loading: false});
      if(!error) {
        this.getUserInfoFromPress();
      } else {
        Functions.showAlert('', 'Error during order creation. Please try again later');
      }
    })
  }

  handleOnPress() {
    if(DataParser.getAddress()==='Set Address') {
      Actions.setAddress();
      return;
    } else if(!(this.state.wf || this.state.dc)) {
      return;
    } else if(this.state.pickup===null) {
      this.handleOnPressPickUp();
      return;
    } else if(this.state.dropoff===null) {
      this.handleOnPressDropoff();
      return;
    } else if(User.stripe_payment_token=='' || User.stripe_payment_token==null) {
      Actions.payment();
      return;
    }
    this.handleConfirmOrder();
  }

  getCurrentDateSelected(data) {
    let currentDate = null;
    let currentTime = null;
    try {
        currentDate = data.date;
        currentTime = data.time;
    } catch (e) { }
    return {currentDate, currentTime};
  }

  handleOnPressDropoff() {
    if(!this.checkService() || !this.checkPickupTime() ) return;
    const {currentDate, currentTime} = this.getCurrentDateSelected(this.state.dropoff);
    TimePicker.show(currentDate, currentTime, this.state.availability, 'Set Dropoff Window', 'When should we drop off your clean clothes?', (error, data)=>{
      if(!error) {
        this.setState({
          dropoff: data
        });
      }
    });
  }

  handleOnPressPickUp() {
    if(!this.checkService()) return;
    const {currentDate, currentTime} = this.getCurrentDateSelected(this.state.pickup);
    TimePicker.show(currentDate, currentTime, this.state.availability, 'Set Pickup Window', 'When should we pick up your dirty clothes?', (error, data)=>{
      if(!error) {
        this.setState({
          pickup: data,
          dropoff: null
        });
      }
    });
  }

  getButtonNextTitle() {
    if(DataParser.getAddress()==='Set Address') {
      return "SET ADDRESS";
    } else if(!(this.state.wf || this.state.dc)) {
      return "SELECT SERVICE(S)";
    } else if(this.state.pickup===null) {
      return "SET A PICKUP TIME";
    } else if(this.state.dropoff===null) {
      return "SET A DROPOFF TIME";
    } else if(User.stripe_payment_token=='' || User.stripe_payment_token==null) {
      return "UPDATE PAYMENT";
    } else {
      return "CONFIRM ORDER";
    }
  }

  renderHeader() {
    return (
      <Header style={{backgroundColor: '#fff', height: Metrics.navBarHeight, paddingBottom: 3}}>
        <Button containerStyle={{width: 40, justifyContent: 'center'}} onPress={()=>this.toggleMenu()}>
          <Icon style={{color: '#565656'}} name='menu' />
        </Button>
        <Button containerStyle={{justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5}} onPress={()=>Actions.setAddress()}>
          <Text style={{marginTop: -2}} note>Delivering to</Text>
          <Text style={{color: '#565656', fontSize: 18, marginTop: -4}}>{DataParser.getAddress()}</Text>
        </Button>
        <Button containerStyle={{width: 40, alignItems: 'center', justifyContent: 'center'}}>
        </Button>
      </Header>
    );
  }

  renderContent() {
    return (<Content>
      <View style={styles.container}>
        <Separator boardered>
          <Text>Services (select all that apply)</Text>
        </Separator>
        <ListItem onPress={this.handleOnPressWash}>
          <CheckBox checked={this.state.wf} onPress={this.handleOnPressWash} style={{ borderColor: this.state.wf ? '#4B2D8F' : '#CCCCCC', backgroundColor: this.state.wf ? '#4B2D8F' : null }} />
          <Body>
            <Text>Wash & Fold</Text>
            <Text note>Everyday laundry. Returned neatly folded.</Text>
          </Body>
        </ListItem>
        <ListItem onPress={this.handleOnPressDryClean} last>
          <CheckBox checked={this.state.dc} onPress={this.handleOnPressDryClean} style={{ borderColor: this.state.dc ? '#4B2D8F' : '#CCCCCC', backgroundColor: this.state.dc ? '#4B2D8F' : null }} />
          <Body>
            <Text>Dry Cleaning</Text>
            <Text note>Delicate garments. Returned on hangers.</Text>
          </Body>
        </ListItem>
        <Separator bordered>
          <Text>Schedule</Text>
        </Separator>

        <ListItem onPress={()=>{
          GLOBAL.requestAnimationFrame(() => {
              this.handleOnPressPickUp();
          });
        }}>
          <Body>
              <Text style={{marginLeft: 0}} note>Pickup Time</Text>
              <Text style={{marginLeft: 0}}>{this.getTimeAstring(this.state.pickup, 'Set Pickup Time')}</Text>
          </Body>
        </ListItem>
        <ListItem onPress={()=>{
          GLOBAL.requestAnimationFrame(() => {
              this.handleOnPressDropoff();
          });
        }} last>
          <Body>
              <Text style={{marginLeft: 0}} note>Dropoff Time</Text>
              <Text style={{marginLeft: 0}}>{this.getTimeAstring(this.state.dropoff, 'Set Dropoff Time')}</Text>
          </Body>
        </ListItem>
        <Notes ref={(ref)=>this.special_instructions=ref} />
      </View>
    </Content>);
  }

  renderFooter() {
    let disabled = this.getButtonNextTitle()==='SELECT SERVICE(S)';
    return (<Footer style={{height: Metrics.navBarHeight}}>
        <Button
          disabled={disabled}
          onPress={this.handleOnPress}
          containerStyle={disabled?styles.buttonNextInActive:styles.buttonNext}
          textStyle={{color: '#fff', fontSize: 16}}
          text={this.getButtonNextTitle()}/>
    </Footer>);
  }

  renderModal() {
    return (<Modal
       offset={this.state.offset}
       open={this.state.modal}
       modalDidOpen={() => console.log('modal did open')}
       modalDidClose={() => this.setState({modal: false})}
       style={{alignItems: 'center'}}>
       <View>
          <Text style={{fontSize: 20, marginBottom: 10, alignSelf: 'center'}}>{this.state.modal_title}</Text>
          <Text style={{alignSelf: 'center', textAlign: 'center', fontSize: 16, color: '#565656'}}>{this.state.modal_message}</Text>
          <Button
            containerStyle={{marginTop: 5, backgroundColor: '#4b3486', padding: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20}}
            textStyle={{color: '#ffffff'}}
            onPress={() => this.setState({modal: false})}
            text="OK"/>
       </View>
    </Modal>);
  }

  toggleMenu() {
    this._drawer.toggle()
  }

  render() {
    let menu = <LeftMenu />
    let content = <Container>
     {this.renderHeader()}
     {this.renderContent()}
     {this.renderFooter()}
     {this.renderModal()}
     <Spinner visible={this.state.loading} />
   </Container>;

    return (<DrawerLayoutMenu
      menu={menu}
      menuPosition='left'
      ref={(ref) => this._drawer = ref}
      openMenuOffset={Metrics.screenWidth-80}>
        {content}
    </DrawerLayoutMenu>);
  }
}
