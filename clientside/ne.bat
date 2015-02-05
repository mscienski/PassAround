@echo off
FOR /f "tokens=*" %%a in ('npm bin') do (set npmpath=%%a)
setlocal enableDelayedExpansion
set argCount=0
for %%b in (%*) do (
	set /A argCount+=1
	set "argVec[!argCount!]=%%b"
)
for /L %%c in (0,1,%argCount%) do (
	if %%c==1 (
		set command=!argVec[%%c]!
	) else (
		set argums=!argums! !argVec[%%c]!
	)
)
for /f "tokens=* delims= " %%d in ("%argums%") do set argums=%%d
for /f "tokens=* delims= " %%e in ("%command%") do set command=%%e
set runcommand="%npmpath%\%command%" %argums%
echo %runcommand%
call %%runcommand%%
endlocal