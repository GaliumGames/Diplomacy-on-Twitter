PImage img;
PImage fleetImg;
PImage armyImg;

enum unitType
{
  ARMY, FLEET
};

class unit {
  int x;
  int y;
  unitType type;
}

JSONArray colorKey;
JSONArray posKey;
JSONObject save;

JSONObject austria;
JSONObject britain;
JSONObject france;
JSONObject germany;
JSONObject italy;
JSONObject russia;
JSONObject ottoman;
JSONObject neutral;

color select;
color keyColors[] = new color[56];
color matchColors[] = new color[56];

color AustriaColor;
color BritainColor;
color FranceColor;
color GermanyColor;
color ItalyColor;
color russiaColor;
color ottomanColor;
color neutralColor;

boolean redraw = false;
String country = "london";
unit[] units;
int unitCount = 0;

void setup ()
{
  //init colors

  AustriaColor = color(196, 35, 0);
  BritainColor = color(0, 74, 255);
  FranceColor = color(0, 255, 163);
  GermanyColor = color(64, 64, 64);
  ItalyColor = color(43, 194, 0);
  russiaColor = color(0, 99, 49);
  ottomanColor = color(255, 216, 0);
  neutralColor = color(206, 206, 206);

  //init json
  colorKey = loadJSONArray("json/key.json");
  posKey = loadJSONArray("json/pos.json");

  //init saves
  save = loadJSONObject("input/save.json");
  JSONObject countries = save.getJSONObject("countries");

  //init countrys
  austria = countries.getJSONObject("AUSTRIA-HUNGARY");
  britain = countries.getJSONObject("GREAT BRITAIN");
  france = countries.getJSONObject("FRANCE");
  germany = countries.getJSONObject("GERMANY");
  italy = countries.getJSONObject("ITALY");
  russia = countries.getJSONObject("RUSSIA");
  ottoman = countries.getJSONObject("OTTOMANS");
  neutral = countries.getJSONObject("NEUTRAL");

  //prosses json

  for (int i = 0; i < colorKey.size(); i++)
  {
    JSONObject cKey = colorKey.getJSONObject(i);

    int[] cColor = new int[3];
    cColor[0] = cKey.getInt("red");
    cColor[1] = cKey.getInt("green");
    cColor[2] = cKey.getInt("blue");

    keyColors[i] = color(cColor[0], cColor[1], cColor[2]);
    matchColors[i] = findColor(cKey.getString("name"));
  }

  //init graphics
  size(1987, 1824);

  //init images
  img  = loadImage("sprites/diplomacy.bmp");
  fleetImg = loadImage("sprites/fleet.png");
  armyImg = loadImage("sprites/army.png");

  fleetImg.resize(48, 48);
  armyImg.resize(88, 88);
  redraw = true;
}

//find Pos

int findPos(String name, Boolean x)
{
  int[] _pos = {0, 0};

  for (int i = 0; i < posKey.size(); i++)
  {
    JSONObject posObj = posKey.getJSONObject(i);

    if (posObj.getString("name").equals(name))
    {
      _pos[0] = posObj.getInt("x");
      _pos[1] = posObj.getInt("y");
    }
  }

  if (x)
  {
    return _pos[0];
  } else
  {
    return _pos[1];
  }
}

//findColor

