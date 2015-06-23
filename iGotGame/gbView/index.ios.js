'use strict';

var React = require('react-native');

var {
  ActivityIndicatorIOS,
  AppRegistry,
  StyleSheet,
  SearchBar,
  ListView,
  Text,
  View,
  Image,
  TextInput,
  Results,
  TouchableHighlight
} = React;

var REQUEST_URL = "http://localhost:3000/"
var SEARCH_URL = "http://localhost:3000/games/search/?search="
/* constructor for results */
var gbView = React.createClass({
  getInitialState: function() {
    console.log('HI')
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      curText: '<No Event>',
      prevText: '<No Event>'
    };
  },
/* run fetch to server */
  componentDidMount: function() {
    this.fetchData();
  },
/* make request to server, wait until request is filled, load response into a model */
  fetchData: function() {
    fetch(REQUEST_URL)
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseData),
        loaded: true
      });
    }).done();
  },
/* render a loading page while waiting on API */
  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
/* render a list of results */
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderHeader={this.renderSearchBar}
        renderRow={this.renderGame}
        style={styles.welcome}
      />
    );
  },
/* loading screen */
  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Loading games...</Text>
      </View>
    );
  },
/* handle add event */
  _handleAdd: function(game) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return
      }
      if (request.status === "200") {
        console.log('success!')
      } else {
        console.log('error')
      }
    };
    request.open('POST', 'http://localhost:3000/games');
    request.send(JSON.stringify(game))
  },
/* handle delete event */
  _handleDelete: function(game) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return
      }
      this.fetchData()
    };
    console.log(game.id)
    request.open('DELETE', 'http://localhost:3000/games/' + game.id);
    request.send()
  },
/*  individual game view */
  renderGame: function(game) {
    if (typeof game.image === "string") {
      game.image = game.image
    } else if (game.image) {
      game.image = game.image.medium_url
    } else {
      game.image = "http://buzzsharer.com/wp-content/uploads/2015/04/Pug-playing-with-ball.jpg"
    }
    return (
      <View style={styles.everything}>
      <View style={styles.container}>
      <Image
        source={{uri: game.image}}
        style={styles.thumbnail}
      />
      <View style={styles.rightContainer}>
        <Text style={styles.title}>{game.name}</Text>
      </View>
      <TouchableHighlight onPress={() => this._handleAdd(game)}>
        <Text>  +  </Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => this._handleDelete(game)}>
        <Text>  -  </Text>
      </TouchableHighlight>
      </View>
      </View>
    );
  },
/* render a search bar */
  renderSearchBar: function() {
    return (
      <View style={styles.searchBar}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType={"search"}
          placeholder="Search for a game..."
          onSubmitEditing={(event) => this.search(
            event.nativeEvent.text
          )}
          style={styles.searchBarInput}
        />
      </View>
    );
  },

/* search bar */
  updateText: function(text) {
    this.setState({
      curText: text,
      prevText: this.state.curText
    });
  },

  search: function(searchString) {
    fetch(SEARCH_URL + searchString)
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseData),
        loaded: true,
      });
      this.renderResults()
    }).done();
  },

/* render search results */
  renderResults: function(results) {
    if (!this.state.loaded) {
      return  this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderHeader={this.renderSearchBar}
        renderRow={this.renderGame}
        style={styles.welcome}
      />
    );
  },

/* reload the list */
});

/* style */
var styles = StyleSheet.create({
 container: {
   flex: 1,
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
   paddingTop: 20,
   backgroundColor: '#F5FCFF',
 },
 rightContainer: {
   flex: 1,
 },
 title: {
   fontSize: 20,
   marginBottom: 8,
   textAlign: 'center',
 },
 year: {
   textAlign: 'center',
 },
 thumbnail: {
   width: 53,
   height: 81,
 },
 listView: {
   paddingTop: 20,
   backgroundColor: '#F5FCFF',
 },
 searchBar: {
   marginTop: 20,
   padding: 3,
   paddingLeft: 8,
   flexDirection: 'row',
   alignItems: 'center',
 },
 searchBarInput: {
   fontSize: 15,
   flex: 1,
   height: 30,
 },
 spinner: {
   width: 30,
 },
 scrollSpinner: {
   marginVertical: 20,
 }
});

AppRegistry.registerComponent('gbView', () => gbView);
