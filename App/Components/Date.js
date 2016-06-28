/* eslint-disable semi, space-before-function-paren, space-before-blocks*/
import React from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';

import moment from 'moment';
import DatePicker from 'react-native-datepicker';

var STORE = require('../Utilities/Store');

class Date extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      numberOfGames: 0,
      loaded: false,
      date: moment().format('L'),
      dateWithDay: ''
    }
    STORE.date = moment().format('L');
  }

  componentWillMount(){
    this.fetchGames();
  }

  getDate(){
    var date1 = moment().format('LLLL');
    date1 = date1.split(' ');
    var day = date1[0].replace(',','');
    var dayNum = date1[2].replace(',','');
    var month = date1[1];
    var combinedDate = day + ', ' + month + ' ' + dayNum;
    return combinedDate;
  }

  fetchGames(){
    var date = this.state.date;
    if (date.indexOf('-') > -1){
      date = date.split('-');
    } else {
      date = date.split('/');
    }
    var month = date[0];
    var day = date[1];
    var year = date[2];
    date = year + month + day;
    STORE.date = date;
    var url = 'http://data.nba.com/data/5s/json/cms/noseason/scoreboard/' + date + '/games.json';
    fetch(url)
    .then((response) => response.json())
    .then((jsonResponse) => {
      if (jsonResponse['sports_content']['games']['game']){
        var games = jsonResponse['sports_content']['games']['game'];
        this.setState({
          numberOfGames: games.length,
          loaded: true
        });
      }
    })
    .catch((error) => {
      if (error instanceof SyntaxError){
        this.setState({
          numberOfGames: 0,
          loaded: true
        });
      }
    });
  }

  handleDateChange(date){
    var date2 = date.split('-');
    var month = date2[0];
    var day = date2[1];
    var year = date2[2];
    date2 = year + '-' + month + '-' + day;
    var dateDay = moment(date2).format('LLLL').slice(0, moment(date2).format('LLLL').lastIndexOf(','));
    this.setState({
      date: date,
      dateWithDay: dateDay
    }, function(){ this.fetchGames(); });
  }

  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}> {this.state.dateWithDay || this.getDate()} </Text>
          <Text style={styles.numberOfGamesText}>
            {!this.state.loaded ? 'Checking number of games' :
              (() => {
                switch (this.state.numberOfGames === 0){
                  case true: return 'There are no games today';
                  case false: switch (this.state.numberOfGames === 1){
                    case true: return 'There is 1 game today';
                    case false: return 'There are ' + this.state.numberOfGames + ' games today';
                  }
                }
              })()
            }
          </Text>
        </View>
        <View style={{backgroundColor: '#FF5722', flex: 0.25, justifyContent: 'center', alignItems: 'center'}}>
          <DatePicker
            style={{width: 10, marginTop: 20}}
            date={this.state.date}
            mode='date'
            format='MM-DD-YYYY'
            confirmBtnText='Confirm'
            cancelBtnText='Cancel'
            customStyles={{
              dateInput: {
                borderWidth: 0,
                opacity: 0
              }
            }}
            onDateChange={(date) => { this.handleDateChange(date) }}
          />
        </View>
      </View>
    )
  }
};

var styles = StyleSheet.create({
  dateContainer: {
    backgroundColor: '#FF5722',
    padding: 35,
    flexDirection: 'column'
  },
  dateText: {
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
    color: '#FFFFFF'
    // marginLeft: 70
  },
  numberOfGamesText: {
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
    color: '#FFFFFF'
    // marginLeft: 70
  }
});

module.exports = Date;
/* eslint-enable semi, space-before-function-paren, space-before-blocks*/
