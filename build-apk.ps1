# English Journey - Automated Standalone APK Builder

$ErrorActionPreference = "Stop"

$SdkPath = "C:\Users\mou1\AppData\Local\Android\Sdk"
$BuildTools34 = "$SdkPath\build-tools\34.0.0"
$BuildTools36 = "$SdkPath\build-tools\36.0.0"
$AndroidJar = "$SdkPath\platforms\android-34\android.jar"
$JbrBin = "C:\Program Files\Android\Android Studio\jbr\bin"

$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$JbrBin;$BuildTools36;$BuildTools34;$env:PATH"

$Aapt2 = "$BuildTools34\aapt2.exe"
$D8 = "$BuildTools36\d8.bat"
$Zipalign = "$BuildTools34\zipalign.exe"
$Apksigner = "$BuildTools34\apksigner.bat"
$Javac = "$JbrBin\javac.exe"
$Jar = "$JbrBin\jar.exe"
$Keytool = "$JbrBin\keytool.exe"

$BaseDir = "C:\Users\mou1\.gemini\antigravity\scratch\english-journey\android-apk"
$BuildDir = "$BaseDir\build"
$OutApk = "C:\Users\mou1\.gemini\antigravity\scratch\english-journey\EnglishJourney.apk"

Write-Host "=========================================="
Write-Host "🚀 Building English Journey APK..."
Write-Host "=========================================="

# 1. Clean previous build files
Write-Host "[1/7] Cleaning build directory..."
if (Test-Path "$BuildDir\compiled_res.zip") { Remove-Item "$BuildDir\compiled_res.zip" -Force }
if (Test-Path "$BuildDir\unaligned.apk") { Remove-Item "$BuildDir\unaligned.apk" -Force }
if (Test-Path "$BuildDir\aligned.apk") { Remove-Item "$BuildDir\aligned.apk" -Force }
if (Test-Path "$BuildDir\classes.dex") { Remove-Item "$BuildDir\classes.dex" -Force }
if (Test-Path $OutApk) { Remove-Item $OutApk -Force }

New-Item -ItemType Directory -Force -Path "$BuildDir\gen", "$BuildDir\obj" | Out-Null

# 2. Compile resources
Write-Host "[2/7] Compiling Android resources with aapt2..."
& $Aapt2 compile --dir "$BaseDir\res" -o "$BuildDir\compiled_res.zip"

# 3. Link resources and generate unaligned APK
Write-Host "[3/7] Linking resources..."
& $Aapt2 link -I $AndroidJar "$BuildDir\compiled_res.zip" --manifest "$BaseDir\AndroidManifest.xml" -o "$BuildDir\unaligned.apk" --java "$BuildDir\gen"

# 4. Compile Java sources
Write-Host "[4/7] Compiling Java source files..."
$JavaSources = Get-ChildItem -Path "$BuildDir\gen", "$BaseDir\src" -Filter "*.java" -Recurse | Select-Object -ExpandProperty FullName
& $Javac -source 8 -target 8 -bootclasspath $AndroidJar -d "$BuildDir\obj" $JavaSources

# 5. Convert bytecode to Dalvik Executable (classes.dex)
Write-Host "[5/7] Converting bytecode to Dalvik Executable (classes.dex)..."
$ClassFiles = Get-ChildItem -Path "$BuildDir\obj" -Filter "*.class" -Recurse | Select-Object -ExpandProperty FullName
& $D8 --lib $AndroidJar --min-api 24 --output "$BuildDir" $ClassFiles

# 5b. Pack classes.dex and assets into unaligned.apk
Write-Host "[5b/7] Packing classes.dex and web assets into APK with standard paths..."
Push-Location $BaseDir
& $Jar uf "$BuildDir\unaligned.apk" -C "$BuildDir" "classes.dex"
& $Jar uf "$BuildDir\unaligned.apk" "assets"
Pop-Location

# 6. Align APK
Write-Host "[6/7] Optimizing alignment with zipalign..."
& $Zipalign -v -p 4 "$BuildDir\unaligned.apk" "$BuildDir\aligned.apk"

# 7. Sign APK
Write-Host "[7/7] Signing APK with apksigner..."
$Keystore = "$BuildDir\release.keystore"
if (-not (Test-Path $Keystore)) {
    & $Keytool -genkeypair -v -keystore $Keystore -alias englishjourney -keyalg RSA -keysize 2048 -validity 10000 -storepass "englishjourney123" -keypass "englishjourney123" -dname "CN=English Journey, OU=Mobile, O=EnglishJourney, L=Riyadh, C=SA"
}

& $Apksigner sign --ks $Keystore --ks-pass pass:englishjourney123 --key-pass pass:englishjourney123 --out $OutApk "$BuildDir\aligned.apk"

Write-Host "Verifying signature..."
& $Apksigner verify --verbose $OutApk

$ApkSize = (Get-Item $OutApk).Length / 1MB
Write-Host "=========================================="
Write-Host "✅ SUCCESS! EnglishJourney.apk successfully created!"
Write-Host "Path: $OutApk"
Write-Host "Size: $([math]::Round($ApkSize, 2)) MB"
Write-Host "=========================================="
