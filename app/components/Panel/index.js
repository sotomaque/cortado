import React from 'react';
import { View } from 'react-native';


class Panel extends React.Component {
    render() {
        return <View
            elevation={1}
            style={{
                borderRadius: 6,
                padding: 25,
                backgroundColor: '#FFFFFF',
                borderWidth: 1.0,
                borderColor: '#E0E0E0',
                margin: 3,
                shadowColor: '#000000',
                shadowOffset: {
                    width: 0,
                    height: 2
                },
                shadowRadius: 6,
                shadowOpacity: 0.05
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
