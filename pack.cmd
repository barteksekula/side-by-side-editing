@ECHO OFF
SETLOCAL

REM Set Release or Debug configuration.
IF "%1"=="Release" (set CONFIGURATION=Release) ELSE (set CONFIGURATION=Debug)

powershell .\build\pack.ps1 -configuration %CONFIGURATION%

EXIT /B %errorlevel%
