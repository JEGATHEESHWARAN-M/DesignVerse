/**
 * DESIGNVERSE — COMPREHENSIVE SAMPLE TEST SUITE
 * Validates Core 3D Reconstruction Engine, Room3DScene Schema (v1.0),
 * Voice Assistant Intent Parsing, HTML Markup, Android Manifest, and Build Artifacts.
 */

const fs = require('fs');
const path = require('path');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('====================================================');
console.log('🚀 RUNNING DESIGNVERSE AUTOMATED SAMPLE TEST SUITE');
console.log('====================================================\n');

// ── TEST SUITE 1: Room3DScene Schema (v1.0) & CV Validation ──
console.log('📌 [TEST SUITE 1] Room3DScene Schema & CV Verification');
try {
  const schemaFile = path.join(__dirname, '../js/reconstructionEngine.js');
  assert(fs.existsSync(schemaFile), 'reconstructionEngine.js exists');

  const content = fs.readFileSync(schemaFile, 'utf8');
  assert(content.includes("SCHEMA_VERSION = '1.0'"), 'Schema version 1.0 defined');
  assert(content.includes('createDefault'), 'createDefault factory function present');
  assert(content.includes('ComputerVisionAnalyzer'), 'ComputerVisionAnalyzer class present');
  assert(content.includes('ImageVerifier'), 'ImageVerifier scorecard calculator present');
} catch (e) {
  assert(false, `Suite 1 error: ${e.message}`);
}

// ── TEST SUITE 2: Voice Command & Intent Parsing Engine ──
console.log('\n📌 [TEST SUITE 2] Voice Engine & Natural Language Assistant');
try {
  const voiceFile = path.join(__dirname, '../js/voiceCommandEngine.js');
  assert(fs.existsSync(voiceFile), 'voiceCommandEngine.js exists');

  const content = fs.readFileSync(voiceFile, 'utf8');
  assert(content.includes('VoiceCommandEngine'), 'VoiceCommandEngine class exported');
  assert(content.includes('handleColorCommand'), 'Color mutation handler defined');
  assert(content.includes('handleSpatialCommand'), 'Spatial relative positioning handler defined');
  assert(content.includes('handleItemMutationCommand'), 'Item addition/deletion handler defined');
} catch (e) {
  assert(false, `Suite 2 error: ${e.message}`);
}

// ── TEST SUITE 3: UI Layout & Privacy Modal Integrity ──
console.log('\n📌 [TEST SUITE 3] HTML Layout & Privacy Disclosure Modal');
['index.html', 'studio.html'].forEach((filename) => {
  const filePath = path.join(__dirname, '..', filename);
  assert(fs.existsSync(filePath), `${filename} exists`);
  const html = fs.readFileSync(filePath, 'utf8');
  assert(html.includes('id="welcomeScreen"'), `${filename} contains App Welcome Screen & App Name display`);
  assert(html.includes('id="homeDashboard"'), `${filename} contains interactive home dashboard`);
  assert(html.includes('id="mobileBottomNav"'), `${filename} contains mobile bottom navigation bar`);
  assert(html.includes('id="btnMode3D"'), `${filename} contains 3D view button`);
  assert(html.includes('id="btnPhotoTo3D"'), `${filename} contains Photo to 3D button`);
  assert(html.includes('id="btnAiModifyPlan"'), `${filename} contains AI Plan Modify button`);
  assert(html.includes('id="aiRequirementModal"'), `${filename} contains AI Customer Requirement Plan Modifier modal`);
  assert(html.includes('id="privacyModal"'), `${filename} contains Google Play Privacy Policy modal`);
});

// ── TEST SUITE 4: Android Manifest & Hardware Permissions ──
console.log('\n📌 [TEST SUITE 4] Android Manifest & Hardware Permissions');
const manifestPath = path.join(__dirname, '../android/app/src/main/AndroidManifest.xml');
const gradlePath = path.join(__dirname, '../android/app/build.gradle');

