import * as React from 'react';
import { Button, NativeModules, StyleSheet, Text, View } from 'react-native';
export const addOne = (input) => input + 1;
export const Counter = () => {
    const [count, setCount] = React.useState(0);
    return (React.createElement(View, { style: styles.container },
        React.createElement(Text, null,
            "You pressed ",
            count,
            " times"),
        React.createElement(Button, { onPress: () => setCount(addOne(count)), title: 'Press Me' })));
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
    },
});
export default NativeModules.RNMailModule;
//# sourceMappingURL=index.js.map