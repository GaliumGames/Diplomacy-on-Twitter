PImage img;
JSONArray colorKey;

color select;
color allElse[] = new color[56];
boolean redraw = false;
int xSize = 1100;
double aspectRatio = 1824/1987;
int ySize = (int)(xSize * aspectRatio);

void setup ()
{
  colorKey = loadJSONArray("key.json");

  for (int i = 0; i < colorKey.size(); i++)
  {
    JSONObject cKey = colorKey.getJSONObject(i);

    String country = "london";
    int[] cColor = new int[3];
    cColor[0] = cKey.getInt("red");
    cColor[1] = cKey.getInt("green");
    cColor[2] = cKey.getInt("blue");

    if (cKey.getString("name").equals(country))
    { 
      select = color(cColor[0], cColor[1], cColor[2]);
      println(cColor);
    }

    allElse[i] = color(cColor[0], cColor[1], cColor[2]);
  }


  size(1800, 1000);
  img  = loadImage("diplomacy.bmp");
  img.resize(xSize, ySize);
  redraw = true;
}

void draw ()
{
  if (redraw)
  {
    clear();
    background(0);
    image(img, 0, 0);
    
    loadPixels();

    for (int i = 0; i < pixels.length; i++)
    {

      if (pixels[i] == select)
      {
        pixels[i] = color(200, 200, 0);
      }
      for (int i2 = 0; i2 < allElse.length; i2++)
      {
        if (pixels[i] == allElse[i2])
        {
          pixels[i] = color(200, 200, 200);
        }
      }
    }

    updatePixels();
    redraw = false;
  }
  //save("exportMap2.png");
  //exit();
}