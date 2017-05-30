PImage img;
JSONArray colorKey;

color test;

void setup ()
{
  colorKey = loadJSONArray("key.json");
  
  for (int i = 0; i < colorKey.size(); i++)
  {
    JSONObject cKey = colorKey.getJSONObject(i);
    
    String country = "swe";
    if(cKey.getString("name").equals(country))
    {
      int[] cColor = new int[3];
      cColor[0] = cKey.getInt("red");
      cColor[1] = cKey.getInt("green");
      cColor[2] = cKey.getInt("blue");
      
      test = color(cColor[0], cColor[1], cColor[2]);
      println(cColor);
    }
    
  }
  
  size(1000, 918);
  img  = loadImage("diplomacylowres.bmp");
}

void draw ()
{
  background(0);
  image(img, 0, 0);
  
  loadPixels();
  
  for(int i = 0; i < pixels.length; i++)
  {
      if(pixels[i] == test)
      {
        pixels[i] = color(200, 0, 200);
      }
  }
  
  updatePixels();
}