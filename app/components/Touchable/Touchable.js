import React from "react"
import { Platform, TouchableOpacity } from "react-native"

const Touchable = (props) => {
  return <TouchableOpacity activeOpacity={props.disabled?1:props.activeOpacity} onPress={()=>{
    this.requestAnimationFrame(() => {
      if(props.onPress!=undefined && !props.disabled) {
        props.onPress();
      }
    });
  }} style={props.style}>
    {props.children}
  </TouchableOpacity>
}

Touchable.propTypes = {
  onPress: React.PropTypes.func,
  activeOpacity: React.PropTypes.number
}

Touchable.defaultProps = {
  activeOpacity: 0.7,
  disabled: false
}

export default Touchable;
