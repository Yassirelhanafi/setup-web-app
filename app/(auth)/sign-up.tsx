import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";
import * as ImagePicker from "expo-image-picker";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import {createAccount, createUser} from "@/lib/fetch";
import PhoneNumberInput from "@/components/PhoneNumberInput";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [iduser, setIduser] = useState<string | null>(null);


  const [form, setForm] = useState<{
    name: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
    cin: string;
    idCard: { uri: string; name: string; type: string } | null;
    profilePicture: { uri: string; name: string; type: string } | null;
  }>({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    cin: "",
    idCard: null,
    profilePicture: null,
  });


  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [userid, setUserid] = useState<string | null>(null);

  const handlePasswordChange = (value: string) => {
    setForm({ ...form, password: value });
    if (form.confirmPassword && value !== form.confirmPassword) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError("");
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setForm({ ...form, confirmPassword: value });
    if (form.password && value !== form.password) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError("");
    }
  };

  const handleImagePicker = async (type: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const pickedImage = result.assets[0]; // This contains the image details

      // Build the image object with `uri`, `name`, and `type`
      const image = {
        uri: pickedImage.uri,
        name: pickedImage.uri.split("/").pop() || "image.jpg", // Extract the file name or set a default
        type: "image/jpeg", // Set a default type
      };

      if (type === "idCard") {
        setForm({ ...form, idCard: image });
      } else if (type === "profilePicture") {
        setForm({ ...form, profilePicture: image });
      }
    }
  };


  const onSignUpPress = async () => {
    if (!form.password || !form.confirmPassword || passwordMatchError) {
      Alert.alert("Error", "Please make sure passwords match.");
      return;
    }

    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({ ...verification, state: "pending" });
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error");
    }
  };



  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        const userId = completeSignUp.createdUserId;
        setIduser(userId);

        await createAccount({
          fullname: form.name,
          email: form.email,
          phone: form.phone,
          clerkId: userId,
        });

        setUserid(userId);
        await setActive({ session: completeSignUp.createdSessionId });

        setVerification({ ...verification, state: "success" });
        setShowModal(true);
      } else {
        setVerification({ ...verification, error: "Verification failed.", state: "failed" });
      }
    } catch (err) {
      setVerification({ ...verification, error: "verification failed", state: "failed" });
    }
  };

  const onAdditionalInfoSubmit = async () => {
    if (!form.cin || !form.idCard || !form.profilePicture) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    await createUser({
      name: form.name,
      email: form.email,
      phone: form.phone,
      clerkId: iduser,
      numCIN: form.cin,
      imageCIN: form.idCard,
      imageProfile: form.profilePicture
    })

    setIduser(iduser)
    setShowModal(false);
    setVerification({ ...verification, state: "success2" });
    setShowSuccessModal(true);
  };



  return (
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 bg-white">
          <View className="flex justify-center items-center w-full h-[100px]">
            <Text className="text-2xl text-primary-500 font-JakartaSemiBold mt-2 mb-1">
              Let’s Get Started
            </Text>
            <Text className="text-base text-center text-gray-700 font-JakartaSemiBold">
              Sign up to start sending packages with ease and reliability!
            </Text>
          </View>
          <View className="flex justify-center items-center p-5">
            <InputField
                label="Name"
                placeholder="Enter your name"
                icon={icons.person}
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
            />

            <PhoneNumberInput
                onChangeText={(value) => setForm({ ...form, phone: value })}
            />

            <InputField
                label="Email"
                placeholder="Enter your email"
                icon={icons.email}
                textContentType="emailAddress"
                value={form.email}
                onChangeText={(value) => setForm({ ...form, email: value })}
            />

            <InputField
                label="Password"
                placeholder="Enter your password"
                icon={icons.lock}
                secureTextEntry={true}
                textContentType="password"
                value={form.password}
                onChangeText={handlePasswordChange}
            />

            <InputField
                label="Confirm Password"
                placeholder="Re-enter password"
                icon={icons.lock}
                secureTextEntry={true}
                textContentType="password"
                value={form.confirmPassword}
                onChangeText={handleConfirmPasswordChange}
            />
            {passwordMatchError && (
                <Text className="text-red-500 text-sm mt-1">
                  {passwordMatchError}
                </Text>
            )}

            <CustomButton
                title="Sign Up"
                onPress={onSignUpPress}
                className="mt-6"
                disabled={!!passwordMatchError}
            />

            <Link
                href="/sign-in"
                className="text-lg text-center text-general-200 mt-10"
            >
              Already have an account?{" "}
              <Text className="text-primary-500">Log In</Text>
            </Link>
          </View>
          <ReactNativeModal
              isVisible={verification.state === "pending"}
              onModalHide={() => {
                if (verification.state === "success") {
                  setShowModal(true);
                }
              }}
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Text className="font-JakartaExtraBold text-2xl mb-2">
                Verification
              </Text>
              <Text className="font-Jakarta mb-5">
                We've sent a verification code to {form.email}.
              </Text>
              <InputField
                  label={"Code"}
                  icon={icons.lock}
                  placeholder={"12345"}
                  value={verification.code}
                  keyboardType="numeric"
                  onChangeText={(code) =>
                      setVerification({ ...verification, code })
                  }
              />
              {verification.error && (
                  <Text className="text-red-500 text-sm mt-1">
                    {verification.error}
                  </Text>
              )}
              <CustomButton
                  title="Verify Email"
                  onPress={onPressVerify}
                  className="mt-5 bg-success-500"
              />
            </View>
          </ReactNativeModal>


          <ReactNativeModal
              isVisible={showModal}
              onModalHide={() => {
                if (verification.state === "success2") {
                }
              }}
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[400px]">
              <Text className="font-JakartaExtraBold text-2xl mb-2">
                Required Information
              </Text>
              <Text className="font-Jakarta mb-5">
                Please provide the additional required information to complete your account setup.
              </Text>

              <InputField
                  label={"CIN (National ID Number)"}
                  icon={icons.lock}
                  placeholder={"Enter your CIN"}
                  value={form.cin}
                  onChangeText={(cin) => setForm({ ...form, cin })}
              />

              <View className="mt-5">
                <Text className="font-JakartaSemiBold text-base mb-1">
                  Upload National ID Card
                </Text>
                <CustomButton
                    title="Choose from Gallery"
                    onPress={() => handleImagePicker("idCard")}
                />
                {form.idCard && (
                    <Image
                        source={{ uri: form.idCard?.uri }}
                        className="w-full h-[150px] mt-3 rounded-md"
                    />
                )}
              </View>

              <View className="mt-5">
                <Text className="font-JakartaSemiBold text-base mb-1">
                  Upload Profile Picture
                </Text>
                <CustomButton
                    title="Choose from Gallery"
                    onPress={() => handleImagePicker("profilePicture")}
                />
                {form.profilePicture && (
                    <Image
                        source={{ uri: form.profilePicture?.uri }}
                        className="w-[150px] h-[150px] mt-3 rounded-full mx-auto"
                    />
                )}
              </View>

              <CustomButton
                  title="Submit"
                  onPress={onAdditionalInfoSubmit}
                  className="mt-5 bg-success-500"
              />
            </View>
          </ReactNativeModal>


          <ReactNativeModal isVisible={showSuccessModal}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Image
                  source={images.check}
                  className="w-[110px] h-[110px] mx-auto my-5"
              />
              <Text className="text-3xl font-JakartaBold text-center">
                Verified
              </Text>
              <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
                You have successfully verified your account.
              </Text>
              <CustomButton
                  title="Browse Home"
                  onPress={() => router.push({ pathname: `/(root)/(tabs)/home`
                  }
                    )}
                  className="mt-5"
              />
            </View>
          </ReactNativeModal>
        </View>
      </ScrollView>
  );
};

export default SignUp;