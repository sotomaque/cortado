import React from 'react';
import { View, NativeModules } from 'react-native';
import { Container, Content, ListItem, Text, Separator, CheckBox, Footer, FooterTab, Body, Input, Item, Button as MenuButton, Icon, Left, Right, Title, Header } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Button, Touchable, DrawerLayoutMenu } from '../../components';
import styles from './styles';
import Notes from './Notes';
import LeftMenu from '../LeftMenu';
import Modal from 'react-native-simple-modal';
import { Metrics } from '../../themes'
const TimePicker = NativeModules.RNTimePicker;

export default class Presentation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      wf: false,
      dc: false,
      modal: false,
    };
    this.handleOnPressPickUp = this.handleOnPressPickUp.bind(this);
    this.handleOnPressDropoff = this.handleOnPressDropoff.bind(this);
  }

  handleOnPressWash = () => {
    this.setState({
      wf: !(this.state.wf)
    });
  }

  handleOnPressDryClean = () => {
    this.setState({
      dc: !(this.state.dc)
    });
  }

  handleOnPress = () => {
    var services = '';
    if (this.state.wf && this.state.dc) {
      services = 'wnf,dc';
    } else if (this.state.wf) {
      services = 'wnf'
    } else {
      services = 'dc'
    }
    console.log(services);

    // Actions.getAvailability(services);
    // Actions.getWorld();
    //NavigationActions.orderInProgress();
  }

  handleOnPressDropoff() {
    // this.setState({modal: !(this.state.modal)});
    TimePicker.show(null, null, 'Set Dropoff Window', 'When should we drop off your clean clothes?', (error, data)=>{

    });

  }

  handleOnPressPickUp() {
    // this.setState({modal: !(this.state.modal)});
    TimePicker.show(null, null, 'Set Pickup Window', 'When should we pick up your dirty clothes?', (error, data)=>{

    });
  }

  renderHeader() {
    return (
      <Header style={{backgroundColor: '#fff', height: Metrics.navBarHeight, paddingBottom: 3}}>
        <Button containerStyle={{width: 40, justifyContent: 'center'}} onPress={()=>this.toggleMenu()}>
          <Icon style={{color: '#565656'}} name='menu' />
        </Button>
        <Button containerStyle={{justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5}} onPress={()=>Actions.setAddress()}>
          <Text style={{marginTop: -2}} note>Delivering to</Text>
          <Text style={{color: '#565656', fontSize: 18, marginTop: -4}}>Set Address</Text>
        </Button>
        <Button containerStyle={{width: 40, alignItems: 'center', justifyContent: 'center'}}>
        </Button>
      </Header>
    );
  }

  renderFooter() {
    return (<Footer>
        <Button
          disabled={!(this.state.wf || this.state.dc)}
          onPress={this.handleOnPress}
          containerStyle={{justifyContent: 'center'}}
          textStyle={{color: '#fff'}}
          text="Select Service(s)"/>
    </Footer>);
  }

  renderContent() {
    return (<Content>
      <View style={styles.container}>
        <Separator boardered>
          <Text>Services (select all that apply)</Text>
        </Separator>
        <ListItem>
          <CheckBox checked={this.state.wf} onPress={this.handleOnPressWash} />
          <Body>
            <Text>Wash & Fold</Text>
            <Text note>Everyday laundry. Returned neatly folded.</Text>
          </Body>
        </ListItem>
        <ListItem>
          <CheckBox checked={this.state.dc} onPress={this.handleOnPressDryClean} />
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
              <Text note>Pickup Time</Text>
              <Text>Set Pickup Time</Text>
          </Body>
        </ListItem>
        <ListItem onPress={()=>{
          GLOBAL.requestAnimationFrame(() => {
              this.handleOnPressDropoff();
          });
        }}>
          <Body>
              <Text note>Dropoff Time</Text>
              <Text>Set Dropoff Time</Text>
          </Body>
        </ListItem>
        <Notes />
      </View>
    </Content>);
  }

  renderModal() {
    return (<Modal
       offset={this.state.offset}
       open={this.state.modal}
       modalDidOpen={() => console.log('modal did open')}
       modalDidClose={() => this.setState({open: false})}
       style={{alignItems: 'center'}}>
       <View>
          <Text style={{fontSize: 20, marginBottom: 10}}>Hello world!</Text>
          <Button
            containerStyle={{margin: 5}}
            onPress={() => this.setState({offset: -100})}
            text="Move modal up"/>
          <Button
            containerStyle={{margin: 5}}
            onPress={() => this.setState({offset: 0})}
            text="Reset modal position"/>
          <Button
            containerStyle={{margin: 5}}
            onPress={() => this.setState({modal: false})}
            text="Close modal"/>
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
     {this.renderModal()}
     {this.renderFooter()}
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
