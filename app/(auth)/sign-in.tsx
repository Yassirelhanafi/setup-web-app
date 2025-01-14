import { Image, ScrollView, Text, View } from "react-native";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import React, {useCallback, useState} from "react";
import CustomButton from "@/components/CustomButton";
import {Link, useRouter} from "expo-router";
import OAuth from "@/components/OAuth";
import {useSignIn} from "@clerk/clerk-expo";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()


  const [form, setForm] = useState({ email: "", password: "" });
  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/(root)/(tabs)/home')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, form.email, form.password ]);
  return (
      <ScrollView className="flex-1 bg-white">
        <View className="w-full px-5">
        <View className="flex-1 bg-white justify-center items-center">
          <View className="flex justify-center items-center w-full h-[100px]">
            <Text className="text-2xl text-primary-500 font-JakartaSemiBold mt-2 mb-1">
              Welcome Back
            </Text>
            <Text className="text-base text-center text-gray-700 font-JakartaSemiBold">
              Log in and continue your delivery journey!
            </Text>
          </View>

        <View className="flex justify-center items-center p-5">
          <InputField
            label="Email"
            placeholder={"Enter your Email"}
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder={"Enter your password"}
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-8"
          />

          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Don't have an account?</Text>
            <Text className="text-primary-500">Sign Up </Text>
          </Link>
        </View>
      </View>
        </View>
    </ScrollView>
  );
};

export default SignIn;
