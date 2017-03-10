import React from 'react';
import { Text, Image } from 'react-native'
import { Touchable } from '../'

class Button extends React.Component {
  render() {

    return <Touchable
      style={this.props.containerStyle}
      disabled={this.props.disabled}
      onPress={this.props.onPress}>
      {this.props.text!=undefined?<Text style={this.props.textStyle}>{this.props.text}</Text>:
      this.props.image&&<Image style={this.props.imageStyle} source={this.props.image}/>}
      {this.props.children}
    </Touchable>
  }
}

Button.propTypes = {
  onPress: React.PropTypes.func,
  text: React.PropTypes.string,
}

Button.defaultProps = {
  activeOpacity: 0.7,
  text: '',
  disabled: false,
}

export default Button;
