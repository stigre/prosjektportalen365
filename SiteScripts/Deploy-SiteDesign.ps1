Param(    
    [Parameter(Mandatory = $false)]
    [string]$RootSiteUrl,
    [Parameter(Mandatory = $false)]
    [string]$Credentials,
    [Parameter(Mandatory = $true)]
    $Name,
    [Parameter(Mandatory = $false)]
    $Description = "Prosjektportalen 3.0",
    [Parameter(Mandatory = $false)]
    $Folder = "./src",
    [Parameter(Mandatory = $false)]
    [int]$First = 300
)

Try {
    $env_settings = Get-Content .\config\env.json -Raw -ErrorAction Stop | ConvertFrom-Json -ErrorAction Stop
    $RootSiteUrl = $env_settings.RootSiteUrl
    $Credentials = $env_settings.Credentials
}
Catch {
    exit 0
}


Write-Host "[INFO] Connecting to $RootSiteUrl"
$SiteConnection = Connect-PnPOnline -Url $RootSiteUrl -Credentials $Credentials -ReturnConnection


Get-PnPSiteScript -Connection $SiteConnection | Remove-PnPSiteScript -Connection $SiteConnection -Force

$SiteScripts = Get-ChildItem "$($Folder)/*.txt" | Select-Object -First $First
$SiteScriptIds = @()

foreach ($s in $SiteScripts) {
    $Content = (Get-Content -Path $s.FullName -Raw | Out-String)
    $SiteScriptTitle = $s.BaseName.Substring(8)
    Write-Host "[INFO] Generating site script [$SiteScriptTitle] from file [$($s.Name)]"
    $SiteScript = Add-PnPSiteScript -Title $SiteScriptTitle -Content $Content -Connection $SiteConnection
    $SiteScriptIds += $SiteScript.Id.Guid
}

$SiteDesign = (Get-PnPSiteDesign -Identity $Name)

if ($null -ne $SiteDesign) {
    Write-Host "[INFO] Updating existing site design $Name"
    $Version = $SiteDesign.Version
    $Version++
    $SiteDesign = Set-PnPSiteDesign -Identity $SiteDesign -SiteScriptIds $SiteScriptIds -Description $Description -Version $Version -Connection $SiteConnection
}
else {
    Write-Host "[INFO] Creating new site design $Name"
    $SiteDesign = Add-PnPSiteDesign -Title $Name -SiteScriptIds $SiteScriptIds -Description $Description -WebTemplate TeamSite -Connection $SiteConnection
}