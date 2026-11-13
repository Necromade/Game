param([string]$Reference='C:/Users/user/Downloads/Sprite Sheet do Comandante Mecânico.png')
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$root=Join-Path $PSScriptRoot '../assets/sprites/governor'
New-Item -ItemType Directory -Force $root | Out-Null
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System; using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
public class GovernorAssets {
 static Bitmap source;
 static Bitmap Cut(int x,int y,int w,int h) {
  Bitmap b=new Bitmap(w,h,PixelFormat.Format32bppArgb);
  bool[] remove=new bool[w*h];System.Collections.Generic.Queue<int> queue=new System.Collections.Generic.Queue<int>();
  for(int j=0;j<h;j++)for(int i=0;i<w;i++)if(i==0||j==0||i==w-1||j==h-1){queue.Enqueue(j*w+i);remove[j*w+i]=true;}
  while(queue.Count>0){int k=queue.Dequeue(),px=k%w,py=k/w;int[] adjacent={k-1,k+1,k-w,k+w};
   foreach(int v in adjacent){if(v<0||v>=w*h||remove[v]||Math.Abs(v%w-px)+Math.Abs(v/w-py)!=1)continue;Color c=source.GetPixel(x+v%w,y+v/w);
    if(c.R>c.G+3 && c.R<c.G*2.25 && c.G>c.B*.77 && c.G<c.B*1.35){remove[v]=true;queue.Enqueue(v);}
   }
  }
  for(int j=0;j<h;j++)for(int i=0;i<w;i++) {
   Color c=source.GetPixel(x+i,y+j);
   // The reference is opaque. Its brown background has a different chroma
   // from neutral graphite, gold trim and saturated red emissive details.
   bool background=c.R>c.G+3 && c.R<c.G*2.25 && c.G>c.B*.77 && c.G<c.B*1.35;
   if(!remove[j*w+i]) b.SetPixel(i,j,c);
  }
  return b;
 }
 static void Paint(Graphics g,Bitmap b,float x,float y,float w,float h,float alpha=1) {
  using(ImageAttributes a=new ImageAttributes()) {
   ColorMatrix m=new ColorMatrix();m.Matrix33=alpha;a.SetColorMatrix(m);
   g.DrawImage(b,new Rectangle((int)x,(int)y,(int)w,(int)h),0,0,b.Width,b.Height,GraphicsUnit.Pixel,a);
  }
 }
 static void CleanBody(Bitmap b){int w=b.Width,h=b.Height;bool[] mask=new bool[w*h],seen=new bool[w*h];for(int y=0;y<h;y++)for(int x=0;x<w;x++)if(b.GetPixel(x,y).A>0)for(int dy=-1;dy<=1;dy++)for(int dx=-1;dx<=1;dx++){int xx=x+dx,yy=y+dy;if(xx>=0&&xx<w&&yy>=0&&yy<h)mask[yy*w+xx]=true;}List<int> best=new List<int>();for(int k=0;k<w*h;k++)if(mask[k]&&!seen[k]){List<int> group=new List<int>();Queue<int> q=new Queue<int>();seen[k]=true;q.Enqueue(k);while(q.Count>0){int p=q.Dequeue();group.Add(p);foreach(int n in new[]{p-1,p+1,p-w,p+w})if(n>=0&&n<w*h&&!seen[n]&&mask[n]&&Math.Abs(n%w-p%w)+Math.Abs(n/w-p/w)==1){seen[n]=true;q.Enqueue(n);}}if(group.Count>best.Count)best=group;}bool[] keep=new bool[w*h];foreach(int k in best)keep[k]=true;for(int y=0;y<h;y++)for(int x=0;x<w;x++)if(!keep[y*w+x])b.SetPixel(x,y,Color.Transparent);}
 public static void Build(string input,string root) {
 source=new Bitmap(input);
 // Hand-inspected rectangles; rows have different spacing and pose counts.
 int[][] idle={new[]{280,10,115,140},new[]{414,9,110,140},new[]{532,8,106,141},new[]{653,9,100,140},new[]{769,8,105,142},new[]{879,17,99,133},new[]{984,18,100,132},new[]{1094,18,105,133}};
 int[][] run={new[]{301,158,110,124},new[]{425,158,110,124},new[]{542,158,110,124},new[]{655,158,111,124},new[]{767,159,112,125},new[]{879,159,111,126},new[]{992,163,111,123},new[]{1105,165,110,120}};
 int[][] attack={new[]{290,280,111,132},new[]{417,280,109,132},new[]{535,280,125,132},new[]{665,280,103,132},new[]{775,280,105,132},new[]{885,280,105,132},new[]{1000,280,110,132},new[]{1118,280,110,132}};
 int[][] melee={new[]{6,700,123,137},new[]{109,700,145,137},new[]{231,700,132,137},new[]{333,700,103,137}};
 int[][] special={new[]{212,409,115,131},new[]{330,410,147,130},new[]{476,413,130,128},new[]{601,416,80,125},new[]{777,419,92,122},new[]{880,420,88,121}};
 string[] names={"idle","walk","run","turn","jump","fall","land","attack","cannon","shield","summon_drones","ultimate","hit","death"};
 int[] counts={8,8,8,4,6,4,4,8,8,8,8,16,4,12};
 for(int n=0;n<names.Length;n++) {
  string name=names[n];int count=counts[n];
  System.IO.Directory.CreateDirectory(root+"/"+name);
  using(Bitmap sheet=new Bitmap(160*count,160,PixelFormat.Format32bppArgb))using(Graphics sg=Graphics.FromImage(sheet)) {
   for(int f=0;f<count;f++) {
    float p=f/(float)Math.Max(1,count-1),wave=(float)Math.Sin(p*Math.PI*2);
    int[][] poses=name=="run"?run:name=="attack"?melee:name=="cannon"?attack:idle;
    int[] meleeOrder={0,0,1,2,2,1,0,0};int[] r=poses[f%poses.Length];if(name=="attack")r=melee[meleeOrder[f]];
    if(name=="idle")r=idle[0];
    if(name=="shield")r=special[f<2?0:f<6?1:0];
    if(name=="summon_drones"||name=="ultimate")r=special[f<2?0:f<count-2?3:4];
    using(Bitmap pose=Cut(r[0],r[1],r[2],r[3]))using(Bitmap frame=new Bitmap(160,160,PixelFormat.Format32bppArgb))using(Graphics g=Graphics.FromImage(frame)) {
     g.InterpolationMode=InterpolationMode.NearestNeighbor;g.PixelOffsetMode=PixelOffsetMode.Half;
     if(name=="attack")for(int y=0;y<pose.Height;y++)for(int x=0;x<pose.Width;x++){int gx=r[0]+x,gy=r[1]+y,index=meleeOrder[f];bool foreign=index==0?gx>=111&&gy>=750:index==1?(gx<133&&gy<758||gx>=234&&gy>=752):(gx<263&&gy<755||gx>=333&&gy>760);if(foreign)pose.SetPixel(x,y,Color.Transparent);}
     CleanBody(pose); int contact=pose.Height-1;for(int y=pose.Height-1;y>pose.Height/2;y--){int hits=0;for(int x=0;x<pose.Width;x++)if(pose.GetPixel(x,y).A>100)hits++;if(hits>=4){contact=y;break;}} float height=124, width=pose.Width*height/pose.Height,bob=0,scaleX=1,scaleY=1,alpha=1;
     if(name=="idle")scaleY=1+.006f*(float)Math.Sin(f*Math.PI*2/count);
     if(name=="attack"){g.TranslateTransform(80,142);g.RotateTransform(-5+10*(float)Math.Sin(p*Math.PI));g.TranslateTransform(-80,-142);}
     if(name=="turn")scaleX=1-.08f*(float)Math.Sin(p*Math.PI);
     if(name=="jump") {bob=-(float)Math.Sin(p*Math.PI)*8;scaleY=1+.03f*p;}
     if(name=="fall") {bob=-4+p*4;scaleY=1+.02f*wave;}
     if(name=="land") {scaleY=1-.09f*(1-p);scaleX=1+.06f*(1-p);}
     if(name=="hit") {g.TranslateTransform(80,142);g.RotateTransform(-9*(1-p));g.TranslateTransform(-80,-142);bob=wave*2;}
     if(name=="death") {scaleY=1-.77f*p;scaleX=1+.25f*p;alpha=1-p*p;}
     Paint(g,pose,80-width*scaleX/2,142-contact*height/pose.Height*scaleY+bob,width*scaleX,height*scaleY,alpha);
     if(name=="idle")using(SolidBrush core=new SolidBrush(Color.FromArgb((int)(120+80*Math.Sin(f*Math.PI*2/count+.21)),255,20,40)))g.FillRectangle(core,83,65+bob,3,5);
     
     if(name=="ultimate"||name=="shield"||name=="summon_drones") {
      int a=(int)(100+150*Math.Sin(p*Math.PI));using(Pen pen=new Pen(Color.FromArgb(a,255,35,57),1+3*(float)Math.Sin(p*Math.PI))) {
       float radius=4+10*(float)Math.Sin(p*Math.PI);g.DrawEllipse(pen,80-radius,63-radius,radius*2,radius*2);
      }
     }
     if(name=="death")using(SolidBrush brush=new SolidBrush(Color.FromArgb((int)(220*(1-p)),255,50,66)))for(int k=0;k<14;k++)g.FillRectangle(brush,80+(float)Math.Cos(k*2.4)*p*65,85+(float)Math.Sin(k*2.4)*p*55,2,2);
     frame.Save(root+"/"+name+"/"+f.ToString("000")+".png",ImageFormat.Png);sg.DrawImageUnscaled(frame,f*160,0);
    }
   }
   sheet.Save(root+"/"+name+".png",ImageFormat.Png);
  }
 }
 string[] effects={"drone","projectile","cannon_part","shield_fx","beam","explosion","particle","core","charge"};
 int[][] rects={new[]{8,848,105,88},new[]{453,877,66,31},new[]{1153,459,90,62},new[]{407,426,72,114},new[]{1338,681,76,173},new[]{683,702,161,141},new[]{1437,891,62,33},new[]{738,862,56,62},new[]{1383,943,77,72}};
 for(int n=0;n<effects.Length;n++)using(Bitmap b=Cut(rects[n][0],rects[n][1],rects[n][2],rects[n][3]))using(Bitmap sheet=new Bitmap(128*8,192,PixelFormat.Format32bppArgb))using(Graphics g=Graphics.FromImage(sheet)) {
  g.InterpolationMode=InterpolationMode.NearestNeighbor;
  for(int f=0;f<8;f++){float pulse=1+.06f*(float)Math.Sin(f*Math.PI/4),w=Math.Min(115,b.Width)*pulse,h=Math.Min(176,b.Height)*pulse;Paint(g,b,f*128+64-w/2,96-h/2,w,h,n==5?1-f/9f:1);}
  sheet.Save(root+"/"+effects[n]+".png",ImageFormat.Png);
 }
 source.Dispose();
 }
}
'@
[GovernorAssets]::Build($Reference,[IO.Path]::GetFullPath($root))
Write-Output 'Generated 106 individual character frames, 14 sheets and 9 effect sheets.'
