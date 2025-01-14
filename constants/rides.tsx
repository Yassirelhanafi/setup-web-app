import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native"; // Use navigation for navigation
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation"; // Import the types

import { icons } from "@/constants/index";

const UploadImage = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasPermission(status === "granted");
        if (status !== "granted") {
            alert("Permission to access gallery is required!");
        }
    };


    const TakeImage = async () => {
        if (hasPermission === null) {
            await requestPermission();
        }

        if (hasPermission) {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
            }
        }
    };


    const pickImage = async () => {
        if (hasPermission === null) {
            await requestPermission();
        }

        if (hasPermission) {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
            }
        }
    };

    const navigateToDummy = () => {
        const params = {
            message: "Hello from NewOrder!",
            imageUri: imageUri, // Include the image URI
        };

        console.log("Navigating to Dummy with params:", params);
        navigation.navigate("Dummy", {
            message: "Hello from NewOrder!",
            imageUri: imageUri || "",
        });
    };

    return (
        <View className="flex-1 bg-gray-100 justify-center items-center p-5">
            <View className="flex-row items-center mb-5">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                    <Image source={icons.backArrow} className="w-6 h-6" />
                </TouchableOpacity>
                <Text className="text-lg font-bold">Upload Image</Text>
            </View>

            {imageUri ? (
                <>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Image
                            source={{ uri: imageUri }}
                            className="w-52 h-52 rounded-lg"
                            resizeMode="cover"
                        />
                    </TouchableOpacity>

                    <Text className="text-gray-700 mt-3 text-center">
                        Tap the image to view it in full screen.
                    </Text>

                    <View className="flex-row mt-5 justify-around w-full">
                        <TouchableOpacity
                            className="bg-green-600 px-6 py-3 rounded-lg"
                            onPress={navigateToDummy}
                        >
                            <Text className="text-white font-bold text-lg">Go to Dummy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-blue-600 px-6 py-3 rounded-lg"
                            onPress={TakeImage}
                        >
                            <Text className="text-white font-bold text-lg">Choose Again</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <TouchableOpacity
                    className="bg-blue-600 px-6 py-3 rounded-lg"
                    onPress={TakeImage}
                >
                    <Text className="text-white font-bold text-lg">Pick an Image</Text>
                </TouchableOpacity>
            )}

            <Modal visible={modalVisible} transparent={false}>
                <View className="flex-1 bg-black justify-center items-center">
                    {imageUri && (
                        <Image
                            source={{ uri: imageUri }}
                            className="w-full h-full"
                            resizeMode="contain"
                        />
                    )}
                    <TouchableOpacity
                        className="absolute top-10 left-5"
                        onPress={() => setModalVisible(false)}
                    >
                        <Image source={icons.backArrow} className="w-8 h-8" />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

export default UploadImage;