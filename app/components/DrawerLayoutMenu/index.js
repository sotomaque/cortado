import React, { Component } from "react"

import { StyleSheet, Platform, DrawerLayoutAndroid, Dimensions, View } from "react-native"

import SideMenu from "./SlideMenu"
const deviceScreen = Dimensions.get('window');

class DrawerLayoutMenu extends Component {
  constructor() {
    super();
    this.state = {
      width: deviceScreen.width,
      height: deviceScreen.height,
    }
    this.isOpenMenu = false;
  }

  /**
   * Open menu
   * @return {Void}
   */
  openMenu(isOpen) {
    if(Platform.OS==='android') {
      if(isOpen) {
        this._drawer.openDrawer(0);
      } else {
        this._drawer.closeDrawer(0);
      }
    } else if(Platform.OS==='ios') {
      this._drawer.openMenu(isOpen);
    }
  }

  /**
   * Toggle menu
   * @return {Void}
   */
  toggle() {
    this.isOpenMenu = !this.isOpenMenu;
    this.openMenu(this.isOpenMenu);
  }

  render() {
    // const boundryStyle = this.props.menuPosition == MenuPosition.right ?
    //   {left: this.state.width - this.state.openMenuOffset} :
    //   {right: this.state.width - this.state.openMenuOffset} ;
    //
    // const menu = <View style={[styles.menu, boundryStyle]}>{this.props.menu}</View>;

    console.log('this.state.openMenuOffset='+this.props.openMenuOffset);

    if(Platform.OS==='ios') {
      return (
        <SideMenu
          menu={this.props.menu}
          ref={(ref) => this._drawer = ref}
          menuPosition={this.props.menuPosition}
          onChange={(isOpen) => {
            this.isOpenMenu = isOpen;
            this.props.onChange(isOpen)
          }}
          bounceBackOnOverdraw={this.props.bounceBackOnOverdraw}
          openMenuOffset={this.props.openMenuOffset}>
          {this.props.children}
        </SideMenu>
      );
    } else {
      return (
        <DrawerLayoutAndroid
          ref={(ref) => this._drawer = ref}
          onDrawerOpen={() => {
            this.isOpenMenu = true;
            this.props.onChange(true);
          }}
          onDrawerClose={() => {
            this.isOpenMenu = false;
            this.props.onChange(false);
          }}
          drawerWidth={this.props.openMenuOffset}
          drawerPosition={this.props.menuPosition==MenuPosition.left?DrawerLayoutAndroid.positions.Left:DrawerLayoutAndroid.positions.Right}
          renderNavigationView={()=>this.props.menu}>
          {this.props.children}
        </DrawerLayoutAndroid>
      );
    }
  }
}

export const MenuPosition = {
  left: 'left',
  right: 'right'
}

DrawerLayoutMenu.propTypes = {
  menuPosition: React.PropTypes.oneOf(['left', 'right', ]),
  onChange: React.PropTypes.func,
  openMenuOffset: React.PropTypes.number,
  bounceBackOnOverdraw: React.PropTypes.bool,
};

DrawerLayoutMenu.defaultProps = {
  openMenuOffset: deviceScreen.width * 2 / 3,
  onChange: () => {},
  menuPosition: MenuPosition.LEFT,
  bounceBackOnOverdraw: true,
};

export default DrawerLayoutMenu;
