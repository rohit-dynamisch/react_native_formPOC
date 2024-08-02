import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store copy/Actions/authActions";
import { LoginButton, AccessToken, Profile } from "react-native-fbsdk-next";
function Login({ navigation }) {
  const webClientId =
    "665229377932-a046jgg1ke4e8aekvuu0igm7q9vr39rv.apps.googleusercontent.com";

    // *************************************REDUX****************************************
  const users = useSelector((state) => state.auth.users);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // **********************************YUP********************************************
  const formSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email is Invalid")
      .required("Email Cannot Be Empty")
      .test(
        "email-exists",
        "This Email does not exist. Please Register!",
        async (value) => {
          if (!value) return true;
          try {
            const data = users;
            if (data.length > 0) {
              const reqData = data.filter((item) => item.email === value);
              return reqData.length > 0;
            }
            return false;
          } catch (error) {
            console.error("Error checking email existence:", error);
            return false;
          }
        }
      ),
    password: Yup.string()
      .min(8, "Password Must have a Minimum of ten Characters")
      .required("Password Cannot Be Empty")
      .test("password-exists", "Invalid Credential!!", async (value) => {
        if (!value) return true;

        try {
          const data = users;
          if (data) {
            const reqData = data.filter(
              (item) => item.email === email && item.password === value
            );
            return reqData.length > 0;
          }
          return false;
        } catch (error) {
          console.error("Error checking password validity:", error);
          return false;
        }
      }),
  });


  // ********************************************LOGIN**************************************************
  const handleSubmit = async () => {
    try {
      await formSchema.validate({ email, password }, { abortEarly: false });
      setErrors({});
      const data = users.filter(
        (item) => item.email === email && item.password === password
      );
      handleReset();
      console.warn(data[0]);
      dispatch(login(data[0]));
      navigation.navigate("Drawer");
    } catch (err) {
      const newErr = err.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setErrors(newErr);
    }
  };

  // ****************************************RESET*******************************************************************
  const handleReset = () => {
    setEmail("");
    setPassword("");
  };

  
  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("userinfo", userInfo.user);
      dispatch(
        login({
          name: userInfo.user.name,
          email: userInfo.user.email,
          image: userInfo.user.photo,
          authMethod: "google",
        })
      );
      navigation.navigate("Drawer");
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log(error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log(error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log(error);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>LOGIN FORM</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "white",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.3)",
            borderRadius: 5,
          }}
        >
          <TextInput
            style={{ width: "90%" }}
            placeholder="Password"
            secureTextEntry={secureTextEntry}
            value={password}
            onChangeText={setPassword}
          />
          <Icon
            name={!secureTextEntry ? "eye-slash" : "eye"}
            size={25}
            color="gray"
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          />
        </View>
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.linkText}>New User? Click here to Signup</Text>
      </TouchableOpacity>
      <View style={{ margin: 20 }}>
        <Pressable onPress={googleLogin}>
          <View style={styles.loginButton}>
            <View style={{ marginLeft: 5 }}>
              <Text
                style={{ color: "#222222", fontWeight: "400", fontSize: 18 }}
              >
                Login with Google
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
      <View>
        <LoginButton
          onLoginFinished={(error, result) => {
            if (error) {
              console.log("login has error: " + result.error);
            } else if (result.isCancelled) {
              console.log("login is cancelled.");
            } else {
              AccessToken.getCurrentAccessToken().then((data) => {
                console.log(data.accessToken.toString());
              });
              const currentProfile = Profile.getCurrentProfile().then(function (
                currentProfile
              ) {
                if (currentProfile) {
                  console.log(currentProfile);
                  dispatch(
                    login({
                      name: currentProfile.name,
                      email: userInfo.user.email,
                      image: currentProfile.imageURL,
                      authMethod: "google",
                    })
                  );
                  navigation.navigate("Drawer");
                }
              });
            }
          }}
          onLogoutFinished={() => console.log("logout.")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
    borderRadius: 5,
    fontSize: 18,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 5,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#1E90FF",
    borderRadius: 5,
    padding: 10,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    color: "#1E90FF",
    fontSize: 16,
  },
});

export default Login;
