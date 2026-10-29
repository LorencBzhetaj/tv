param(
 [Parameter(Mandatory=$true)][string]$StagePath,
 [Parameter(Mandatory=$true)][string]$SourcePath,
 [Parameter(Mandatory=$true)][string]$SdkRoot,
 [string]$WgtPath
)
$ErrorActionPreference='Stop'
$utf8=[Text.UTF8Encoding]::new($false,$true)
$widgetNS='http://www.w3.org/ns/widgets'
$tizenNS='http://tizen.org/ns/widgets'
function Read-Config([string]$text) {
 $settings=[Xml.XmlReaderSettings]::new()
 $settings.DtdProcessing=[Xml.DtdProcessing]::Prohibit
 $settings.XmlResolver=$null
 $reader=[Xml.XmlReader]::Create([IO.StringReader]::new($text),$settings)
 try {$doc=[Xml.XmlDocument]::new();$doc.PreserveWhitespace=$true;$doc.XmlResolver=$null;$doc.Load($reader)}finally{$reader.Dispose()}
 $schemas=[Xml.Schema.XmlSchemaSet]::new()
 # Only the installed, trusted SDK schema tree supplies imports; document entities stay disabled.
 $schemas.XmlResolver=[Xml.XmlUrlResolver]::new()
 [void]$schemas.Add($widgetNS,(Join-Path $SdkRoot 'platforms\tizen-10.0\tv-samsung\schemas\packaging-configuration.xsd'))
 $schemas.Compile();$doc.Schemas=$schemas;$doc.Validate($null)
 $ns=[Xml.XmlNamespaceManager]::new($doc.NameTable);$ns.AddNamespace('w',$widgetNS);$ns.AddNamespace('t',$tizenNS)
 if($doc.SelectNodes('/w:widget/t:privilege|/w:widget/w:access',$ns).Count -ne 0){throw 'M1 must have no privileges or access origins'}
 $app=$doc.SelectNodes('/w:widget/t:application',$ns)
 if($app.Count -ne 1 -or $app[0].GetAttribute('id') -cne 'O12p0Tvvrb.LORITVProduction' -or $app[0].GetAttribute('package') -cne 'O12p0Tvvrb' -or $app[0].GetAttribute('required_version') -cne '10.0'){throw 'Production identity/target mismatch'}
 if($doc.DocumentElement.GetAttribute('id') -cne 'urn:lori-tv:production' -or $doc.DocumentElement.GetAttribute('version') -cne '0.1.0'){throw 'Widget identity/version mismatch'}
 if($doc.SelectSingleNode('/w:widget/w:content',$ns).GetAttribute('src') -cne 'index.html' -or $doc.SelectSingleNode('/w:widget/w:icon',$ns).GetAttribute('src') -cne 'assets/icon.png'){throw 'Invalid runtime paths'}
 if($doc.SelectSingleNode('/w:widget/t:profile',$ns).GetAttribute('name') -cne 'tv-samsung' -or $doc.SelectSingleNode('/w:widget/t:setting',$ns).GetAttribute('background-support') -cne 'disable'){throw 'Invalid platform/lifecycle policy'}
 $csp=$doc.SelectNodes('/w:widget/t:content-security-policy',$ns)
 if($csp.Count -ne 1 -or $csp[0].InnerText -cne "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'none'; media-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"){throw 'CSP mismatch'}
 return ,$doc
}
function Comparable-Config([Xml.XmlDocument]$doc) {
 $clone=$doc.CloneNode($true)
 $ns=[Xml.XmlNamespaceManager]::new($clone.NameTable);$ns.AddNamespace('w',$widgetNS);$ns.AddNamespace('t',$tizenNS)
 $csp=$clone.SelectSingleNode('/w:widget/t:content-security-policy',$ns)
 $policy=$csp.OuterXml
 $indent=$csp.PreviousSibling
 if($indent -and $indent.NodeType -eq [Xml.XmlNodeType]::Whitespace -and $indent.Value -match '^\r?\n   $'){[void]$indent.ParentNode.RemoveChild($indent)}
 [void]$csp.ParentNode.RemoveChild($csp)
 # Only the SDK-proven root CSP relocation and final XML whitespace can vary.
 return @($policy,$clone.OuterXml.TrimEnd([char[]]" `t`r`n"))
}
$sourceText=[IO.File]::ReadAllText((Join-Path $SourcePath 'config.xml'),$utf8)
$source=Read-Config $sourceText
$stagedText=[IO.File]::ReadAllText((Join-Path $StagePath 'config.xml'),$utf8)
if($sourceText -cne $stagedText){throw 'Staged config differs from source'}
Write-Output 'PASS: production identity, no privileges/origins, secure XML and installed SDK schema'
if(-not $WgtPath){exit 0}
Add-Type -AssemblyName System.IO.Compression.FileSystem
$expected=@('app.js','assets/icon.png','boot.css','config.xml','index.html','author-signature.xml','signature1.xml')
$zip=[IO.Compression.ZipFile]::OpenRead($WgtPath)
try {
 $seen=[Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
 $files=@{}
 foreach($entry in $zip.Entries){
  $name=$entry.FullName
  if(-not $seen.Add($name) -or $name -match '(^/|\\|:|%|[\x00-\x1f]|(^|/)\.{1,2}(/|$)|//)'){throw 'Unsafe/duplicate archive entry'}
  if($name.EndsWith('/')){if($name -cne 'assets/' -or $entry.Length -ne 0){throw 'Unexpected directory'};continue}
  if($name -cnotin $expected -or $entry.Length -gt 5MB){throw 'Unexpected/oversized package file'}
  $files[$name]=$entry
 }
 if($files.Count -ne $expected.Count){throw 'Missing package files'}
 foreach($name in $expected){
  if($name -in @('author-signature.xml','signature1.xml')){continue}
  $input=$files[$name].Open();$memory=[IO.MemoryStream]::new()
  try{$input.CopyTo($memory);$bytes=$memory.ToArray()}finally{$input.Dispose();$memory.Dispose()}
  if($name -eq 'config.xml'){
   $packaged=Read-Config ($utf8.GetString($bytes))
   $left=Comparable-Config $source;$right=Comparable-Config $packaged
   if($left[0] -cne $right[0] -or $left[1] -cne $right[1]){throw 'Packaged XML configuration mismatch'}
  }else{
   $original=[IO.File]::ReadAllBytes((Join-Path $StagePath $name))
   if([Convert]::ToBase64String($bytes) -cne [Convert]::ToBase64String($original)){throw "Packaged content mismatch: $name"}
  }
 }
 Write-Output 'PASS: seven-file signed WGT inventory, safe paths, exact assets and narrow config equivalence'
}finally{$zip.Dispose()}
