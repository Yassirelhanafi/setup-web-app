import React, { useEffect, useRef, useState } from "react";
import {
    SafeAreaView,
    Text,
    View,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    Animated,
    Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { icons, images } from "@/constants";
import {API_BASE_URL} from "@/lib/fetch";
import {useAuth, useUser} from "@clerk/clerk-expo";
const Home = () => {
    const router = useRouter();
    const { signOut } = useAuth();
    const [ imageUri, setImageUri] = useState<string | null>(null);
    const {user} = useUser();
    const [userName, setUser] = useState<string>("Guest");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isProfileVisible, setIsProfileVisible] = useState<boolean>(false);
    const [rating, setRating] = useState<number | null>(0);
    const slideAnim = useRef(
        new Animated.Value(-Dimensions.get("window").width),
    ).current;
    const userId = user?.id;
    const fetchUserById = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/users/${userId}`);

            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }

            const data = await response.json();

            if (data && data.userId) {
                setUser(data.fullName || "Guest");
                setImageUri(
                    `${API_BASE_URL}/users/imageProfile/${data.userId}?timestamp=${new Date().getTime()}`,
            );
                setRating(data.rating);
            } else {
                setUser("Guest");
                setRating(0.0);
            }
        } catch (error: any) {
            setError(error.message || "Unable to fetch user data");
            setUser("Guest");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserById();
    }, []);

    const toggleProfile = () => {
        if (isProfileVisible) {
            Animated.timing(slideAnim, {
                toValue: -Dimensions.get("window").width,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setIsProfileVisible(false));
        } else {
            setIsProfileVisible(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleSignOut = () => {
        signOut();
        router.replace("/(auth)/sign-in");
    };


    // const navigateToBecomeDriver = () => {
    //     router.push("/(userSettings)/BecomeDriver");
    // };

    return (
        <SafeAreaView className="flex-1 bg-gray-100 relative">
            <View className="flex-row justify-between items-center p-5">
                <TouchableOpacity onPress={toggleProfile}>
                    <Image
                        source={imageUri ? { uri: imageUri } : icons.GreyUser}
                        className="w-12 h-12 rounded-full"
                    />
                </TouchableOpacity>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#000" />
                ) : (
                    <Text className="text-xl font-bold">Hello, {userName}!</Text>
                )}
                <TouchableOpacity  onPress={() => {handleSignOut()}} >
                    <Image source={icons.notifications} className="w-6 h-6" />
                </TouchableOpacity>
            </View>

            <View className="mx-5 h-[25%] bg-blue-700 rounded-lg p-5 flex justify-center items-center">
                <Text className="text-white text-base">Total Balance</Text>
                <TouchableOpacity className="mt-2">
                    <Text className="text-white text-2xl">**</Text>
                </TouchableOpacity>
            </View>

            <Text className="mt-7 ml-5 text-lg font-bold">Activities</Text>
            <View className="flex-row justify-between mx-5 mt-4">
                <TouchableOpacity
                    className="flex-1 bg-yellow-50 rounded-lg p-5 mr-2 items-center justify-center"
                    onPress={() =>
                        router.push({
                            pathname: "/(delivery)/delivery",
                            params: {
                                userId: userId,
                            },
                        })
                    }
                >
                    <Image
                        source={images.moto}
                        className="max-w-full max-h-64"
                        resizeMode="contain"
                    />
                    <Text className="mt-3 font-semibold">Delivery</Text>
                </TouchableOpacity>
            </View>

            {isProfileVisible && (
                <Pressable
                    onPress={toggleProfile}
                    className="absolute top-0 left-0 w-full h-full bg-black/50"
                />
            )}

            <Animated.View
                style={{
                    transform: [{ translateX: slideAnim }],
                }}
                className="absolute top-0 left-0 h-full w-[60%] bg-white shadow-lg z-50"
            >
                <View className="bg-blue-700 p-5 items-center">
                    <Image
                        source={imageUri ? { uri: imageUri } : icons.GreyUser}
                        className="w-20 h-20 rounded-full"
                    />
                    <Text className="text-white text-lg font-bold mt-2">{userName}</Text>
                    <Text className="text-white text-sm mt-1">⭐ {rating}</Text>
                </View>

                <View className="p-5">


                    <TouchableOpacity className="flex-row items-center mt-5">
                        <Image source={icons.list} className="w-5 h-5" />
                        <Text className="text-base ml-2">Delivery History</Text>
                    </TouchableOpacity>
                    <View className="mt-5 border-t border-gray-200" />

                    <TouchableOpacity
                        className="flex-row items-center mt-5"
                        //onPress={navigateToBecomeDriver}
                    >
                        <Image source={icons.Gear} className="w-5 h-5" />
                        <Text className="text-base ml-2">Become a driver</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

export default Home;