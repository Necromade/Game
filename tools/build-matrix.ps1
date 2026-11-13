param([Parameter(Mandatory=$true)][string]$Reference)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$root=Join-Path $PSScriptRoot '../assets/sprites/matrix'
New-Item -ItemType Directory -Force $root | Out-Null
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;using System.Drawing;using System.Drawing.Imaging;using System.Drawing.Drawing2D;using System.IO;
public class MatrixAssets{
 static Bitmap src;
 static Bitmap Cut(int[] r){Bitmap b=new Bitmap(r[2],r[3],PixelFormat.Format32bppArgb);for(int y=0;y<r[3];y++)for(int x=0;x<r[2];x++){Color c=src.GetPixel(r[0]+x,r[1]+y);int light=Math.Max(c.R,Math.Max(c.G,c.B));if(light>14)b.SetPixel(x,y,Color.FromArgb(Math.Min(255,(light-14)*20),c));}return b;}
 static void Paint(Graphics g,Bitmap b,Rectangle dest,float alpha){using(ImageAttributes a=new ImageAttributes()){ColorMatrix m=new ColorMatrix();m.Matrix33=alpha;a.SetColorMatrix(m);g.DrawImage(b,dest,0,0,b.Width,b.Height,GraphicsUnit.Pixel,a);}}
 public static void Build(string path,string root){src=new Bitmap(path);
 int[][] idle={new[]{523,33,119,114},new[]{651,33,114,114},new[]{778,32,112,115},new[]{897,32,112,116},new[]{1015,33,110,114},new[]{1132,32,112,116},new[]{1250,32,113,116},new[]{1373,32,116,116}};
 int[][] floating={new[]{516,178,124,111},new[]{648,177,116,113},new[]{778,176,112,114},new[]{898,177,115,113},new[]{1019,176,116,114},new[]{1138,176,112,113},new[]{1257,177,116,112},new[]{1381,176,139,113}};
 int[][] move={new[]{451,325,111,111},new[]{566,324,101,111},new[]{669,324,106,113},new[]{778,326,106,111},new[]{885,325,101,112}};
 int[][] tent={new[]{988,326,106,109},new[]{1096,325,113,110},new[]{1210,326,115,109},new[]{1326,325,111,110},new[]{1438,325,97,111}};
 int[][] shot={new[]{15,477,113,101},new[]{129,477,113,101},new[]{243,477,112,101},new[]{356,477,111,101},new[]{469,477,111,101},new[]{582,477,111,101},new[]{695,477,104,101}};
 int[][] summon={new[]{845,468,120,108},new[]{976,465,104,111},new[]{1081,463,99,113},new[]{1182,463,95,113},new[]{1280,466,93,110},new[]{1375,468,89,108}};
 int[][] roots={new[]{12,619,127,137},new[]{141,617,130,139},new[]{273,618,120,137}};
 int[][] ultimate={new[]{628,618,111,140},new[]{740,617,149,142},new[]{890,598,101,162},new[]{992,600,99,162},new[]{1094,601,100,162},new[]{1196,602,107,161},new[]{1305,601,103,163}};
 int[][] hit={new[]{13,817,99,126},new[]{114,818,97,126},new[]{213,818,97,126}};
 int[][] death={new[]{353,815,121,139},new[]{477,812,108,145},new[]{588,812,97,160},new[]{687,816,100,156},new[]{787,844,47,121}};
 string[] names={"idle","float","move","tentacle_attack","organic_shot","summon","root_attack","ultimate","hit","death"};int[] counts={8,8,8,8,8,8,8,16,4,12};int[][][] poses={idle,floating,move,tent,shot,summon,roots,ultimate,hit,death};
 for(int n=0;n<names.Length;n++){string name=names[n];int count=counts[n];Directory.CreateDirectory(root+"/"+name);using(Bitmap sheet=new Bitmap(192*count,192,PixelFormat.Format32bppArgb))using(Graphics sg=Graphics.FromImage(sheet))for(int f=0;f<count;f++){
  float p=f/(float)(count-1);int index=Math.Min(poses[n].Length-1,(int)(p*poses[n].Length));int[] r=poses[n][index];
  using(Bitmap cut=Cut(r))using(Bitmap frame=new Bitmap(192,192,PixelFormat.Format32bppArgb)){
   float coreX=cut.Width*.5f,coreY=cut.Height*.5f;
   if(name!="death"){double best=0;for(int cy=(int)(cut.Height*.22);cy<cut.Height*.7;cy++)for(int cx=(int)(cut.Width*.28);cx<cut.Width*.75;cx++){double score=0;for(int yy=-2;yy<=2;yy++)for(int xx=-2;xx<=2;xx++){Color color=cut.GetPixel(cx+xx,cy+yy);score+=Math.Max(0,color.R-color.G)*color.R;}score*=Math.Exp(-Math.Pow((cx-cut.Width*.5)/(cut.Width*.24),2)-Math.Pow((cy-cut.Height*.43)/(cut.Height*.26),2));if(score>best){best=score;coreX=cx;coreY=cy;}}}
   using(Graphics g=Graphics.FromImage(frame)){g.InterpolationMode=InterpolationMode.NearestNeighbor;g.PixelOffsetMode=PixelOffsetMode.Half;float height=name=="ultimate"?144:134,width=cut.Width*height/cut.Height,breath=1+.012f*(float)Math.Sin(f*2*Math.PI/count+.2);float collapse=name=="death"?1-.36f*p:1;Paint(g,cut,new Rectangle((int)(96-coreX*height/cut.Height*breath),(int)(96-coreY*height/cut.Height*collapse),(int)(width*breath),(int)(height*collapse)),name=="death"?1-p*.8f:1);}
   // Keep the biomechanical torso; appendages are separate articulated assets.
   // Soft alpha edge avoids retaining a second set of baked outer tentacles.
   for(int y=0;y<192;y++)for(int x=0;x<192;x++){double q=Math.Sqrt(Math.Pow((x-96)/49.0,2)+Math.Pow((y-96)/57.0,2));if(q>1){Color c=frame.GetPixel(x,y);int a=(int)(c.A*Math.Max(0,1-(q-1)*8));frame.SetPixel(x,y,Color.FromArgb(a,c));}}
   using(Graphics g=Graphics.FromImage(frame))if(name!="death"){int alpha=60+(int)(80*(.5+.5*Math.Sin(f*2*Math.PI/count+.21)));using(Pen pen=new Pen(Color.FromArgb(alpha,255,32,155),1))g.DrawEllipse(pen,88,88,16,16);}
   frame.Save(root+"/"+name+"/"+f.ToString("000")+".png",ImageFormat.Png);sg.DrawImageUnscaled(frame,f*192,0);
  }
  if(f==count-1)sheet.Save(root+"/"+name+".png",ImageFormat.Png);
 }}
 string[] parts={"tentacle","tip","cable","plate","core","eye","drone","spore","root","pulse","beam","burst"};
 int[][] rects={new[]{1041,921,29,81},new[]{1013,850,32,63},new[]{1090,922,21,81},new[]{120,158,52,53},new[]{239,133,60,67},new[]{57,85,57,57},new[]{1105,809,74,79},new[]{1184,834,67,92},new[]{1405,810,45,128},new[]{1308,859,96,82},new[]{1256,810,47,131},new[]{685,817,94,150}};
 for(int n=0;n<parts.Length;n++)using(Bitmap cut=Cut(rects[n]))using(Bitmap sheet=new Bitmap(128*8,128,PixelFormat.Format32bppArgb))using(Graphics g=Graphics.FromImage(sheet)){
  g.InterpolationMode=InterpolationMode.NearestNeighbor;g.PixelOffsetMode=PixelOffsetMode.Half;
  for(int f=0;f<8;f++){float pulse=1+.045f*(float)Math.Sin(f*Math.PI/4+.2),scale=Math.Min(110f/cut.Width,110f/cut.Height)*pulse;g.ResetTransform();g.TranslateTransform(f*128+64,64);if(n<4)g.RotateTransform((float)Math.Sin(f*Math.PI/4)*4);Paint(g,cut,new Rectangle((int)(-cut.Width*scale/2),(int)(-cut.Height*scale/2),(int)(cut.Width*scale),(int)(cut.Height*scale)),n==11?1-f/10f:1);}
  sheet.Save(root+"/"+parts[n]+".png",ImageFormat.Png);
 }
 using(Bitmap portrait=Cut(new[]{8,34,480,397}))portrait.Save(root+"/portrait.png",ImageFormat.Png);
 src.Dispose();
 }
}
'@
[MatrixAssets]::Build($Reference,[IO.Path]::GetFullPath($root))
Write-Output 'Matrix: 88 individual frames, 10 body sheets, 12 articulated/effect sheets and portrait.'
