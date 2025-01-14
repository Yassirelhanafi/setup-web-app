import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { createAccount } from "@/lib/fetch";
import PhoneNumberInput from "@/components/PhoneNumberInput";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const [passwordMatchError, setPasswordMatchError] = useState("");

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
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        await createAccount({
          name: form.name,
          email: form.email,
          phone: form.phone,
          clerkId: "11111",
        });

        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({
          ...verification,
          state: "success",
        });
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
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
                  setShowSuccessModal(true);
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
                  onPress={() => router.push(`/(root)/(tabs)/home`)}
                  className="mt-5"
              />
            </View>
          </ReactNativeModal>
        </View>
      </ScrollView>
  );
};

export default SignUp;
