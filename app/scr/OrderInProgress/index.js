import React from 'react'
import { View, StyleSheet, Linking, ListView, Image, InteractionManager } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { Actions, ActionConst } from 'react-native-router-flux';
import call from 'react-native-phone-call'
import { Container, Content, Body, ListItem, Text, CheckBox, Footer, FooterTab, Header, Icon } from 'native-base';
import {Address, User, Order} from '../../beans';
import * as DataParser from '../../utils/DataParser';
import { Fonts, Metrics, Colors, Images } from '../../themes';
import { Button, DrawerLayoutMenu } from '../../components';
import { HttpClientHelper } from '../../libs';
import LeftMenu from '../LeftMenu';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-simple-modal';
import Geocoder from 'react-native-geocoder';
import Intercom from 'react-native-intercom';
import Configs from '../../configs';

const args = {
  number: Configs.SupportNumber, // String value with the number to call
  prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call
}

class OrderInProgress extends React.Component {

  autoRequestLocation = null;

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.initData();
    let lat = Configs.defaultLocation.lat;
    let lng = Configs.defaultLocation.lng;

    if(Address.latitude!=0 || Address.longitude!=0) {
      lat = Address.latitude;
      lng = Address.longitude;
    }
    this.state = {
      InProgress: true,
      Pickup: false,
      Cleaning: false,
      Delivery: false,
      loading: false,
      modal: false,
      dataSource: this.ds.cloneWithRows(this.data),
      latitude: lat,
      longitude: lng,
    };

