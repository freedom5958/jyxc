#!/bin/bash
cp jyxcDept.keystore platforms/android/build/outputs/apk/
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore jyxcDept.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk jyxcDept
mv platforms/android/build/outputs/apk/android-release-unsigned.apk platforms/android/build/outputs/apk/测评.apk
