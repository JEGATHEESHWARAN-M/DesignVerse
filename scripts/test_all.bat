@echo off
echo ====================================================
echo DESIGNVERSE — FULL AUTOMATED SUITE EXECUTION
echo ====================================================

echo [1/3] Running Automated Web and App Test Suite...
node test/runTests.js
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Web test suite failed.
    exit /b 1
)

echo [2/3] Running Machine Learning Pipeline Verification...
py ml/scripts/prepare_dataset.py
py ml/scripts/run_inference.py
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] ML pipeline script failed.
    exit /b 1
)

echo [3/3] Checking Production Build Package Artifacts...
if exist "DesignVerse-debug.apk" (
    echo   [+] DesignVerse-debug.apk verified.
) else (
    echo   [ERROR] DesignVerse-debug.apk missing.
    exit /b 1
)

if exist "DesignVerse-release.aab" (
    echo   [+] DesignVerse-release.aab verified.
) else (
    echo   [ERROR] DesignVerse-release.aab missing.
    exit /b 1
)

echo ====================================================
echo ALL DESIGNVERSE VERIFICATION TESTS PASSED SUCCESSFULLY!
echo ====================================================
