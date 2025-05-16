import { ActivityIndicator, View } from "react-native"
import tw from 'twrnc';

const Loader = () => {
    return(
        <View style={tw`flex-1 h-100 justify-center items-center py-4`}>
            {/* <ActivityIndicator size="large" color="#F57C00" /> */}
            <ActivityIndicator size="large" color="#0D47A1" />
        </View>
    )
}

export default Loader