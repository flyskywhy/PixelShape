import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const {width} = Dimensions.get('window');
const modalWidth = 300;

const ModalWindow = (props) => {
  return (
    <Modal
      visible={props.isShown}
      onRequestClose={props.cancel.action}
      animationType="fade"
      transparent={true}>
      <View style={styles.container}>
        <Text style={styles.header}>{props.title}</Text>
        <View style={styles.section}>{props.children}</View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={props.cancel.action}>
            <Text style={styles.button}>{props.cancel.text}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.ok.action}>
            <Text style={styles.button}>{props.ok.text}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: (width - modalWidth) / 2,
    width: modalWidth,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: modalWidth,
    padding: 24,
    paddingRight: 0,
    marginBottom: -1,
    borderBottomWidth: 1,
    borderColor: 'rgb(224, 224, 224)',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#264653',
  },
  section: {
    width: modalWidth,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  footer: {
    width: modalWidth,
    flexDirection: 'row',
    padding: 8,
    marginTop: -1,
    borderTopWidth: 1,
    borderColor: 'rgb(224, 224, 224)',
    justifyContent: 'flex-end',
  },
  button: {
    padding: 10,
    backgroundColor: 'transparent',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontFamily: 'arial',
    color: 'rgb(38, 70, 83)',
  },
});

export default ModalWindow;
