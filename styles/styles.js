import { StyleSheet } from 'react-native';

const color = '#0992ed'

export default StyleSheet.create({
  createActive: {
    backgroundColor: 'black', 
    width: '20%', 
    height: '60%', 
    borderRadius: 20, 
    justifyContent: 'center',
    position: 'absolute',
    right: 15
  },
  createInactive: {
    backgroundColor: 'white', 
    width: '20%', 
    height: '60%', 
    borderRadius: 20, 
    justifyContent: 'center',
    position: 'absolute',
    right: 15
  },
  list:{
    paddingTop: 20,
    paddingBottom: 300
  },
  container: {
    padding: 10,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#43a1c9',
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center'
  },
  friends: {
    height: 50, 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderColor: 'black', 
    borderRadius: 5, 
    borderWidth: 1, 
    padding: 10, 
    justifyContent: 'space-between', 
    marginLeft: 10, 
    marginRight: 10,
    shadowOffset:{
      width: 5,
      height: 5
    },
    shadowOpacity: 0.4,
    backgroundColor: 'white'
  },
  genericTextWhite: {
    fontFamily: 'ChalkboardSE-Bold',
    color: 'white'
  },
  genericTextBlack: {
    fontFamily: 'ChalkboardSE-Bold',
    color: 'black'
  },
  listsTextBlack: {
    fontFamily: 'ChalkboardSE-Bold',
    color: 'black',
    paddingLeft: 20, 
    textAlign: 'left'
  },
  headerTitle:{
    fontWeight: 'bold', 
    color: 'white', 
    fontFamily: 'ChalkboardSE-Bold',
    
  },
  header:{
    backgroundColor: color
  },
});