    this.renderRow = this.renderRow.bind(this);
  }

  initData() {
    this.data = [
      ['Order Confirmed', '', DataParser.getCurrentOrderStatus()>=Order.CONFIRMED],
      ['Pickup', Order.pickup_date_string, DataParser.getCurrentOrderStatus()>=Order.PICKUP],
      ['Cleaning', '', DataParser.getCurrentOrderStatus()>=Order.CLEANING],
      ['Delivery', Order.dropoff_date_string, DataParser.getCurrentOrderStatus()>=Order.DELIVERY]
    ]

    if(DataParser.getCurrentOrderStatus()>=Order.COMPLETE) {
      InteractionManager.runAfterInteractions(() => {
        Actions.orderRating({type: ActionConst.REPLACE});
      })
    }
  }

  componentDidMount() {
    this.updateOrderProgress();
    this.registerIntercom();
    this.requestLocation();
  }

  componentWillUnmount() {
    if(this.timer!=null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  componentWillMount() {
    if(this.timer!=null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.timer = setTimeout(()=>this.updateOrderProgress(), Configs.OrderUpdateTime);
  }

  async registerIntercom() {
    Intercom.registerIdentifiedUser({ userId: ""+User.user_id })
    .then(() => {
    	console.log('registerIdentifiedUser done');

    	return Intercom.updateUser({
    		email: User.email
    	});
    })
    .catch((err) => {
    	console.log('registerIdentifiedUser ERROR', err);
    });
  }

  timer = null;
  updateOrderProgress() {
    HttpClientHelper.get('world', {}, (error, data)=>{
      if(!error) {
        let current_order = data.current_order;
        if(current_order!=null && current_order!=undefined && current_order!='') {
          DataParser.initCurrentOrder(current_order);
        }
        if(data.order_phase)
          DataParser.updateCurrentOrderStatus(data.order_phase)
        this.initData();
        this.setState({dataSource: this.ds.cloneWithRows(this.data)});
      }
    })
    if(this.timer!=null) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(()=>this.updateOrderProgress(), Configs.OrderUpdateTime);
  }

  handleCancelPress() {
    this.setState({loading: true});
    HttpClientHelper.delete('order', null, (error, data)=>{
      this.setState({loading: false});
      if(!error) {
        Actions.presentation({type:ActionConst.REPLACE});
      } else {
        Functions.showAlert('', error.error?error.error:'Cannot cancel the order');
      }
    })
  }

  getRegion() {
    return {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004
    };
  }

  getAddress() {
    let address = Address.street;
    if(address!='' && address!=undefined) {
      if(Address.zipcode!='' && Address.zipcode!=undefined) {
        address = address+", "+ Address.zipcode
      }
    } else {
      address = Address.zipcode;
    }
    return address;
  }

  requestLocation() {
    this.clearRequest();
    if(Address.street=='' && Address.zipcode=='') return;
    this.autoRequestLocation = setTimeout(()=>{
      try {
        console.log('address', this.getAddress());
        Geocoder.geocodeAddress(this.getAddress()).then(res => {
          console.log(res);
          try {
            let address = res[0];
            let location = address.position;
            this.setState({
              latitude: location.lat,
              longitude: location.lng,
            });
            this.animatedToRegion();
          } catch (e) {
              console.log(e);
          }
        })
        .catch(err => console.log(err));
        this.clearRequest();
      } catch (e) { }
    }, 300);
  }

  clearRequest() {
    try {
      if(this.autoRequestLocation!=null) {
        clearTimeout(this.autoRequestLocation);
        this.autoRequestLocation = null;
      }
    } catch (e) { console.log(e); }
  }

  animatedToNewRegion() {
    if(this.map!=undefined)
      this.map.animateToRegion(this.getRegion());
  }

  renderHeader() {
    let canNotCancel = DataParser.getCurrentOrderStatus()>=Order.PICKUP;
    return (
      <Header style={{backgroundColor: '#fff', height: Metrics.navBarHeight, paddingBottom: 3}}>
        <Button containerStyle={{width: 50, justifyContent: 'center'}} onPress={()=>this.toggleMenu()}>
          <Icon style={{color: '#565656'}} name='menu' />
        </Button>
        <Button containerStyle={{justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5}}>
          <Text style={{marginTop: -3, backgroundColor: 'transparent'}} note>Delivering to</Text>
          <Text style={{color: '#565656', fontSize: 17, marginTop: -4, backgroundColor: 'transparent'}}>{DataParser.getAddress()}</Text>
        </Button>
        <Button disabled={canNotCancel} containerStyle={{width: 50, justifyContent: 'center', alignItems: 'flex-end'}} onPress={()=>this.setState({modal: true})}>
          <Text style={{color: canNotCancel?'#ccc':'#565656', fontSize: 14}}>Cancel</Text>
        </Button>
      </Header>
    );
  }

  renderFooter() {
    return (
      <Footer style={{backgroundColor: '#ffffff', height: Metrics.navBarHeight}}>
        <Button
          containerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          text="Chat Support"
          onPress={() => {
            GLOBAL.requestAnimationFrame(() => {
              Intercom.displayMessageComposer();
            });
          }}/>
        <View style={{width: 1, height: Metrics.navBarHeight, backgroundColor: '#f2f2f2'}}/>
        <Button
          containerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          text="Phone Support"
          onPress={() => call(args).catch(console.error)}/>
      </Footer>
    )
  }

  renderModal() {
    return (<Modal
       offset={this.state.offset}
       open={this.state.modal}
       modalDidOpen={() => console.log('modal did open')}
       modalDidClose={() => this.setState({modal: false})}
       style={{alignItems: 'center'}}>
       <View>
          <Text style={{fontSize: 20, marginBottom: 10, alignSelf: 'center'}}>Cancel Order?</Text>
          <Text style={{alignSelf: 'center', textAlign: 'center', fontSize: 16, color: '#565656'}}>{`Are you sure you want to\ncancel current order?`}</Text>
          <Button
            containerStyle={{backgroundColor: '#4b3486', padding: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20}}
            textStyle={{color: '#ffffff'}}
            onPress={() => {
              this.setState({modal: false});
              this.handleCancelPress();
            }}
            text="CANCEL ORDER"/>
          <Button
            containerStyle={{marginTop: 5, backgroundColor: '#4b3486', padding: 10, justifyContent: 'center', alignItems: 'center'}}
            textStyle={{color: '#ffffff'}}
            onPress={() => this.setState({modal: false})}
            text="OK"/>
       </View>
    </Modal>);
  }

  renderRow(rowData, sectionID, rowID, highlightRow) {
    const total = this.state.dataSource.getRowCount();
    let topLineStyle = undefined;
    let bottomLineStyle = undefined;

    if(rowData[2]) {
      topLineStyle = styles.topLineActive;
      let nextRow = this.data[parseInt(rowID)+1];
      if(nextRow!=undefined) {
        if(nextRow[2]) {
          bottomLineStyle = styles.bottomLineActive;
        } else {
          bottomLineStyle = styles.bottomLine;
        }
      } else {
        bottomLineStyle = styles.bottomLineActive;
      }
    } else {
      topLineStyle = styles.topLine;
      bottomLineStyle = styles.bottomLine;
    }
    topLineStyle = rowID == 0 ? [topLineStyle, styles.hiddenLine] : topLineStyle;
    bottomLineStyle = rowID == total - 1 ? [bottomLineStyle, styles.hiddenLine] : bottomLineStyle;

    return (
      <View style={styles.row}>
        <View style={styles.timeline}>
          <View style={styles.line}>
            <View style={topLineStyle} />
            <View style={bottomLineStyle} />
          </View>
          <View style={rowData[2]?styles.dotActive:styles.dot} >
            {rowData[2]&&<Image source={Images.check} style={{width: 10, height: 10, margin: 4, resizeMode: 'contain'}} />}
          </View>
        </View>
        <View style={styles.content}>
          <Text style={{fontSize: 18}}>{rowData[0]}</Text>
          {rowData[1]!=''&&<Text style={{marginTop: -1}} note>{rowData[1]}</Text>}
        </View>
      </View>
    );
  }

  toggleMenu() {
    this._drawer.toggle()
  }

  render () {
    let menu = <LeftMenu />
    let content = <Container style={{backgroundColor: '#fff'}}>
      {this.renderHeader()}
      <Content>
        <MapView
          ref={ref => { this.map = ref; }}
          style={styles.mapView}
          region={this.getRegion()}>
          <MapView.Marker
            pinColor="#4b3486"
            coordinate={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
            }}
            title={"My location"}
            description={Address.street+", "+Address.zipcode}
          />
        </MapView>
        <ListView style={styles.listView}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}/>
      </Content>
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

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    mapView: {
      height: 200,
      width: (Metrics.screenWidth)
    },
    buttons: {
      position: 'absolute',
      bottom: 0
    },
    listView: {
      flex: 1,
      paddingTop: 10,
      paddingLeft: 15
    },
    row: {
      padding: 12,
      paddingLeft: 5
    },
    content: {
      marginLeft: 40,
    },
    timeline: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: 40,
      justifyContent: 'center', // center the dot
      alignItems: 'center',
    },
    line: {
      position: 'absolute',
      top: 0,
      left: 18,
      width: 4,
      bottom: 0,
    },
    topLine: {
      flex: 1,
      width: 3,
      backgroundColor: '#ccc',
    },
    bottomLine: {
      flex: 1,
      width: 3,
      backgroundColor: '#ccc',
    },
    topLineActive: {
      flex: 1,
      width: 3,
      backgroundColor: '#51bd2b',
    },
    bottomLineActive: {
      flex: 1,
      width: 3,
      backgroundColor: '#51bd2b',
    },
    hiddenLine: {
      width: 0,
    },
    dot: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: '#ccc',
    },
    dotActive: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: '#51bd2b',
    },
});

export default OrderInProgress;
