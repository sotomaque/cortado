import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Metrics, Colors, Images } from '../../themes';
import { Button } from '../../components';

export default class NavigationBar extends React.Component {
  render() {
    <View style={styles.container}>
      <Button
        containerStyle={styles.buttonMenuBar}
        imageStyle={styles.iconMenuBar}
        image={Images.logo2}
        onPress={()=>{
          alert(1);
        }}/>
        <View style={{flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Delivering to</Text>
          <Text>Address</Text>
        </View>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    width: Metrics.screenWidth,
    height: Metrics.navBarHeight,
    backgroundColor: Colors.snow,
    flexDirection: 'row',
  },
  buttonMenuBar: {
    width: Metrics.navBarHeight,
    height: Metrics.navBarHeight
  },
  iconMenuBar: {

  }
})