assert(fs.existsSync(manifestPath), 'AndroidManifest.xml exists');
const manifestXml = fs.readFileSync(manifestPath, 'utf8');
assert(manifestXml.includes('android.permission.CAMERA'), 'Manifest declares CAMERA permission');
assert(manifestXml.includes('android.permission.RECORD_AUDIO'), 'Manifest declares RECORD_AUDIO permission');
assert(manifestXml.includes('android.permission.INTERNET'), 'Manifest declares INTERNET permission');

assert(fs.existsSync(gradlePath), 'android/app/build.gradle exists');
const gradleTxt = fs.readFileSync(gradlePath, 'utf8');
assert(gradleTxt.includes('applicationId "com.designverse.app"'), 'App ID set to com.designverse.app in build.gradle');

// ── TEST SUITE 5: Production Build Output Verification ──
console.log('\n📌 [TEST SUITE 5] Production Package Verification');
const apkPath = path.join(__dirname, '../DesignVerse-debug.apk');
const aabPath = path.join(__dirname, '../DesignVerse-release.aab');

assert(fs.existsSync(apkPath), 'DesignVerse-debug.apk exists in workspace root');
if (fs.existsSync(apkPath)) {
  const apkStat = fs.statSync(apkPath);
  assert(apkStat.size > 1000000, `Debug APK is valid size (${(apkStat.size / 1024 / 1024).toFixed(2)} MB)`);
}

assert(fs.existsSync(aabPath), 'DesignVerse-release.aab exists in workspace root');
if (fs.existsSync(aabPath)) {
  const aabStat = fs.statSync(aabPath);
  assert(aabStat.size > 1000000, `Release AAB is valid size (${(aabStat.size / 1024 / 1024).toFixed(2)} MB)`);
}

// ── TEST SUITE 6: Learning Engine & Feature Unlock Verification ──
console.log('\n📌 [TEST SUITE 6] Learning Engine Architecture & Content Validation');
const learningJsPath = path.join(__dirname, '../js/learning.js');
const learningCssPath = path.join(__dirname, '../css/learning.css');
const levelsJsonPath = path.join(__dirname, '../learning_content/levels/levels.json');
const skillsDagPath = path.join(__dirname, '../learning_content/skills/skills_dag.json');
const xpEnginePath = path.join(__dirname, '../backend/app/learning/xp_engine.py');
const featureUnlockPath = path.join(__dirname, '../backend/app/learning/feature_unlock.py');

const aiTutorPath = path.join(__dirname, '../backend/app/learning/ai_tutor.py');
const challengesPath = path.join(__dirname, '../learning_content/challenges/challenges.json');

const firebaseServicePath = path.join(__dirname, '../backend/app/services/firebase_service.py');

const kidsJsPath = path.join(__dirname, '../js/kids_learning.js');
const kidsCssPath = path.join(__dirname, '../css/kids_learning.css');

assert(fs.existsSync(learningJsPath), 'learning.js client controller exists');
assert(fs.existsSync(learningCssPath), 'learning.css stylesheet exists');
assert(fs.existsSync(kidsJsPath), 'kids_learning.js educational controller exists');
assert(fs.existsSync(kidsCssPath), 'kids_learning.css stylesheet exists');
assert(fs.existsSync(levelsJsonPath), 'learning_content/levels/levels.json exists');
assert(fs.existsSync(skillsDagPath), 'learning_content/skills/skills_dag.json exists');
assert(fs.existsSync(challengesPath), 'learning_content/challenges/challenges.json exists');
assert(fs.existsSync(xpEnginePath), 'backend/app/learning/xp_engine.py exists');
assert(fs.existsSync(featureUnlockPath), 'backend/app/learning/feature_unlock.py exists');
assert(fs.existsSync(aiTutorPath), 'backend/app/learning/ai_tutor.py exists');
assert(fs.existsSync(firebaseServicePath), 'backend/app/services/firebase_service.py exists');

