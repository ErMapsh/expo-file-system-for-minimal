# node 18

# Developement Build

```
 eas build --profile development --platform android
```

# Developement apk

```
 eas build --profile apk --platform android
```

# for USB deb

```
 npx expo start --localhost --android
```

# release

```
 npx react-native build-android --mode=release
```

# apk

```
cd android && ./gradlew :app:assembleRelease && cd ..
```
