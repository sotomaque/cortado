import React from 'react';
import { View, StyleSheet, InteractionManager } from 'react-native';
import { Container, Content, ListItem, Left, Body, Right, Text, List } from 'native-base';
import { Metrics } from '../../themes';
import { NavigationBar } from '../../components';
import { HttpClientHelper } from '../../libs';
import Spinner from 'react-native-loading-spinner-overlay';

class Pricing extends React.Component {

	items = [];
	static data = [];

	constructor(props) {
		super(props);
		this.state = {
			reload: false,
			loading: false,
		};
		this.renderRow = this.renderRow.bind(this);
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.getPricing();
		});
	}

	processData() {
		let data = Pricing.data;
		for(let i in data) {
			let group_products = data[i];
			let is_hidden = group_products.is_hidden;
			if(is_hidden) continue; // ignore hidden item
			let products = group_products.products;
			let name = group_products.name;
			let header_item = {
				type: 'header',
				name: name,
				price: '',
			}
			this.items.push(header_item) // add header item
			for(let j in products) {
				let item = {
					type: 'item',
					name: products[j]['name'],
					price: products[j]['price_string'],
				}
				this.items.push(item)
			}
		}
		this.setState({reload: !this.state.reload});
	}

	getPricing() {
		if(Pricing.data!=undefined && Pricing.data.length>0) {
			this.processData();
		} else {
			this.setState({loading: true});
		}

		HttpClientHelper.get('pricing', null, (error, data)=>{
			this.setState({loading: false});
			if(!error) {
				Pricing.data = data;
				InteractionManager.runAfterInteractions(() => {
					this.processData();
				});
			} else {
			}
		})
	}

	renderRow(data, section, id, highlight) {
		let nextData = this.items[parseInt(id)+1];
		let isLastItem = nextData==undefined || nextData.type==='header';
		if(data.type==='item') {
			return (
				<ListItem last={isLastItem}>
						<Body>
							<Text>{data.name}</Text>
						</Body>
						<Right>
							<Text>${data.price}</Text>
						</Right>
				</ListItem>
			)
		} else {
			return (
				<ListItem itemDivider>
						<Text>{data.name}</Text>
				</ListItem>
			)
		}
	}

	render() {
    return (
      <Container>
				<NavigationBar title='Pricing' />
        <Content>
					<List dataArray={this.items} renderRow={this.renderRow} />
        </Content>
				<Spinner visible={this.state.loading} />
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
