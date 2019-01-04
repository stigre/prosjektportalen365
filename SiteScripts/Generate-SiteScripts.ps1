Param(
    [Parameter(Mandatory = $false)]
    [string]$RootSiteUrl,
    [Parameter(Mandatory = $false)]
    [string]$ProjectWebUrl,
    [Parameter(Mandatory = $false)]
    [string]$Credentials,
    [Parameter(Mandatory = $false)]
    [switch]$ConfirmContentTypes,
    [Parameter(Mandatory = $false)]
    [switch]$ConfirmLists
)

Try {
    $env_settings = Get-Content .\config\env.json -Raw -ErrorAction Stop | ConvertFrom-Json -ErrorAction Stop
    $RootSiteUrl = $env_settings.RootSiteUrl
    $ProjectWebUrl = $env_settings.ProjectWebUrl
    $Credentials = $env_settings.Credentials
} Catch {

}

Write-Host "[INFO] Connecting to $RootSiteUrl"
$SiteConnection = Connect-PnPOnline -Url $RootSiteUrl -Credentials $Credentials -ReturnConnection

Write-Host "[INFO] Connecting to $ProjectWebUrl"
$ProjectWebConnection = Connect-PnPOnline -Url $ProjectWebUrl -Credentials $Credentials -ReturnConnection

$ContentTypes = Get-PnPContentType -Connection $SiteConnection | Where-Object { $_.Group -eq "Prosjektportalen innholdstyper" } | Sort-Object -Property Id
$Lists = Get-PnPList -Connection $ProjectWebConnection | Where-Object { ($_.BaseTemplate -eq 100 -or $_.BaseTemplate -eq 101 -or $_.BaseTemplate -eq 106 -or $_.BaseTemplate -eq 171) -and $_.RootFolder.ServerRelativeUrl -notlike "*SiteAssets" }

$index = 10
foreach($ct in $ContentTypes) {
    $CreateSiteScript = "y"
    if($ConfirmContentTypes.IsPresent) {
        $CreateSiteScript = Read-Host "Create site script for content type $($ct.Name)? (y/n)"
    }
    if($CreateSiteScript.ToLower() -eq "y") {
        .\Build-SiteScript.ps1 -ContentTypeName $ct.Name -Index $index -SiteConnection $SiteConnection
        $index += 10
    }
}

foreach($lst in $Lists) {
    $CreateSiteScript = "y"
    if($ConfirmLists.IsPresent) {
        $CreateSiteScript = Read-Host "Create site script for list $($lst.Title)? (y/n)"
    }
    if($CreateSiteScript.ToLower() -eq "y") {
        .\Build-SiteScript.ps1 -ListName $lst.Title -Index $index -SiteConnection $SiteConnection -ProjectWebConnection $ProjectWebConnection
        $index += 10
    }
}