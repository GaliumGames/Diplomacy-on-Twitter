//user settings
int xSize = 1000;
boolean showFleet = true;
int fleetSize = 32;
int armySize = 32;

//code stuff
PImage blankMap;
PImage currentMap;
PImage fleetImg;
PImage armyImg;

PImage mouseImg;

JSONArray colorKey;
JSONArray provences;
JSONArray output;

color select;
color allElse[] = new color[56];
int totalTiles = 74;
boolean redraw = false;
double aspectRatio = 1824/1987;
int ySize = 918; //(int)(xSize * aspectRatio);

//tally
int index = 70;

void setup ()
{
  output = new JSONArray();

  colorKey = loadJSONArray("key.json");
  provences = loadJSONArray("provenceList.json");

  for (int i = 0; i < colorKey.size(); i++)
  {
    JSONObject cKey = colorKey.getJSONObject(i);

    String country = "";
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


  size(1000, 950);
  blankMap  = loadImage("diplomacy.bmp");
  blankMap.resize(xSize, ySize);
  currentMap  = loadImage("diplomacy.bmp");
  currentMap.resize(xSize, ySize);

  fleetImg = loadImage("fleet.png");
  fleetImg.resize(fleetSize, fleetSize);
  armyImg = loadImage("army.png");
  armyImg.resize(armySize, armySize);

  if (showFleet)
  {
    mouseImg = fleetImg;
  } else
  {
    mouseImg = armyImg;
  }

  redraw = true;
}

void mouseClicked()
{
  //String country = "";
  ////json saving
  //if (index > 0)
  //{ 
  //  JSONObject provenceJ = provences.getJSONObject(index - 1);  
  //  country = provenceJ.getString("name"); 

  //  JSONObject jProvence = new JSONObject();

  //  float outputX = ((float)mouseX/(float)xSize) * 1987f;
  //  float outputY = ((float)mouseY/(float)ySize) * 1824f;

  //  println(outputX);
  //  println(outputY);

  //  jProvence.setString("name", country);
  //  jProvence.setInt("x", (int)outputX);
  //  jProvence.setInt("y", (int)outputY);

  //  output.setJSONObject(index - 1, jProvence);

  //  saveJSONArray(output, "export/pos.json");
  //}

  //if (index > totalTiles)
  //{
  //  exit();
  //}

  //index++;

  ////other code
  //JSONObject provenceJ = provences.getJSONObject(index);  
  //country = provenceJ.getString("name"); 
  //println(country);

  //select = color(11, 12, 13);

  //for (int i = 0; i < colorKey.size(); i++)
  //{
  //  JSONObject cKey = colorKey.getJSONObject(i);  
  //  int[] cColor = new int[3];
  //  cColor[0] = cKey.getInt("red");
  //  cColor[1] = cKey.getInt("green");
  //  cColor[2] = cKey.getInt("blue");

  //  if (cKey.getString("name").equals(country))
  //  { 
  //    select = color(cColor[0], cColor[1], cColor[2]);
  //  }

  //  allElse[i] = color(cColor[0], cColor[1], cColor[2]);
  //}

  //redraw = true;
}

void draw ()
{
  if (redraw)
  {
    clear();
    background(0);
    image(blankMap, 0, 0);

    loadPixels();

    for (int i = 0; i < pixels.length; i++)
    {

      if (pixels[i] == select)
      {
        pixels[i] = color(255, 255, 255);
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
    save("latestmap.png");
    currentMap  = loadImage("latestmap.png");
    redraw = false;
  } else
  {
    clear();
    background(0);
    image(currentMap, 0, 0);
    image(mouseImg, mouseX, mouseY);

    if (mousePressed)
    {
      println("X: " + ((float)mouseX/(float)xSize) * 1987f + "\nY: " + ((float)mouseY/(float)ySize) * 1824f);
    }
  }
}