color findColor(String name)
{
  color _color = color(0, 0, 0);

  JSONArray prov;

  for (int i = 0; i < 8; i++)
  {
    switch(i)
    {
    case 0:
      prov = austria.getJSONArray("provinces");
      for (int i2 = 0; i2 < prov.size(); i2++)
      {
        if (prov.getString(i2).equals(name))
        {
          _color = AustriaColor;
        }
      }
      break;
    case 1:
      prov = britain.getJSONArray("provinces");
      for (int i2 = 0; i2 < prov.size(); i2++)
      {
        if (prov.getString(i2).equals(name))
        {

          _color = BritainColor;
        }
      }
      break;
    case 2:
      prov = france.getJSONArray("provinces");
      for (int i2 = 0; i2 < prov.size(); i2++)
      {
        if (prov.getString(i2).equals(name))
        {
          _color = FranceColor;
        }
      }
      break;
    case 3:
      prov = germany.getJSONArray("provinces");
      for (int i2 = 0; i2 < prov.size(); i2++)
      {
        if (prov.getString(i2).equals(name))
        {
          _color = GermanyColor;
        }
      }
      break;
    case 4:
      prov = italy.getJSONArray("provinces");
      for (int i2 = 0; i2 < prov.size(); i2++)
      {
        if (prov.getString(i2).equals(name))
        {
          _color = ItalyColor;
        }
      }
      break;
    case 5:
      prov = russia.getJSONArray("provinces");
      for (int i2 = 0; i2 < prov.size(); i2++)
      {
        if (prov.getString(i2).equals(name))
        {
          _color = russiaColor;
        }
      }
      break;
    case 6:
      prov = ottoman.getJSONArray("provinces");
      for (int i2 = 0; i2 < prov.size(); i2++)
      {
        if (prov.getString(i2).equals(name))
        {
          _color = ottomanColor;
        }
      }
      break;
    case 7:
      prov = neutral.getJSONArray("provinces");
      for (int i2 = 0; i2 < prov.size(); i2++)
      {
        if (prov.getString(i2).equals(name))
        {
          _color = neutralColor;
        }
      }
      break;
    }
  }
  return _color;
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
      for (int i2 = 0; i2 < keyColors.length; i2++)
      {
        if (pixels[i] == keyColors[i2])
        {
          pixels[i] = matchColors[i2];
        }
      }
    }

    updatePixels();
    redraw = false;

    for (int i = 0; i < 7; i++)
    {
      JSONArray armies;
      JSONArray fleets;

      switch(i)
      {
      case 0:
        armies = austria.getJSONArray("armies");

        for (int i2 = 0; i2 < armies.size(); i2++)
        {
          int xPos = findPos(armies.getString(i2), true);
          int yPos = findPos(armies.getString(i2), false);

          //println(xPos + " " + yPos);
          image(armyImg, xPos, yPos);
        }

        fleets = austria.getJSONArray("fleets");
        for (int i2 = 0; i2 < fleets.size(); i2++)
        {
          int xPos = findPos(fleets.getString(i2), true);
          int yPos = findPos(fleets.getString(i2), false);

          //println(xPos + " " + yPos);
          image(fleetImg, xPos, yPos);
        }
        break;

        case 1:
        armies = britain.getJSONArray("armies");

        for (int i2 = 0; i2 < armies.size(); i2++)
        {
          int xPos = findPos(armies.getString(i2), true);
          int yPos = findPos(armies.getString(i2), false);

          //println(xPos + " " + yPos);
          image(armyImg, xPos, yPos);
        }

        fleets = britain.getJSONArray("fleets");
        for (int i2 = 0; i2 < fleets.size(); i2++)
        {
          int xPos = findPos(fleets.getString(i2), true);
          int yPos = findPos(fleets.getString(i2), false);

          //println(xPos + " " + yPos);
          image(fleetImg, xPos, yPos);
        }
        break;

        case 2:
        armies = france.getJSONArray("armies");

        for (int i2 = 0; i2 < armies.size(); i2++)
        {
          int xPos = findPos(armies.getString(i2), true);
          int yPos = findPos(armies.getString(i2), false);

          //println(xPos + " " + yPos);
          image(armyImg, xPos, yPos);
        }

        fleets = france.getJSONArray("fleets");
        for (int i2 = 0; i2 < fleets.size(); i2++)
        {
          int xPos = findPos(fleets.getString(i2), true);
          int yPos = findPos(fleets.getString(i2), false);

          //println(xPos + " " + yPos);
          image(fleetImg, xPos, yPos);
        }
        break;

        case 3:
        armies = germany.getJSONArray("armies");

        for (int i2 = 0; i2 < armies.size(); i2++)
        {
          int xPos = findPos(armies.getString(i2), true);
          int yPos = findPos(armies.getString(i2), false);

          //println(xPos + " " + yPos);
          image(armyImg, xPos, yPos);
        }

        fleets = germany.getJSONArray("fleets");
        for (int i2 = 0; i2 < fleets.size(); i2++)
        {
          int xPos = findPos(fleets.getString(i2), true);
          int yPos = findPos(fleets.getString(i2), false);

          //println(xPos + " " + yPos);
          image(fleetImg, xPos, yPos);
        }
        break;

        case 4:
        armies = italy.getJSONArray("armies");

        for (int i2 = 0; i2 < armies.size(); i2++)
        {
          int xPos = findPos(armies.getString(i2), true);
          int yPos = findPos(armies.getString(i2), false);

          //println(xPos + " " + yPos);
          image(armyImg, xPos, yPos);
        }

        fleets = italy.getJSONArray("fleets");
        for (int i2 = 0; i2 < fleets.size(); i2++)
        {
          int xPos = findPos(fleets.getString(i2), true);
          int yPos = findPos(fleets.getString(i2), false);

          //println(xPos + " " + yPos);
          image(fleetImg, xPos, yPos);
        }
        break;

        case 5:
        armies = russia.getJSONArray("armies");

        for (int i2 = 0; i2 < armies.size(); i2++)
        {
          int xPos = findPos(armies.getString(i2), true);
          int yPos = findPos(armies.getString(i2), false);

          //println(xPos + " " + yPos);
          image(armyImg, xPos, yPos);
        }

        fleets = russia.getJSONArray("fleets");
        for (int i2 = 0; i2 < fleets.size(); i2++)
        {
          int xPos = findPos(fleets.getString(i2), true);
          int yPos = findPos(fleets.getString(i2), false);

          //println(xPos + " " + yPos);
          image(fleetImg, xPos, yPos);
        }
        break;

        case 6:
        armies = ottoman.getJSONArray("armies");

        for (int i2 = 0; i2 < armies.size(); i2++)
        {
          int xPos = findPos(armies.getString(i2), true);
          int yPos = findPos(armies.getString(i2), false);

          //println(xPos + " " + yPos);
          image(armyImg, xPos, yPos);
        }

        fleets = ottoman.getJSONArray("fleets");
        for (int i2 = 0; i2 < fleets.size(); i2++)
        {
          int xPos = findPos(fleets.getString(i2), true);
          int yPos = findPos(fleets.getString(i2), false);

          //println(xPos + " " + yPos);
          image(fleetImg, xPos, yPos);
        }
        break;
      }
    }
  }
  save("export/exportMap2.png");
  exit();
}