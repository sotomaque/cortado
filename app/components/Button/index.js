import React from 'react';
import { Text, Image } from 'react-native'
import { Touchable } from '../'

class Button extends React.Component {
    render() {

        var innerContent = null;
        if (this.props.text != undefined && this.props.text != null) {
            innerContent = (<Text style={this.props.textStyle}>{this.props.text}</Text>);
        } else if (this.props.image) {
            innerContent = (<Image style={this.props.imageStyle} source={this.props.image}/>);
        }

        return (
            <Touchable
                style={this.props.containerStyle}
                disabled={this.props.disabled}
                onPress={this.props.onPress}
            >
                {innerContent}
                {this.props.children}
            </Touchable>
        );
    }
}

Button.propTypes = {
    onPress: React.PropTypes.func,
    text: React.PropTypes.string,
    textStyle: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.number
    ])
}

Button.defaultProps = {
    activeOpacity: 0.7,
    text: '',
    disabled: false,
}

export default Button;
