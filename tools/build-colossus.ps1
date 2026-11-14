param([string]$Reference='C:/Users/user/Downloads/Folha de sprites do Colosso da Fábrica.png',[string]$Design='C:/Users/user/Downloads/Ficha de Design do Colosso da Fábrica.png')
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$root=Join-Path $PSScriptRoot '../assets/sprites/colossus'
New-Item -ItemType Directory -Force $root | Out-Null
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;using System.IO;using System.Drawing;using System.Drawing.Imaging;using System.Drawing.Drawing2D;using System.Collections.Generic;
public class ColossusAssets{
 static Bitmap source;
 static Color Corner(int x,int y){int r=0,g=0,b=0;for(int j=0;j<3;j++)for(int i=0;i<3;i++){Color c=source.GetPixel(x+i,y+j);r+=c.R;g+=c.G;b+=c.B;}return Color.FromArgb(r/9,g/9,b/9);}
 static Bitmap Cut(int[] r){int w=r[2],h=r[3];Bitmap cut=new Bitmap(w,h,PixelFormat.Format32bppArgb);Color a=Corner(r[0],r[1]),b=Corner(r[0]+w-3,r[1]),c=Corner(r[0],r[1]+h-3),d=Corner(r[0]+w-3,r[1]+h-3);bool[] candidate=new bool[w*h],remove=new bool[w*h];Queue<int> q=new Queue<int>();
  for(int y=0;y<h;y++)for(int x=0;x<w;x++){double u=x/(double)(w-1),v=y/(double)(h-1);Color p=source.GetPixel(r[0]+x,r[1]+y);double rr=(a.R*(1-u)+b.R*u)*(1-v)+(c.R*(1-u)+d.R*u)*v,gg=(a.G*(1-u)+b.G*u)*(1-v)+(c.G*(1-u)+d.G*u)*v,bb=(a.B*(1-u)+b.B*u)*(1-v)+(c.B*(1-u)+d.B*u)*v;double distance=Math.Max(Math.Abs(p.R-rr),Math.Max(Math.Abs(p.G-gg),Math.Abs(p.B-bb)));candidate[y*w+x]=distance<33;remove[y*w+x]=distance<12;if(x==0||y==0||x==w-1||y==h-1){if(candidate[y*w+x]){remove[y*w+x]=true;q.Enqueue(y*w+x);}}}
  while(q.Count>0){int k=q.Dequeue();foreach(int n in new[]{k-1,k+1,k-w,k+w})if(n>=0&&n<w*h&&!remove[n]&&candidate[n]&&Math.Abs(n%w-k%w)+Math.Abs(n/w-k/w)==1){remove[n]=true;q.Enqueue(n);}}
  for(int y=0;y<h;y++)for(int x=0;x<w;x++)if(!remove[y*w+x])cut.SetPixel(x,y,source.GetPixel(r[0]+x,r[1]+y));return cut;
 }
 static void Paint(Graphics g,Bitmap b,Rectangle rect,float alpha=1){using(ImageAttributes a=new ImageAttributes()){ColorMatrix m=new ColorMatrix();m.Matrix33=alpha;a.SetColorMatrix(m);g.DrawImage(b,rect,0,0,b.Width,b.Height,GraphicsUnit.Pixel,a);}}
 static void CleanBody(Bitmap b){int w=b.Width,h=b.Height;bool[] mask=new bool[w*h],seen=new bool[w*h];for(int y=0;y<h;y++)for(int x=0;x<w;x++)if(b.GetPixel(x,y).A>0)for(int dy=-1;dy<=1;dy++)for(int dx=-1;dx<=1;dx++){int xx=x+dx,yy=y+dy;if(xx>=0&&xx<w&&yy>=0&&yy<h)mask[yy*w+xx]=true;}List<int> best=new List<int>();for(int k=0;k<w*h;k++)if(mask[k]&&!seen[k]){List<int> group=new List<int>();Queue<int> q=new Queue<int>();seen[k]=true;q.Enqueue(k);while(q.Count>0){int p=q.Dequeue();group.Add(p);foreach(int n in new[]{p-1,p+1,p-w,p+w})if(n>=0&&n<w*h&&!seen[n]&&mask[n]&&Math.Abs(n%w-p%w)+Math.Abs(n/w-p/w)==1){seen[n]=true;q.Enqueue(n);}}if(group.Count>best.Count)best=group;}bool[] keep=new bool[w*h];foreach(int k in best)keep[k]=true;for(int y=0;y<h;y++)for(int x=0;x<w;x++)if(!keep[y*w+x])b.SetPixel(x,y,Color.Transparent);}
 public static void Build(string path,string design,string root){
 source=new Bitmap(path);
 int[][] walk={new[]{646,335,99,104},new[]{748,335,87,104},new[]{840,335,81,104},new[]{924,335,94,104}};
 int[][] punch={new[]{26,644,114,99},new[]{144,644,98,99},new[]{246,636,102,107},new[]{405,643,118,100},new[]{526,663,103,80}};
 int[][] steam={new[]{26,770,115,96},new[]{148,770,145,96},new[]{300,770,163,96},new[]{495,770,113,96}};
 int[][] beam={new[]{26,897,124,99},new[]{175,897,115,99},new[]{298,897,146,99}};
 int[][] claw={new[]{640,60,156,186},new[]{1128,60,190,186},new[]{1325,60,190,186},new[]{640,60,156,186}};
 Sheet(root,"idle",new[]{new[]{640,68,156,178},new[]{800,68,153,178},new[]{960,68,164,178},new[]{640,68,156,178}});Sheet(root,"walk",walk);Sheet(root,"punch",punch);Sheet(root,"steam",steam);Sheet(root,"beam",beam);Sheet(root,"claw",claw);
 source.Dispose();source=new Bitmap(design);
 int[][] idle={new[]{640,363,55,95},new[]{696,363,58,95},new[]{755,363,61,95},new[]{817,363,57,95}};
 int[][] rise={new[]{446,491,82,124},new[]{530,491,68,124},new[]{601,491,69,124},new[]{672,491,66,124},new[]{742,491,94,124}};
 Sheet(root,"intro",rise);Sheet(root,"hit",new[]{rise[2],rise[1],rise[2],rise[4]});
 Sheet(root,"blast",new[]{new[]{1234,520,78,94},new[]{1314,520,66,94},new[]{1234,520,78,94}});
 source.Dispose();
 }
 static void Sheet(string root,string name,int[][] poses){using(Bitmap sheet=new Bitmap(poses.Length*256,256,PixelFormat.Format32bppArgb))using(Graphics sg=Graphics.FromImage(sheet)){
 for(int f=0;f<poses.Length;f++)using(Bitmap crop=Cut(poses[f]))using(Bitmap frame=new Bitmap(256,256,PixelFormat.Format32bppArgb))using(Graphics g=Graphics.FromImage(frame)){
 CleanBody(crop);int top=crop.Height,bottom=0,left=crop.Width,right=0;for(int y=0;y<crop.Height;y++)for(int x=0;x<crop.Width;x++)if(crop.GetPixel(x,y).A>0){top=Math.Min(top,y);bottom=Math.Max(bottom,y);left=Math.Min(left,x);right=Math.Max(right,x);}
 // One scale per sequence: fixed foot baseline and torso registration, no frame-wise stretching.
 float scale=name=="idle"||name=="claw"?.98f:name=="intro"||name=="hit"?1.45f:1.7f;
 int width=(int)(crop.Width*scale),height=(int)(crop.Height*scale);
 g.InterpolationMode=InterpolationMode.NearestNeighbor;g.PixelOffsetMode=PixelOffsetMode.Half;
 g.DrawImage(crop,new Rectangle(128-width/2,230-(int)(bottom*scale),width,height));sg.DrawImageUnscaled(frame,f*256,0);
 }sheet.Save(root+"/"+name+".png",ImageFormat.Png);}}
}
'@
[ColossusAssets]::Build($Reference,$Design,[IO.Path]::GetFullPath($root))
