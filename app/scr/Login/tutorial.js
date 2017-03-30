import Swiper from 'react-native-swiper';
import React, { Component} from 'react';
import { Actions, ActionConst } from 'react-native-router-flux';
import {
  Animated,
  Easing,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import phone from './img/press-logo-dark.png';
import comment_0 from './img/schedule.png';
import comment_1 from './img/pickup.png';
import comment_2 from './img/enjoy.png';

import chart_0 from './img/chartOne.jpg';
import chart_1 from './img/chartTwo.jpg';
import chart_2 from './img/chartThree.jpg';

const COMMENT_IMAGES = [comment_0, comment_1, comment_2];
const CHART_IMAGES = [chart_1, chart_0,chart_2];

const B = (props) => <Text style={styles.bold}>{props.children}</Text>;

const CommentHeader = (props) =>{
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>
        {props.title}
      </Text>
    </View>
  )
}

const Slide = (props) =>{
  return (
    <View style={styles.slide}>
      <CommentHeader title={props.title} />
      <View style={[styles.mainContent, styles.center]}>
        {props.children}
      </View>
    </View>
  )
}

export default class tutorial extends Component {
  constructor(props) {
    super(props);
    this.animOneValue = new Animated.Value(0);
    this.animChartsValue = [];
    this.animCommentsValue = [];
  }
  componentWillMount(){
   for (var i = 0; i < 3; i++) {
     this.animCommentsValue.push(new Animated.Value(0));
     this.animChartsValue.push(new Animated.Value(0));
   }
  }
  componentDidMount() {
   this.animateSlideOne();
  }
  animateSlideOne(){
    Animated.spring(this.animOneValue,
      { toValue: 1,  friction: 4,  tension: 8 }
   ).start();
  }
  animateSlideTwo(){
   let delay = 0;
   for (var i = 0; i < this.animCommentsValue.length; i++) {
     Animated.timing(
       this.animCommentsValue[i], {
         toValue: 1,
         duration: 500,
         delay: (delay += 200)})
       .start();
   }
  }
  animateSlideThree(){
   let delay = 0;
   for (var i = 0; i < this.animChartsValue.length; i++) {
     Animated.timing(
       this.animChartsValue[i], {
         toValue: 1,
         duration: 500,
         delay: (delay += 200)})
       .start();
   }
  }
  renderComments(){
   let toLeft = true;
   return this.animCommentsValue.map((animeValue, i) => {
     toLeft = !toLeft;
     return <Animated.Image
       key={i}
       source={COMMENT_IMAGES[i]}
       style={
         [ styles.commentImage, {
           marginLeft: toLeft ? 30 : 0 ,
           marginRight: toLeft ? 0 : 30 ,
           opacity: animeValue,
           transform: [
             { scale:  animeValue.interpolate({
                   inputRange: [0, 1],
                   outputRange: [0.1, 1],
                 })
             },
           ]},
         ]}
       />
     });
  }
  renderCharts(){
   const bigImg = {height: 140};
   return this.animChartsValue.map((animeValue, i) => {
     return <Animated.Image
     key={i}
     source={CHART_IMAGES[i]}
     style={
       [ styles.chartStyle, {
         opacity: animeValue,
         transform: [
           { scale:  animeValue.interpolate({
             inputRange: [0, .3, 1],
                               outputRange: [0.01, .3 , 1],
               })
           },
         ]}, (i==1) ?  bigImg : {}
       ]}
     />
   });
  }
  reset(){
    this.animOneValue.setValue(0);
    for (var i = 0; i < 3; i++) {
      this.animCommentsValue[i].setValue(0);
      this.animChartsValue[i].setValue(0);
    }
  }
  onSwiped =(e, state, context) =>{
    let self = this;
    this.reset();
    switch (state.index) {
     case 0:
        self.animateSlideOne();
        break;
     case 1:
        self.animateSlideTwo();
        break;
     case 2:
        self.animateSlideThree();
        break;
     case 3:
        Actions.signin({type: ActionConst.REPLACE});
    }
  }
render() {
  return (
    <View style={[this.props.style]}>
      <Swiper 
        paginationStyle={styles.paginationStyle}
        onMomentumScrollEnd={this.onSwiped}
        dot={<View style={{backgroundColor: 'rgba(0,0,0,.2)', width: 5, height: 5, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} /> }
        activeDot={<View style={{backgroundColor: '#4b3486', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} /> }
        loop={false}>
        <Slide>
          <Text style={{fontSize: 20, fontFamily: 'OpenSans'}}> Welcome to</Text>
          <Animated.Image
            source={phone}
            style={[ styles.slide1AnimateImage, {
              opacity: this.animOneValue,
              width: 270,
              height: 240,
              transform: [ { scale: this.animOneValue.interpolate({
                    inputRange: [0, 1],outputRange: [0.2, 1],})},
              ]} ]} 

          />
        </Slide>
        <Slide title={<Text>
                        Laundry & dry cleaning done with <B>free pickup and delivery</B>
                      </Text>}>
          {this.renderComments()}
        </Slide>
        <Slide title={<Text>Take back laundry day.</Text>}>
          {this.renderCharts()}
        </Slide>
        
      </Swiper>
    </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
   flex: 1
 },
 center: {
   justifyContent: 'center',
   alignItems: 'center',
 },
 bold:{
   fontWeight: '700'
 },
 slide: {
   flex: 1,
 },
 text: {
   color: '#fff',
   fontSize: 30,
   fontWeight: 'bold',
 },
 header: {
   padding: 20,
   height: 130
 },
 headerText:{
   textAlign: 'center',
   fontSize: 20,
   margin: 20,
   marginBottom: 20,
 },
 mainContent:{
   flex: 1,
   paddingBottom: 150,
 },
 paginationStyle:{
   bottom : 150,
 },
 commentImage:{
   width: 280,
   height: 110,
   bottom: 20,
   resizeMode: 'stretch',
 },
 chartStyle:{
   width: 280,
   height: 90,
   bottom: 20,
   resizeMode: 'stretch',
 },
 slide1AnimateImage:{
   resizeMode: 'contain',
   width: 170,
   justifyContent: 'center',
   bottom: 20,
 },
});
