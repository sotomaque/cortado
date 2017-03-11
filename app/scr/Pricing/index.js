import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Content, ListItem, Left, Body, Right, Text } from 'native-base';
import { Metrics } from '../../themes';
import { NavigationBar } from '../../components';

class Pricing extends React.Component {
	render() {
        return (
            <Container>
							<NavigationBar title='Pricing' />
            	<View style={styles.container}>
	                <Content>
	                    <ListItem itemHeader first>
	                        <Text>Popular</Text>
	                    </ListItem>

	                    <ListItem >
	                    	<Body>
	                        	<Text>Dry Cleaned Blouse</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$7.99</Text>
	                        </Right>
	                    </ListItem>
	                     <ListItem >
	                    	<Body>
	                        	<Text>Dry Cleaned Pants</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$7.99</Text>
	                        </Right>
	                    </ListItem>
	                     <ListItem >
	                    	<Body>
	                        	<Text>Laurndered & Pressed - Shirt</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$2.99</Text>
	                        </Right>
	                    </ListItem>
	                      <ListItem >
	                    	<Body>
	                        	<Text>Semester Subscription</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$345.00</Text>
	                        </Right>
	                    </ListItem>
	                     <ListItem >
	                    	<Body>
	                        	<Text>Wash & Fold Per LB - Regular</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$1.99</Text>
	                        </Right>
	                    </ListItem>


	                    <ListItem itemHeader>
	                        <Text>Wash and Fold</Text>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Per LB</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$1.99</Text>
	                        </Right>
	                    </ListItem>

	                    <ListItem itemHeader>
	                        <Text>Dry Cleaning</Text>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Belts</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$4.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Blouses</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$7.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Cardigans</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$7.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Coats</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$15.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Coats - Long</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$21.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Cummberbun</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$5.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Dresses</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$13.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Fux Leather Jackets</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$45.00</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Hats</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$7.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Jackets - Light</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$8.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Jackets - Medium</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$12.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Jackets - Suit</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$7.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Jeans</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$7.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Jumpsuit - Rompers</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$11.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Laundered & Pressed Shirts</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$2.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Leather Jackets</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$64.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Night Gown</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$12.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Pants</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$7.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Jackets - Light</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$8.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Polos</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$7.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Robes</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$15.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Scarfs</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$7.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Shirts - Button Down</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$7.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Shorts</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$7.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Skirts</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$7.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Socks</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$5.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Suit (2-piece)</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$15.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Suit (3-piece)</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$23.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Sweater</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$7.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Ties</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$4.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Tuxedos (2-piece)</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$19.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Uniforms</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$15.99</Text>
	                        </Right>
	                    </ListItem>
	                    <ListItem >
	                    	<Body>
	                        	<Text>Vests</Text>
	                        </Body>
	                        <Right>
	                        	<Text>$7.99</Text>
	                        </Right>
	                    </ListItem>

	                </Content>
	            </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
	container: {
      flex: 1
    },
});

export default Pricing
