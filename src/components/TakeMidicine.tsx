import React, { memo } from 'react'
import { Dimensions, ScrollView, Text, View } from 'react-native'
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get("window");
function TakeMedicine({ message }: { message: string }): React.JSX.Element {
    return (
        <View
            className='flex-1 justify-evenly items-center'
        >
            <LottieView
                autoPlay
                style={{
                    width: width / 1.75,
                    height: width / 1.75,
                }}
                source={require('../../assets/lottie/doctor.json')}
            />
            <Text style={{ fontFamily: "Nunito_700Bold", fontSize: 22 }} className='text-black text-center dark:text-white me-2'>{message}</Text>
        </View >
    )
}

export default TakeMedicine;