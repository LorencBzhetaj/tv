import java.io.*;
import java.nio.file.*;
import java.security.cert.*;
import java.util.*;
import java.util.zip.*;
import javax.xml.XMLConstants;
import javax.xml.crypto.*;
import javax.xml.crypto.dsig.*;
import javax.xml.crypto.dsig.dom.DOMValidateContext;
import javax.xml.parsers.*;
import org.w3c.dom.*;

// Local verification only; no certificate/key writes, network or PKI trust-chain claim.
public class VerifyWgt {
 static String target(String raw,Set<String> required,ZipFile zip)throws Exception {
  if(raw==null||raw.length()==0)throw new Exception("Empty URI");
  java.net.URI uri=new java.net.URI(raw);
  if(uri.isAbsolute()||uri.getRawAuthority()!=null||uri.getRawQuery()!=null||uri.getRawFragment()!=null||raw.startsWith("/"))throw new Exception("External/absolute URI");
  // Deliberately narrow: only ASCII inventory names and the SDK's encoded slash.
  if(!raw.matches("(?:[A-Za-z0-9._/-]|%2[Ff])+"))throw new Exception("Unsupported/ambiguous URI encoding");
  String path=uri.getPath();
  for(String part:path.split("/",-1))if(part.length()==0||part.equals(".")||part.equals(".."))throw new Exception("Traversal/empty path segment");
  if(!required.contains(path))throw new Exception("Unexpected canonical target");
  ZipEntry entry=zip.getEntry(path);if(entry==null||entry.isDirectory())throw new Exception("Missing ZIP target");
  return path;
 }
 static void addTarget(Set<String> seen,String path)throws Exception {
  if(!seen.add(path))throw new Exception("Duplicate canonical target");
 }
 static void archiveInventory(ZipFile zip)throws Exception {
  Set<String> expected=new HashSet<String>(ASSETS);expected.add("author-signature.xml");expected.add("signature1.xml");
  Set<String> seen=new HashSet<String>(),folded=new HashSet<String>();
  Enumeration<? extends ZipEntry> entries=zip.entries();
  while(entries.hasMoreElements()){
   ZipEntry e=entries.nextElement();String n=e.getName();
   // Exact ASCII inventory also excludes Unicode normalization/case aliases.
   if(!folded.add(n.toLowerCase(Locale.ROOT)))throw new Exception("Archive name collision");
   if(e.isDirectory()){if(!n.equals("assets/")||e.getSize()!=0)throw new Exception("Unexpected ZIP directory");continue;}
   if(!expected.contains(n)||!seen.add(n))throw new Exception("Unexpected/duplicate ZIP file");
  }
  if(!seen.equals(expected))throw new Exception("Missing ZIP inventory");
 }
 static final String RSA_SHA256_URI="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
 static final Set<String> SIGNATURE_ALGORITHMS=new HashSet<String>(Arrays.asList(RSA_SHA256_URI,"http://www.w3.org/2001/04/xmldsig-more#rsa-sha512"));
 static final Set<String> DIGEST_ALGORITHMS=new HashSet<String>(Arrays.asList(DigestMethod.SHA256,"http://www.w3.org/2001/04/xmlenc#sha512"));
 static final Set<String> ASSETS=new HashSet<String>(Arrays.asList("app.js","assets/icon.png","boot.css","config.xml","index.html"));
 static Document xml(ZipFile zip,String name)throws Exception {
  DocumentBuilderFactory f=DocumentBuilderFactory.newInstance();f.setNamespaceAware(true);f.setXIncludeAware(false);f.setExpandEntityReferences(false);
  f.setFeature("http://apache.org/xml/features/disallow-doctype-decl",true);
  f.setFeature("http://xml.org/sax/features/external-general-entities",false);f.setFeature("http://xml.org/sax/features/external-parameter-entities",false);
  f.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD,"");f.setAttribute(XMLConstants.ACCESS_EXTERNAL_SCHEMA,"");
  try(InputStream in=zip.getInputStream(zip.getEntry(name))){return f.newDocumentBuilder().parse(in);}
 }
 static X509Certificate leaf(Document d)throws Exception {
  String b=d.getElementsByTagNameNS(XMLSignature.XMLNS,"X509Certificate").item(0).getTextContent().replaceAll("\\s","");
  return (X509Certificate)CertificateFactory.getInstance("X.509").generateCertificate(new ByteArrayInputStream(Base64.getDecoder().decode(b)));
 }
 static void verify(final ZipFile zip,ZipFile reference,String name)throws Exception {
  Document d=xml(zip,name);X509Certificate cert=leaf(d),old=leaf(xml(reference,name));
  if(!Arrays.equals(cert.getEncoded(),old.getEncoded()))throw new Exception(name+": certificate continuity FAIL");cert.checkValidity();
  DOMValidateContext context=new DOMValidateContext(cert.getPublicKey(),d.getDocumentElement());context.setProperty("org.jcp.xml.dsig.secureValidation",Boolean.TRUE);
  Set<String> ids=new HashSet<String>();NodeList nodes=d.getElementsByTagName("*");if(nodes.getLength()>1000)throw new Exception("Oversized signature XML");
  for(int i=0;i<nodes.getLength();i++){Element e=(Element)nodes.item(i);if(e.hasAttribute("Id")){if(!ids.add(e.getAttribute("Id")))throw new Exception("Duplicate XML Id");context.setIdAttributeNS(e,null,"Id");}}
  final XMLSignatureFactory factory=XMLSignatureFactory.getInstance("DOM");final URIDereferencer standard=factory.getURIDereferencer();
  final Set<String> required=new HashSet<String>(ASSETS);if(name.equals("signature1.xml"))required.add("author-signature.xml");
  context.setURIDereferencer(new URIDereferencer(){public Data dereference(URIReference ref,XMLCryptoContext ctx)throws URIReferenceException {
   String uri=ref.getURI();
   if("#prop".equals(uri)&&ids.contains("prop"))return standard.dereference(ref,ctx);
   try{return new OctetStreamData(zip.getInputStream(zip.getEntry(target(uri,required,zip))));}catch(Exception e){throw new URIReferenceException(e);}
  }});
  XMLSignature signature=factory.unmarshalXMLSignature(context);
  String algorithm=signature.getSignedInfo().getSignatureMethod().getAlgorithm();
  if(!SIGNATURE_ALGORITHMS.contains(algorithm))throw new Exception("Unsupported signature algorithm");
  Set<String> referenced=new HashSet<String>();int fragments=0;
  for(Object value:signature.getSignedInfo().getReferences()){
   Reference ref=(Reference)value;String uri=ref.getURI();
   if(!DIGEST_ALGORITHMS.contains(ref.getDigestMethod().getAlgorithm()))throw new Exception("Unsupported digest algorithm");
   for(Object tr:ref.getTransforms()){String alg=((Transform)tr).getAlgorithm();if(!alg.equals(CanonicalizationMethod.INCLUSIVE)&&!alg.equals(CanonicalizationMethod.EXCLUSIVE)&&!("#prop".equals(uri)&&alg.equals("http://www.w3.org/2006/12/xml-c14n11")))throw new Exception("Unsupported transform");}
   if(uri==null||uri.length()==0)throw new Exception("Empty reference");
   if(uri.startsWith("#")){if(!uri.equals("#prop")||!ids.contains("prop")||++fragments!=1)throw new Exception("Unknown/duplicate XML reference");}
   else addTarget(referenced,target(uri,required,zip));
  }
  if(!referenced.equals(required)||fragments!=1)throw new Exception("Signature does not cover complete runtime inventory/properties");
  if(!signature.getSignatureValue().validate(context))throw new Exception(name+": cryptographic signature FAIL");
  for(Object value:signature.getSignedInfo().getReferences())if(!((Reference)value).validate(context))throw new Exception(name+": reference digest FAIL");
  if(!signature.validate(context))throw new Exception(name+": cryptographic signature/digest FAIL");
  System.out.println(name+": PASS "+algorithm+" signature; "+signature.getSignedInfo().getReferences().size()+" reference digests ("+required.size()+" files); certificate continuity and validity dates; provider "+factory.getProvider().getName());
 }
 public static void main(String[] args)throws Exception {
  try(ZipFile zip=new ZipFile(args[0]);ZipFile reference=new ZipFile(args[1])){
   archiveInventory(zip);
   Enumeration<? extends ZipEntry> entries=zip.entries();long total=0;
   while(entries.hasMoreElements()){ZipEntry e=entries.nextElement();CRC32 crc=new CRC32();try(InputStream in=zip.getInputStream(e)){byte[] b=new byte[8192];int n;while((n=in.read(b))!=-1){total+=n;if(total>10*1024*1024)throw new Exception("Archive size limit");crc.update(b,0,n);}}if(crc.getValue()!=e.getCrc())throw new Exception("Archive CRC failure");}
   verify(zip,reference,"author-signature.xml");verify(zip,reference,"signature1.xml");
  }
  System.out.println("PASS: archive CRCs; no general PKI chain/revocation audit claimed.");
 }
}