if (fs.existsSync(levelsJsonPath)) {
  const levelsData = JSON.parse(fs.readFileSync(levelsJsonPath, 'utf8'));
  assert(Array.isArray(levelsData) && levelsData.length === 10, 'All 10 Learning Levels defined in content JSON');
}

if (fs.existsSync(skillsDagPath)) {
  const skillsData = JSON.parse(fs.readFileSync(skillsDagPath, 'utf8'));
  assert(Array.isArray(skillsData) && skillsData.length === 15, 'All 15 Skills defined in Mastery DAG');
}

if (fs.existsSync(challengesPath)) {
  const chData = JSON.parse(fs.readFileSync(challengesPath, 'utf8'));
  assert(Array.isArray(chData) && chData.length >= 3, 'Interior Design Challenges catalog populated');
}

// ── TEST SUITE 7: Enhanced v2 Data Contracts & Server Content Validation ──
console.log('\n📌 [TEST SUITE 7] Enhanced v2 Data Contracts & Content Schemas');
try {
  const lightingJson = path.join(__dirname, '../learning_content/lighting/lighting_presets.json');
  const materialsJson = path.join(__dirname, '../learning_content/materials/materials_catalog.json');
  const stylesJson = path.join(__dirname, '../learning_content/styles/style_recipes.json');
  const badgesJson = path.join(__dirname, '../learning_content/badges/badges.json');
  const contractsPy = path.join(__dirname, '../backend/app/schemas/contracts.py');
  const providersPy = path.join(__dirname, '../backend/app/services/provider_adapters.py');

  assert(fs.existsSync(lightingJson), 'learning_content/lighting/lighting_presets.json exists');
  assert(fs.existsSync(materialsJson), 'learning_content/materials/materials_catalog.json exists');
  assert(fs.existsSync(stylesJson), 'learning_content/styles/style_recipes.json exists');
  assert(fs.existsSync(badgesJson), 'learning_content/badges/badges.json exists');
  assert(fs.existsSync(contractsPy), 'backend/app/schemas/contracts.py exists');
  assert(fs.existsSync(providersPy), 'backend/app/services/provider_adapters.py exists');

  if (fs.existsSync(lightingJson)) {
    const lData = JSON.parse(fs.readFileSync(lightingJson, 'utf8'));
    assert(Array.isArray(lData) && lData.length === 4, 'All 4 Time-of-Day Lighting Presets configured');
  }

  if (fs.existsSync(materialsJson)) {
    const mData = JSON.parse(fs.readFileSync(materialsJson, 'utf8'));
    assert(Array.isArray(mData) && mData.length >= 8, 'Magic Materials Lab catalog populated with facts');
  }

  if (fs.existsSync(stylesJson)) {
    const sData = JSON.parse(fs.readFileSync(stylesJson, 'utf8'));
    assert(Array.isArray(sData) && sData.length === 7, 'All 7 Room Style Recipes configured');
  }

  if (fs.existsSync(badgesJson)) {
    const bData = JSON.parse(fs.readFileSync(badgesJson, 'utf8'));
    assert(Array.isArray(bData) && bData.length === 10, 'All 10 Level Milestone Badges configured');
  }

  if (fs.existsSync(providersPy)) {
    const provContent = fs.readFileSync(providersPy, 'utf8');
    assert(provContent.includes("REAL") && provContent.includes("MOCK") && provContent.includes("FALLBACK") && provContent.includes("UNAVAILABLE"), 'All 4 provider states strictly defined (REAL, MOCK, FALLBACK, UNAVAILABLE)');
  }
} catch (e) {
  assert(false, `Suite 7 error: ${e.message}`);
}

// ── FINAL SUMMARY ──
console.log('\n====================================================');
console.log(`📊 TEST RESULTS: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
console.log('====================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL SAMPLE TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}
