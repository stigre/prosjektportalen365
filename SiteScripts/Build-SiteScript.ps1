Param(
    [Parameter(Mandatory = $false)]
    [string]$SiteUrl,    
    [Parameter(Mandatory = $false)]
    $SiteConnection,
    [Parameter(Mandatory = $false)]
    $ProjectWebConnection,
    [Parameter(Mandatory = $false)]
    [string]$Credentials,
    [Parameter(Mandatory = $false)]
    [string]$ContentTypeName,   
    [Parameter(Mandatory = $false)]
    [string]$ListName,   
    [Parameter(Mandatory = $true)]
    [int]$Index,   
    [Parameter(Mandatory = $false)]
    [string]$Folder = "./src"
)

$OutFile = $null

$SiteScript = @{
    '$schema' = "schema.json"; 
    "bindata" = @{};
    "actions" = @();
    "version" = 1;
}

if (-not $SiteConnection) {
    Write-Host "[INFO] Connecting to $SiteUrl"
    $SiteConnection = Connect-PnPOnline -Url $SiteUrl -Credentials $Credentials -ReturnConnection
}

if (-not [string]::IsNullOrEmpty($ContentTypeName)) {
    Write-Host "[INFO] ContentTypeName [$ContentTypeName] was specified, creating Site Script with verb [createContentType]"
    $OutFile = "{0} - Innholdstype - {1}.txt" -f $Index.ToString("00000"), $ContentTypeName
    Remove-Item $OutFile -Force -ErrorAction SilentlyContinue
    $ContentType = Get-PnPContentType -Identity $ContentTypeName -Connection $SiteConnection
    $ContentType.Context.Load($ContentType.Fields)
    $ContentType.Context.Load($ContentType.Parent)
    $ContentType.Context.ExecuteQuery()
    $CreateContentTypeAction = @{}
    $CreateContentTypeAction.verb = "createContentType"
    $CreateContentTypeAction.parentId = $ContentType.Parent.Id.StringValue
    $CreateContentTypeAction.name = $ContentType.Name
    $CreateContentTypeAction.description = $ContentType.Description
    $CreateContentTypeAction.hidden = $false
    # $CreateContentTypeAction.subactions = @()
    # foreach ($fld in ($contentType.Fields | Where-Object { $_.InternalName -like "Gt*" })) {
    #     $schemaXml = [xml]$fld.SchemaXml
    #     $node = $schemaXml.SelectSingleNode("//Field")
    #     $node.RemoveAttribute("SourceID")
    #     $node.RemoveAttribute("Version")
    #     $node.RemoveAttribute("AllowDeletion")
    #     $node.RemoveAttribute("Customization")   
    #     $node.RemoveAttribute("WebId")         
    #     $subActionCreateField = @{
    #         verb      = "createSiteColumnXml";
    #         schemaXml = "$($schemaXml.InnerXml.Replace('"', '\"'))";   
    #     }
    #     $subActionAddField = @{
    #         verb         = "addSiteColumn";
    #         internalName = $fld.InternalName;   
    #     }
    #     $SiteScript.actions += $subActionCreateField
    #     $CreateContentTypeAction.subactions += $subActionAddField
    # }
    $SiteScript.actions += $CreateContentTypeAction
}

if (-not [string]::IsNullOrEmpty($ListName)) {
    Write-Host "[INFO] ListName [$ListName] was specified, creating Site Script with verb [createSPList]"
    $OutFile = "{0} - Liste - {1}.txt" -f $Index.ToString("00000"), $ListName
    Remove-Item $OutFile -Force -ErrorAction SilentlyContinue
    $List = Get-PnPList -Identity $ListName -Connection $ProjectWebConnection
    $List.Context.Load($List.ContentTypes)
    $List.Context.ExecuteQuery()
    $CreateSPListAction = @{}
    $CreateSPListAction.verb = "createSPList"
    $CreateSPListAction.listName = $List.Title
    $TemplateType = $List.BaseTemplate
    if ($TemplateType -eq 171) {
        $TemplateType = 107
    }
    $CreateSPListAction.templateType = $TemplateType
    $CreateSPListAction.subactions = @()
    $ContentTypes = $list.ContentTypes | Where-Object { $_.Id.StringValue -notlike "0x0120*" }
    foreach ($ct in $ContentTypes) {
        $subActionAddContentType = @{
            verb = "addContentType";
            name = $ct.Name;   
        }
        $CreateSPListAction.subactions += $subActionAddContentType
    }
    $SiteScript.actions += $CreateSPListAction
    Write-Host "[INFO] Created Site Script with verb [createSPList] with TemplateType $TemplateType"
}


Write-Host "[INFO] Saving site script to file $OutFile"

$SiteScriptJson = $SiteScript | ConvertTo-Json -Depth 100 | ForEach-Object { [System.Text.RegularExpressions.Regex]::Unescape($_) } 
$SiteScriptJson | Out-File -Encoding utf8 ([IO.Path]::Combine($Folder, $OutFile)).ToString()
    