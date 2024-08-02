import React, { useState, Component, useEffect } from "react";
import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "react-native-image-picker";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Image,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../store copy/Actions/authActions";
import { TouchableOpacity } from "react-native-gesture-handler";

function Signup({ navigation }) {
  const users = useSelector((state) => state.auth.users);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [imageUri, setImageUri] = useState("");
  const [imageSize, setImageSize] = useState(0);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const formSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email is Invalid")
      .required("Email Cannot Be Empty")
      .test("email already exist", "Email already exist!", function (email) {
        if (email) {
          try {
            let temp = users.filter((item) => item.email === email);
            console.warn(temp);
            return temp.length == 0;
          } catch (err) {
            console.log(err);
          }
          if (check?.data?.length > 0) {
            return false;
          }
        }

        return true;
      }),
    password: Yup.string()
      .min(8, "Password Must have a Minimum of eight Characters")
      .required("Password Cannot Be Empty"),
    name: Yup.string()
      .matches(/^[A-Za-z ]*$/, "Please enter valid name")
      .max(40)
      .required("Name is required!"),
    image: Yup.mixed().required("Profile photo is required"),
    // .test("fileType", "Unsupported File Format", (value) => {
    //   return (
    //     value && (value.type === "image/jpeg" || value.type === "image/png")
    //   );
    // })
    // .test("fileSize", "File Size is too large", (value) => {
    //   return value && value.size <= 500 * 1024; // 500 KB
    // })
  });

  const handleSubmit = async () => {
    try {
      await formSchema.validate(
        {
          image: { uri: imageUri, type: "image/jpeg", size: imageSize },
          name,
          email,
          password,
        },
        { abortEarly: false }
      );
      dispatch(signup({ name, email, password, image: imageUri }));
      setErrors({});
      navigation.navigate("Login");
    } catch (err) {
      const newErr = err.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setErrors(newErr);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setImageUri("");
    setErrors({});
  };

  const openImagePicker = () => {
    const options = {
      mediaType: "photo",
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("Image picker error: ", response.error);
      } else {
        const uri = response.uri || response.assets[0].uri;
        const size = response.fileSize || response.assets[0].fileSize;
        setImageUri(uri);
        setImageSize(size);
      }
    });
  };

  useEffect(() => {
    console.warn(users);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>SIGNUP</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}
        </View>

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
              borderColor: "#ddd",
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
          {errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}
        </View>

        <View style={styles.datePickerContainer}>
          <Text style={styles.label}>Selected Date of Birth:</Text>
          <Text style={styles.dateText}>{date.toDateString()}</Text>
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => showMode("date")}
              title="Select Date"
              color="#1E90FF"
            />
          </View>
          {show && (
            <DateTimePicker value={date} mode={mode} onChange={onChange} />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Upload Profile Photo</Text>
          <Button
            title="Choose from Device"
            onPress={openImagePicker}
            color="#1E90FF"
          />
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          {errors.image && <Text style={styles.error}>{errors.image}</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <Buttons handleSubmit={handleSubmit} handleReset={handleReset} />
        </View>

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.linkText}>
            Already have an Account? Click here to LOGIN
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

class Buttons extends Component {
  render() {
    return (
      <View style={styles.buttonGroup}>
        <Button
          style={styles.button}
          title="Submit"
          onPress={this.props.handleSubmit}
          color="#1E90FF"
        />
        <Button
          style={styles.button}
          title="Reset"
          onPress={this.props.handleReset}
          color="#FF6347"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    fontSize: 16,
    padding: 10,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  datePickerContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  buttonContainer: {
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    width: "45%",
  },
  imagePreview: {
    width: 100,
    maxHeight: 100,
    marginTop: 10,
    borderRadius: 10,
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    color: "#1E90FF",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Signup;
