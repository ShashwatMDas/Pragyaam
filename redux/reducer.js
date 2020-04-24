import { ADD_MOVIES, ADD_QUERY } from './action';
const initialState = {
  movies: [{ imdbID: '998887' }],
  query: ''
};
function reducer(state = initialState, action) {
switch(action.type) {
  case ADD_MOVIES:
    return {
      ...state,
      movies: action.movies,
    };
  case ADD_QUERY:
    return {
        ...state,
        query: action.query
    };
  default:
    return state;
  }
}
export default reducer;