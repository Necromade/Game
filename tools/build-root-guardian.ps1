param([Parameter(Mandatory=$true)][string]$Reference)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$bodyRoot=Join-Path $PSScriptRoot '../assets/sprites/enemies/root_guardian'
$effectRoot=Join-Path $PSScriptRoot '../assets/sprites/effects/root_guardian'
New-Item -ItemType Directory -Force $bodyRoot,$effectRoot | Out-Null
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;using System.IO;using System.Drawing;using System.Drawing.Imaging;using System.Drawing.Drawing2D;using System.Collections.Generic;
public class RootGuardianAssets{
 static Bitmap source;
 static Color Corner(int x,int y){int r=0,g=0,b=0;for(int j=0;j<3;j++)for(int i=0;i<3;i++){Color c=source.GetPixel(x+i,y+j);r+=c.R;g+=c.G;b+=c.B;}return Color.FromArgb(r/9,g/9,b/9);}
 static Bitmap Cut(int[] r){int w=r[2],h=r[3];Bitmap cut=new Bitmap(w,h,PixelFormat.Format32bppArgb);Color a=Corner(r[0],r[1]),b=Corner(r[0]+w-3,r[1]),c=Corner(r[0],r[1]+h-3),d=Corner(r[0]+w-3,r[1]+h-3);bool[] candidate=new bool[w*h],remove=new bool[w*h];Queue<int> q=new Queue<int>();
  for(int y=0;y<h;y++)for(int x=0;x<w;x++){double u=x/(double)(w-1),v=y/(double)(h-1);Color p=source.GetPixel(r[0]+x,r[1]+y);double rr=(a.R*(1-u)+b.R*u)*(1-v)+(c.R*(1-u)+d.R*u)*v,gg=(a.G*(1-u)+b.G*u)*(1-v)+(c.G*(1-u)+d.G*u)*v,bb=(a.B*(1-u)+b.B*u)*(1-v)+(c.B*(1-u)+d.B*u)*v;double distance=Math.Max(Math.Abs(p.R-rr),Math.Max(Math.Abs(p.G-gg),Math.Abs(p.B-bb)));candidate[y*w+x]=distance<33;remove[y*w+x]=distance<12;if(x==0||y==0||x==w-1||y==h-1){if(candidate[y*w+x]){remove[y*w+x]=true;q.Enqueue(y*w+x);}}}
  while(q.Count>0){int k=q.Dequeue();foreach(int n in new[]{k-1,k+1,k-w,k+w})if(n>=0&&n<w*h&&!remove[n]&&candidate[n]&&Math.Abs(n%w-k%w)+Math.Abs(n/w-k/w)==1){remove[n]=true;q.Enqueue(n);}}
  for(int y=0;y<h;y++)for(int x=0;x<w;x++)if(!remove[y*w+x])cut.SetPixel(x,y,source.GetPixel(r[0]+x,r[1]+y));return cut;
 }
 static void Paint(Graphics g,Bitmap b,Rectangle rect,float alpha=1){using(ImageAttributes a=new ImageAttributes()){ColorMatrix m=new ColorMatrix();m.Matrix33=alpha;a.SetColorMatrix(m);g.DrawImage(b,rect,0,0,b.Width,b.Height,GraphicsUnit.Pixel,a);}}
 static void CleanBody(Bitmap b){int w=b.Width,h=b.Height;bool[] mask=new bool[w*h],seen=new bool[w*h];for(int y=0;y<h;y++)for(int x=0;x<w;x++)if(b.GetPixel(x,y).A>0)for(int dy=-1;dy<=1;dy++)for(int dx=-1;dx<=1;dx++){int xx=x+dx,yy=y+dy;if(xx>=0&&xx<w&&yy>=0&&yy<h)mask[yy*w+xx]=true;}List<int> best=new List<int>();for(int k=0;k<w*h;k++)if(mask[k]&&!seen[k]){List<int> group=new List<int>();Queue<int> q=new Queue<int>();seen[k]=true;q.Enqueue(k);while(q.Count>0){int p=q.Dequeue();group.Add(p);foreach(int n in new[]{p-1,p+1,p-w,p+w})if(n>=0&&n<w*h&&!seen[n]&&mask[n]&&Math.Abs(n%w-p%w)+Math.Abs(n/w-p/w)==1){seen[n]=true;q.Enqueue(n);}}if(group.Count>best.Count)best=group;}bool[] keep=new bool[w*h];foreach(int k in best)keep[k]=true;for(int y=0;y<h;y++)for(int x=0;x<w;x++)if(!keep[y*w+x])b.SetPixel(x,y,Color.Transparent);}
 public static void Build(string path,string root,string effects){source=new Bitmap(path);
 int[][] idle={new[]{530,36,151,102},new[]{681,36,115,102},new[]{796,36,111,102},new[]{907,36,113,102},new[]{1020,36,106,102},new[]{1126,36,131,102},new[]{1257,36,117,102},new[]{1374,36,128,102}};
 int[][] floating={new[]{528,176,143,99},new[]{671,176,121,99},new[]{792,176,114,99},new[]{906,176,112,99},new[]{1018,176,112,99},new[]{1130,176,120,99},new[]{1250,176,121,99},new[]{1371,176,134,99}};
 int[][] move={new[]{528,309,124,101},new[]{652,309,118,101},new[]{770,309,100,101},new[]{870,309,108,101},new[]{978,309,100,101},new[]{1078,309,102,101},new[]{1180,309,107,101},new[]{1287,309,106,101},new[]{1393,309,119,101}};
 int[][] jump={new[]{5,447,108,99},new[]{113,447,94,99},new[]{207,447,98,99},new[]{305,447,99,99},new[]{404,447,104,99},new[]{508,447,118,99},new[]{626,447,106,99},new[]{732,447,118,99}};
 int[][] spore={new[]{862,449,103,97},new[]{965,449,97,97},new[]{1062,449,89,97},new[]{1151,449,85,97},new[]{1236,449,82,97},new[]{1318,449,75,97}};
 int[][] roots={new[]{5,586,105,104},new[]{110,586,98,104},new[]{208,586,90,104}};
 int[][] summon={new[]{872,582,100,108},new[]{972,582,96,108},new[]{1068,582,88,108},new[]{1156,582,96,108},new[]{1252,582,98,108},new[]{1350,582,88,108}};
 int[][] ultimate={new[]{8,722,100,111},new[]{108,722,72,111},new[]{180,722,71,111},new[]{251,722,71,111},new[]{322,716,78,117},new[]{400,710,91,123},new[]{491,708,96,125},new[]{587,705,110,128},new[]{697,701,101,132},new[]{798,699,124,134},new[]{922,694,97,139}};
 int[][] hit={new[]{8,875,120,110},new[]{128,875,101,110},new[]{229,875,116,110}};
 int[][] death={new[]{355,881,111,108},new[]{466,881,95,108},new[]{561,881,96,108},new[]{657,881,89,108},new[]{746,881,82,108},new[]{828,881,78,108},new[]{906,881,74,108},new[]{980,881,58,108}};
 string[] names={"idle","float","move","jump","land","tongue_attack","spore_attack","root_attack","mushroom_summon","ultimate","hit","death"};int[] counts={8,8,8,8,5,10,8,10,10,16,4,12};int[][][] poses={idle,floating,move,jump,new[]{jump[6],jump[7],idle[1]},new[]{move[0],move[5],move[6],move[7],move[8],move[6],idle[1]},new[]{spore[0],spore[1],spore[2],spore[2],spore[1],spore[0]},roots,summon,ultimate,hit,death};
 for(int n=0;n<names.Length;n++){string name=names[n];int count=counts[n];Directory.CreateDirectory(root+"/"+name);using(Bitmap sheet=new Bitmap(count*192,192,PixelFormat.Format32bppArgb))using(Graphics sg=Graphics.FromImage(sheet)){
  for(int f=0;f<count;f++){float p=f/(float)(count-1);int index=Math.Min(poses[n].Length-1,(int)(p*poses[n].Length));int[] r=poses[n][index];using(Bitmap crop=Cut(r))using(Bitmap frame=new Bitmap(192,192,PixelFormat.Format32bppArgb)){
   CleanBody(crop);int contact=crop.Height-1;for(int y=crop.Height-1;y>crop.Height/2;y--){int visible=0;for(int x=2;x<crop.Width-2;x++)if(crop.GetPixel(x,y).A>100)visible++;if(visible>=4){contact=y;break;}}
   using(Graphics g=Graphics.FromImage(frame)){g.InterpolationMode=InterpolationMode.NearestNeighbor;g.PixelOffsetMode=PixelOffsetMode.Half;float collapse=name=="death"?1-.30f*p:1;Paint(g,crop,new Rectangle(96-crop.Width/2,(int)(164-contact*collapse),crop.Width,(int)(crop.Height*collapse)),name=="death"?1-p*.8f:1);}
   frame.Save(root+"/"+name+"/"+f.ToString("000")+".png",ImageFormat.Png);sg.DrawImageUnscaled(frame,f*192,0);
  }}sheet.Save(root+"/root_guardian_"+name+".png",ImageFormat.Png);
 }}
 string[] parts={"spores","roots","mushrooms","tongue","shockwave","particles","organic_projectiles","eyes","moss","core","vines","minion"};
 int[][] rects={new[]{1060,876,45,47},new[]{1430,867,95,139},new[]{1364,860,73,102},new[]{1172,902,63,79},new[]{1051,987,69,21},new[]{1109,879,43,45},new[]{1108,879,43,45},new[]{315,158,55,33},new[]{118,300,70,72},new[]{153,254,65,66},new[]{1235,874,104,90},new[]{1333,952,83,55}};
 for(int n=0;n<parts.Length;n++)using(Bitmap crop=Cut(rects[n]))using(Bitmap sheet=new Bitmap(128*8,128,PixelFormat.Format32bppArgb))using(Graphics g=Graphics.FromImage(sheet)){
  CleanBody(crop);
  if(n==8)for(int y=0;y<crop.Height;y++)for(int x=0;x<crop.Width;x++){Color p=crop.GetPixel(x,y);if(!(p.G>p.R*.9&&p.G>p.B*1.25&&p.G>45))crop.SetPixel(x,y,Color.Transparent);}
  g.InterpolationMode=InterpolationMode.NearestNeighbor;for(int f=0;f<8;f++){float phase=(float)Math.Sin(f*Math.PI/4+.2),scale=Math.Min(106f/crop.Width,106f/crop.Height)*(1+.04f*phase);g.ResetTransform();g.TranslateTransform(f*128+64,64);if(n==2||n==8||n==10)g.RotateTransform(phase*5);if(n==7)g.ScaleTransform(1,Math.Max(.16f,1-(f==5?.84f:f==4||f==6?.25f:0)));if(n==7||n==9){using(Pen line=new Pen(Color.FromArgb((int)(110+phase*35),169,230,93),n==9?3:5)){g.DrawEllipse(line,-32,-24,64,48);if(n==9){g.DrawLine(line,-38,0,38,0);g.DrawLine(line,0,-32,0,32);}}}else if(n==3){using(Pen outline=new Pen(Color.FromArgb(61,63,35),15))using(Pen inner=new Pen(Color.FromArgb(136+f*3,77,100),10)){g.DrawLine(outline,0,-48,0,48);g.DrawLine(inner,0,-48,0,48);}g.FillRectangle(Brushes.OliveDrab,-4,-36,3,5);g.FillRectangle(Brushes.DarkKhaki,2,15,2,8);}else Paint(g,crop,new Rectangle((int)(-crop.Width*scale/2),(int)(-crop.Height*scale/2),(int)(crop.Width*scale),(int)(crop.Height*scale)));}
  sheet.Save(effects+"/"+parts[n]+".png",ImageFormat.Png);
 }
 using(Bitmap portrait=Cut(new[]{20,110,490,300}))portrait.Save(root+"/portrait.png",ImageFormat.Png);source.Dispose();
 }
}
'@
[RootGuardianAssets]::Build($Reference,[IO.Path]::GetFullPath($bodyRoot),[IO.Path]::GetFullPath($effectRoot))
Write-Output 'Root Guardian: 107 frames, 12 body sheets and 12 secondary/effect sheets.'
