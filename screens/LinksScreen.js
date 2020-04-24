import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
import Autocomplete from 'react-native-autocomplete-input';

const LinksScreen = (props) => {

    const { movie, pictures } = props.route.params;

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
      <Container >
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
        <Content >
          <Card style={{flex: 1, marginTop: 100}}>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: 'Image URL'}} />
                <Body>
                  <Text>{movie.Title}</Text>
                  <Text note>{movie.Year}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Image source={{uri: movie.Poster}} style={{height: 200, width: '100%', flex: 1}}/>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
}

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

export default connect(mapStateToProps)(LinksScreen);