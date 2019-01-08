$Components = @()
$Manifests = Get-ChildItem */src/*.manifest.json -Recurse

foreach ($m in $Manifests) {
    Try {
        $ManifestJson = ConvertFrom-Json (Get-Content -Path $m.FullName -Raw -ErrorAction Stop | Out-String) -ErrorAction Stop
        if ($null -ne $ManifestJson) {
            $Components += new-object psobject -property @{
                Id            = $ManifestJson.id;
                Alias         = $ManifestJson.alias;
                ComponentType = $ManifestJson.componentType;
                Properties    = $ManifestJson.preconfiguredEntries.properties;
            }
        }
    }
    Catch {
    
    }
}

$Components | Sort-Object -Property ComponentType | Format-Table