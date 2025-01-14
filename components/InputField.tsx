import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  TextInput,
  Keyboard,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { InputFieldProps } from "@/types/type";

const InputField = ({
                      label,
                      labelStyle,
                      icon,
                      secureTextEntry = false,
                      containerStyle,
                      inputStyle,
                      iconStyle,
                      className,
                      ...props
                    }: InputFieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === "android" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="my-2 w-full">
            <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
              {label}
            </Text>
            <View
                className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500 ${containerStyle}`}
            >
              {icon && (
                  <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
              )}
              <TextInput
                  className={`rounded-br-none p-4 font-JakartaSemiBold text-[15px] flex-1 ${inputStyle} text-left`}
                  secureTextEntry={!isPasswordVisible && secureTextEntry}
                  {...props}
              />
              {secureTextEntry && (
                  <TouchableOpacity
                      onPress={() => setIsPasswordVisible((prev) => !prev)}
                      className="mr-4"
                  >
                    <Image
                        source={
                          isPasswordVisible
                              ? require("@/assets/icons/openeye.png")
                              : require("@/assets/icons/eyeclose.png")
                        }
                        className="w-6 h-6"
                    />
                  </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
  );
};

export default InputField;
