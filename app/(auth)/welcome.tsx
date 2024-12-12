import { router } from "expo-router";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import { images, onboarding } from "@/constants";

const Home = () => {
  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <ImageBackground source={images.fondmaps} style={styles.image}>
        <View className="flex-1 items-center justify-center p-5">
          <View className="flex flex-row items-center justify-center w-full mt-10">
            <Text
              className="text-white font-JakartaExtraBold mx-10 text-center"
              style={styles.text}
            >
              {onboarding.title}
            </Text>
          </View>
          <Text className="text-md font-JakartaSemiBold text-center text-white mx-10 mt-3">
            {onboarding.description}
          </Text>
        </View>
        <View className="flex items-center justify-center">
          <CustomButton
            title={"Get Started"}
            onPress={() => router.replace("/(auth)/sign-up")}
            className="w-11/12 mt-10 mb-1"
            bgVariant={"danger"}
            textVariant={"primary"}
          />

          <CustomButton
            title={"Log In"}
            onPress={() => router.replace("/(auth)/sign-in")}
            className="w-11/12 mt-1 mb-5"
            bgVariant={"outline"}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  text: {
    fontSize: 50,
  },
});

export default Home;
