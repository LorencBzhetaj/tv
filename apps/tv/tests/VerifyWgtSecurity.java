import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.zip.*;

public class VerifyWgtSecurity {
 interface Check {void run()throws Exception;}
 static int count=0;
 static void reject(String label,Check check)throws Exception {
  try{check.run();}catch(Exception expected){count++;System.out.println("PASS reject: "+label);return;}
  throw new Exception("Unsafe input accepted: "+label);
 }
 public static void main(String[] args)throws Exception {
  Path original=Paths.get(args[0]),reference=Paths.get(args[1]);
  try(final ZipFile zip=new ZipFile(original.toFile())){
   if(!VerifyWgt.target("assets%2Ficon.png",VerifyWgt.ASSETS,zip).equals("assets/icon.png"))throw new Exception("SDK URI failed");count++;
   if(!VerifyWgt.target("app.js",VerifyWgt.ASSETS,zip).equals("app.js"))throw new Exception("Plain URI failed");count++;
   final Set<String> seen=new HashSet<String>();VerifyWgt.addTarget(seen,VerifyWgt.target("assets%2Ficon.png",VerifyWgt.ASSETS,zip));
   reject("duplicate canonical reference",()->VerifyWgt.addTarget(seen,VerifyWgt.target("assets/icon.png",VerifyWgt.ASSETS,zip)));
   for(final String uri:Arrays.asList("%2e%2e/app.js","../app.js","assets%252Ficon.png","assets\\icon.png","assets%5Cicon.png","https://example.com/app.js","//example.com/app.js","/app.js","","bad%ZZ","app.js?x","ASSETS/icon.png","assets/\u212A.png","assets//icon.png"))reject(uri,()->VerifyWgt.target(uri,VerifyWgt.ASSETS,zip));
   reject("missing ZIP entry",()->VerifyWgt.target("missing.js",new HashSet<String>(Arrays.asList("missing.js")),zip));
   reject("unexpected ZIP target",()->VerifyWgt.target("author-signature.xml",VerifyWgt.ASSETS,zip));
  }
  for(final String mode:Arrays.asList("tamper","unexpected","missing")){
   Path copy=Files.createTempFile(original.getParent(),"security-",".zip");
   try{
    try(ZipFile zip=new ZipFile(original.toFile());ZipOutputStream out=new ZipOutputStream(Files.newOutputStream(copy))){
     Enumeration<? extends ZipEntry> entries=zip.entries();
     while(entries.hasMoreElements()){
      ZipEntry e=entries.nextElement();if(mode.equals("missing")&&e.getName().equals("app.js"))continue;
      out.putNextEntry(new ZipEntry(e.getName()));
      try(InputStream in=zip.getInputStream(e)){byte[] b=new byte[8192];int n;while((n=in.read(b))!=-1)out.write(b,0,n);}
      if(mode.equals("tamper")&&e.getName().equals("app.js"))out.write(32);out.closeEntry();
     }
     if(mode.equals("unexpected")){out.putNextEntry(new ZipEntry("secret.txt"));out.write(1);out.closeEntry();}
    }
    try(final ZipFile bad=new ZipFile(copy.toFile());final ZipFile trusted=new ZipFile(reference.toFile())){
     if(mode.equals("tamper"))reject("tampered file digest",()->VerifyWgt.verify(bad,trusted,"author-signature.xml"));
     else reject(mode+" ZIP inventory",()->VerifyWgt.archiveInventory(bad));
    }
   }finally{Files.deleteIfExists(copy);}
  }
  System.out.println("PASS: "+count+" URI/archive/tamper security assertions; original WGT read-only.");
 }
}
