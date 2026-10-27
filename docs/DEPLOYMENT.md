# DESIGNVERSE — DEPLOYMENT & PRODUCTION BUILDING GUIDE

## 1. Environment Requirements
- **Node.js**: v18+
- **JDK**: Microsoft OpenJDK 17 (`C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot`)
- **Android SDK**: Target API 36, minSdk 24
- **Capacitor**: CLI v8.5.2

## 2. Build Pipeline Commands

### Step 1: Re-bundle Web Application
```powershell
npx.cmd esbuild d:\DesignVerse\js\studio.js --bundle --outfile=d:\DesignVerse\js\studio.bundle.js --minify
```

### Step 2: Sync Web Assets to Android Workspace
```powershell
Copy-Item -Force d:\DesignVerse\index.html d:\DesignVerse\www\
Copy-Item -Force d:\DesignVerse\studio.html d:\DesignVerse\www\
Copy-Item -Recurse -Force d:\DesignVerse\css d:\DesignVerse\www\
Copy-Item -Recurse -Force d:\DesignVerse\js d:\DesignVerse\www\
npx.cmd cap copy android
```

### Step 3: Compile Android Debug APK
```powershell
cmd.exe /c "set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot&& gradlew.bat assembleDebug"
Copy-Item -Force d:\DesignVerse\android\app\build\outputs\apk\debug\app-debug.apk d:\DesignVerse\DesignVerse-debug.apk
```

### Step 4: Compile Google Play Store Release Bundle (.aab)
```powershell
cmd.exe /c "set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot&& gradlew.bat bundleRelease"
Copy-Item -Force d:\DesignVerse\android\app\build\outputs\bundle\release\app-release.aab d:\DesignVerse\DesignVerse-release.aab
```
