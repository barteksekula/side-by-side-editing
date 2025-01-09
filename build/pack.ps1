Param([string] $configuration = "Release")
$workingDirectory = Get-Location
$zip = "$workingDirectory\packages\7-Zip.CommandLine\18.1.0\tools\7za.exe"

# Set location to the Solution directory
(Get-Item $PSScriptRoot).Parent.FullName | Push-Location

# Version
[xml] $versionFile = Get-Content ".\build\version.props"
$versionNode = $versionFile.SelectSingleNode("Project/PropertyGroup/VersionPrefix")
$version = $versionNode.InnerText

[xml] $dependenciesFile = Get-Content ".\build\dependencies.props"
# CMS dependency
$cmsUINode = $dependenciesFile.SelectSingleNode("Project/PropertyGroup/CmsUIVersion")
$cmsUIVersion = $cmsUINode.InnerText
$cmsUIParts = $cmsUIVersion.Split(".")
$cmsUIMajor = [int]::Parse($cmsUIParts[0]) + 1
$cmsUINextMajorVersion = ($cmsUIMajor.ToString() + ".0.0")

npm install

#copy assets approval reviews
$outputDirectory = "out\side-by-side-editing\$version\ClientResources"
Copy-Item -Path src\SideBySideEditing\ClientResources\ -Destination out\side-by-side-editing\$version\ClientResources -recurse -Force
Copy-Item src\SideBySideEditing\module.config out\side-by-side-editing
node node_modules\uglify-js\bin\uglifyjs $outputDirectory\AutoRefresher.js --output $outputDirectory\AutoRefresher.js --compress --mangle
node node_modules\uglify-js\bin\uglifyjs $outputDirectory\initializer.js --output $outputDirectory\initializer.js --compress --mangle
node node_modules\uglify-js\bin\uglifyjs $outputDirectory\SideBySideController.js --output $outputDirectory\SideBySideController.js --compress --mangle
node node_modules\uglify-js\bin\uglifyjs $outputDirectory\SideBySideEditingView.js --output $outputDirectory\SideBySideEditingView.js --compress --mangle

((Get-Content -Path out\side-by-side-editing\module.config -Raw).TrimEnd() -Replace '=""', "=`"$version`"" ) | Set-Content -Path out\side-by-side-editing\module.config
Set-Location $workingDirectory\out\side-by-side-editing
Start-Process -NoNewWindow -Wait -FilePath $zip -ArgumentList "a", "side-by-side-editing.zip", "$version", "module.config"
Set-Location $workingDirectory

# Packaging public packages
dotnet pack -c $configuration /p:PackageVersion=$version /p:CmsUIVersion=$cmsUIVersion /p:CmsUINextMajorVersion=$cmsUINextMajorVersion side-by-side-editing.sln

Pop-Location
