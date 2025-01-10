import React, { memo } from 'react'
import { Dimensions, ScrollView, Text, View } from 'react-native'
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get("window");
function Success({ message }: { message: string }): React.JSX.Element {
    return (
        <View className='justify-center items-center'>
            <LottieView
                autoPlay
                style={{
                    width: width / 1.75,
                    height: width / 1.75,
                }}
                source={require('../../assets/lottie/success.json')}
            />
            <Text style={{ fontFamily: "Nunito_700Bold", fontSize: 22 }} className='text-black text-center dark:text-white me-2'>{message}</Text>
        </View >
    )
}

export default Success;