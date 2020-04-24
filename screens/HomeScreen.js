import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail,  Button, Icon, Left, Body, H3, H2 } from 'native-base';
import { connect } from 'react-redux';
import axios from 'axios';
import Autocomplete from 'react-native-autocomplete-input';



const HomeScreen = (props) => {


  
  const [pictures, setPictures] =useState([]);

  useEffect(() => {
    axios.get(
      'http://www.omdbapi.com/?apikey=b5321c8a&s=gun'
    ).then(res => {
      // console.log(res.data.Search);
      props.dispatch({ type: 'ADD_MOVIES', movies: res.data.Search })
      setPictures(res.data.Search);
    }).catch(err => {
      console.log(err);
    })
  }, [])

  const { query, movies } = props;
  
  const findFilm = (query) => {
    if(query === '') return [];
    const regex = new RegExp(`${query.trim()}`, 'i');
    // console.log(pictures);
    return pictures.filter(movie => movie.Title.search(regex) >= 0);
  }

  const films = findFilm(query);
  const comp = (a, b) => a.toLowerCase().trim() === b;

  return (
    <Container style={styles.container}>
    <View style={styles.autocompleteContainer}>
    <Autocomplete
      autoCapitalize="none"
      autoCorrect={false}
      data={films.length >= 1 && comp(query, films[0].title) ? [] : films}
      defaultValue={query}
      placeholder="Enter the film title"
      onChangeText={text => props.dispatch({type: 'ADD_QUERY', query: text })}
      renderItem={({ item, i }) => (
        <TouchableOpacity key={item.imdbID} onPress={() => {
          props.navigation.navigate('Movie', { movie: item, pictures: pictures });
          props.dispatch({type: 'ADD_QUERY', query: '' });
          }}>
              <Text style={styles.itemText}>
                {item.Title} ({item.Year})
              </Text>
            </TouchableOpacity>
      )}
    />
    </View>
    <View>
    <FlatList
        style={{marginTop: 40}}
        data={movies}
        keyExtractor={item => item.imdbID}
        renderItem={({ item }) => 
        <Content>
          <TouchableOpacity onPress={(() => props.navigation.navigate('Movie', { movie: item, pictures: pictures }) )} >
          <Card style={{flex: 0, marginTop: 20, borderRadius: 20, padding: 10, backgroundColor: "#2e2e2e",}}>
            <CardItem style={{ textAlign: 'center',  backgroundColor: "#2e2e2e", }}>
                <Body >
                  <H2 style={{color: "#fff", marginBottom: 10}}>{item.Title}</H2>
                  <H3 style={{color: "#fff"}}>{item.Year}</H3>
                </Body>
            </CardItem>
          </Card>
        </TouchableOpacity>
        </Content>
        }
      />
      </View>
      </Container>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },
  itemText: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
});

const mapStateToProps = (state) => {
  return {
    movies: state.movies,
    query: state.query
  };
}

export default connect(mapStateToProps)(HomeScreen);
