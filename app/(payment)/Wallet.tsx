/*
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
    SafeAreaView,
    Text,
    View,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { icons, images } from "@/assets";
import { useNavigation } from "expo-router";
import * as http from "node:http";

const Wallet = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState<string>("Guest");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch user data by ID
    const fetchUserById = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const userId = "6759c298379dca445eb791f6"; // Specific user ID
            const response = await fetch(`http://192.168.219.192:8080/api/users/${userId}`);

            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }

            const data = await response.json();

            if (data && data.fullName) {
                setUser(data.fullName);
            } else {
                setUser("Guest");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setError(error.message || "Unable to fetch user data");
            setUser("Guest");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserById();
    }, []);

    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            {/!* Header Section *!/}
            <View className="flex-row justify-between items-center p-5">
                <Image source={images.elhouat} className="w-12 h-12 rounded-full" />
                {isLoading ? (
                    <ActivityIndicator size="small" color="#000" />
                ) : (
                    <Text className="text-xl font-bold">
                        Hello, {user}!
                    </Text>
                )}
                <TouchableOpacity>
                    <Image source={icons.notification} className="w-6 h-6" />
                </TouchableOpacity>
            </View>

            {/!* Balance Section *!/}
            <View className="mx-5 h-[25%] bg-blue-700 rounded-lg p-5 flex justify-center items-center">
                <Text className="text-white text-base">Total Balance</Text>
                <TouchableOpacity className="mt-2">
                    <Text className="text-white text-2xl">**</Text>
                </TouchableOpacity>
            </View>

            {/!* Activities Section *!/}
            <Text className="mt-7 ml-5 text-lg font-bold">Activities</Text>
            <View className="flex-row justify-between mx-5 mt-4">
                <TouchableOpacity
                    className="flex-1 bg-yellow-50 rounded-lg p-5 mr-2 items-center justify-center"
                    onPress={() => router.push("(delivery)/delivery")}
                >
                    <Image
                        source={images.moto}
                        className="max-w-full max-h-64"
                        resizeMode="contain"
                    />
                    <Text className="mt-3 font-semibold">Delivery</Text>
                </TouchableOpacity>

                <View className="flex-1 bg-green-50 rounded-lg p-5 ml-2 items-center justify-center">
                    <Image
                        source={images.camion}
                        className="max-w-full max-h-64"
                        resizeMode="contain"
                    />
                    <Text className="mt-3 font-semibold">Haulage</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Wallet;*/
