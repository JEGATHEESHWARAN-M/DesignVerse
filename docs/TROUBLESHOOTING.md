# DESIGNVERSE — TROUBLESHOOTING & RECOVERY GUIDE

## 1. Common Scenarios

### Scenario A: Web Speech API Not Supported on Device
- **Symptom**: Toast warning *"Web Speech API not supported on this device. Type command in text box."*
- **Recovery**: Fallback to manual text input field in the Voice Assistant Widget.

### Scenario B: Android Gradle Build Failure
- **Symptom**: `JAVA_HOME is not set` or JDK version mismatch.
- **Recovery**: Explicitly set JDK 17 environment variable prior to running Gradle:
  `cmd.exe /c "set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot&& gradlew.bat assembleDebug"`

### Scenario C: AI Provider Offline
- **Symptom**: `GET /api/v1/diagnostics/providers` returns `UNAVAILABLE`.
- **Recovery**: System automatically activates local Computer Vision fallback analyzer (`ComputerVisionAnalyzer`) and notifies the user without stopping application workflows.
