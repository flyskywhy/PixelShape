import {StyleSheet} from 'react-native';
import {colors} from '../../styles/variables.js';

export default StyleSheet.create({
  app: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: colors.paleblue,
  },
  appContent: {
    flexGrow: 1,
    height: '100%',
    position: 'relative',
  },
});
