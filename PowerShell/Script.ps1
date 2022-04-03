###################################
#                                 #
#      $settingsFile format:      #
#                                 #
#  _maxSupply=1 _maxSupply=100    #
#  _mintPrice=1 _mintPrice=50     #
#  CONTRACT_NAME testContract     #
#                                 #
###################################

$InitialLocation = (GEt-Location).Path;      # used to jump in and run 'npm' and 'truffle' -> need to figure out how to run commands from a certain path to avoid jumping

# $PSScriptRoot - should be in the environment, if not, then do
$ScriptLocation = Join-Path (Get-Location).Path 'PowerShell'       # since the usual commands to detect location of the script don't work
                                                                 # THIS IS AN ASSUMPTION ABOUT THE RELATIVE LOCATION OF THE PowerShell DIR COMPARED TO THE CURRECT WORKING DIRECTORY 
                                                                 # ADJUST IF NEEDED

# jump to the script location
cd $ScriptLocation

# ADJUSTABLE VARIABLES
$settingsFile = Join-Path '.' 'Settings.txt'
$solidityFile = 'CoolMan.sol'                         # '.\TEST_Mumbai_exp.sol'
# $templateDir = Join-Path '.' 'TEMPLATE_CM'           # '.\TEMPLATE'
$solcOuput = 'solcOuput'      # solc output temp dir
$collectionName = $args[0]
$templateDir = Join-Path '.' $collectionName  # new Template dir


# CREATE a TEMP DIR and copy the files in there
$tempDir = -join($collectionName, "_TEMP")
mkdir $tempDir
copy (Join-Path '.' $templateDir '*') $tempDir
cd $tempDir


# UPDATING THE SMART CONTRACT
$contractName = '_'

foreach($line in Get-Content $settingsFile) {
    if ($line -eq ''){break;}

    $lineByParts = $line -split '\s'

    $old = $lineByParts[0]
    $new = $line.Substring($old.Length + 1)
    $new = $new.Replace(" ", "_")

    (Get-Content $solidityFile) -replace $old, $new | Out-File -encoding ASCII $solidityFile

    if ($old -eq "CONTRACT_NAME"){
        $contractName = $new
    }

}



# NEW WAY - with solc compiling
##################################################################################################################################
# COMPILE
solc --bin --abi -o $solcOuput $solidityFile

# move contractName.abi + contractName.txt + contract.sol out of temp dir
move $solidityFile (Join-Path '..' $solidityFile)  -force
move (Join-Path $solcOuput ($contractName + '.bin')) (Join-Path ".." "bytecode.txt") -force 
move (Join-Path $solcOuput ($contractName + '.abi')) (Join-Path ".." "abi.txt") -force 

# RETURN TO INITIAL PLACE + CLEAN UP TEMP FILES
cd ../
Get-ChildItem -Path $tempDir -Recurse | Remove-Item -force -recurse
Remove-Item $tempDir -Force 


# Remove old dir + create a new empty dir: COMPILED/$collectionName
$outputDir = Join-Path '..' 'COMPILED' $collectionName
if (Test-Path -Path $outputDir) {
     Get-ChildItem -Path $outputDir -Recurse | Remove-Item -force -recurse
} else {
     mkdir $outputDir
}


move (Join-Path "." "bytecode.txt") (Join-Path '..' 'COMPILED' $collectionName 'bytecode.txt') -force
move (Join-Path "." "abi.txt") (Join-Path '..' 'COMPILED' $collectionName 'abi.txt') -force
move $solidityFile (Join-Path '..' 'COMPILED' $collectionName $solidityFile) -force

# return to initial location
cd $InitialLocation

echo "THE SCRIPT HAS FINISHED!"
echo "========================"

break;

























# OLD WAY - truffle compile
##################################################################################################################################

# PREPARE ENVIRONMENT FOR COMPILING
npm init --yes
sudo truffle init
# npm install @openzeppelin/contracts

# copy the $solidityFile inside the $tempDir\contracts\ + remove the default file
Remove-Item (Join-Path '.' 'contracts' 'Migrations.sol')
move $solidityFile (Join-Path '.' 'contracts' $solidityFile)

# update the migrations file at:  $tempDir\migrations\
$migrationFile = Join-Path '.' 'migrations' '1_initial_migration.js'
$contractName_ = "`"" + $contractName + "`"" 
(Get-Content $migrationFile) -replace "`"Migrations`"", $contractName_ | Out-File -encoding ASCII $migrationFile


# THIS WILL BREAK ON WINDOWS -> use longer approach where you seach for a line with <version: "0.>
# Set the Solc compiler version (0.8.10 works fine, 0.8.12 breaks the contract)
$versionFile = Join-Path '.' 'truffle-config.js'
(Get-Content $versionFile) -replace "0.8.12", "0.8.10" | Out-File -encoding ASCII $versionFile


# COMPILE THE SMART CONTRACT
sudo truffle compile         


# OBTAINING THE ABI + BYTECODE + final .sol file
$migrationFile = Join-Path '.' 'build' 'contracts' ($contractName + '.json')
$json = Get-Content $migrationFile | ConvertFrom-Json
$json.abi | ConvertTo-Json -depth 100 | Out-File (Join-Path ".." "abi.txt")
$json.bytecode | Out-File -Encoding ASCII (Join-Path ".." "bytecode.txt")
move (Join-Path '.' 'contracts' $solidityFile) (Join-Path '..' $solidityFile)  -force


# RETURN TO INITIAL PLACE + CLEAN UP TEMP FILES
cd ../
Get-ChildItem -Path $tempDir -Recurse | Remove-Item -force -recurse
Remove-Item $tempDir -Force 



# remove spaces from the abi file    (move 1 thread up + remove '_')
$ABIfile = Join-Path "." "abi.txt"
$ABItemp_file = Join-Path "." "abi_temp.txt"

Get-Content $ABIfile | 
     ForEach-Object{
          $_.Replace(' ',$null)
     } | 
     Where-Object{
          $_.Length -gt 0
     } | Out-File $ABItemp_file

move $ABItemp_file $ABIfile -Force

$foo = Get-Content $ABIfile
$foo2 = [string]::join("",($foo.Split("`n")))
echo $foo2 | Out-File $ABItemp_file 
move $ABItemp_file $ABIfile -Force


# remove extra line (new line char) at the end of the bytecode file
$pathToBytecode = Join-Path -Path (Get-Location) -ChildPath "bytecode.txt"
$stream = [IO.File]::OpenWrite($pathToBytecode)
$stream.SetLength($stream.Length - 2)
$stream.Close()
$stream.Dispose()


# copy ABI + BYTECODE files to the COMPILED dir on server
move $pathToBytecode (Join-Path '..' 'COMPILED' $collectionName 'bytecode.txt') -force
move $ABIfile (Join-Path '..' 'COMPILED' $collectionName 'abi.txt') -force
move $solidityFile (Join-Path '..' 'COMPILED' $collectionName $solidityFile) -force

# return to initial location
cd $InitialLocation

echo "THE SCRIPT HAS FINISHED!"
echo "========================"
