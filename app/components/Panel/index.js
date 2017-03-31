import React from 'react';
import { View } from 'react-native';


class Panel extends React.Component {
  render() {
    return <View
      elevation={1}
      style={{
        borderRadius: 6,
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 0.5,
        borderColor: '#E0E0E0',
        margin: 3
      }}>
      {this.props.children}
    </View>
  }
}

Panel.propTypes = {

}

Panel.defaultProps = {

}

export default Panel;
