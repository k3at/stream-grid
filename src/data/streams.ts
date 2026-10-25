export type StreamItem = {
  id: string;
  title: string;
  time?: string;
  url: string;
  group?: string;
};

const raw = [
  { time: "07:00", title: "Western Sydney Wanderers x Auckland", url: "https://ww1.sportsonnline.click/channels/hd/hd1.php" },
  { time: "11:00", title: "Académica x Leixões", url: "https://ww1.sportsonnline.click/channels/pt/sporttv1.php" },
  { time: "11:00", title: "Tennis: ATP World Tour 250 - Almaty 2026", url: "https://ww1.sportsonnline.click/channels/pt/sporttv5.php" },
  { time: "11:30", title: "Milan W x Ternana W", url: "https://ww1.sportsonnline.click/channels/hd/hd7.php" },
  { time: "11:30", title: "Eyüpspor x Kasımpaşa", url: "https://ww1.sportsonnline.click/channels/hd/hd9.php" },
  { time: "11:40", title: "GT Cup Open: Barcelona - Race 1", url: "https://ww1.sportsonnline.click/channels/pt/sporttv2.php" },
  { time: "12:00", title: "Heidenheim x Energie Cottbus", url: "https://ww1.sportsonnline.click/channels/hd/hd11.php" },
  { time: "12:00", title: "Magdeburg x Karlsruher SC", url: "https://ww1.sportsonnline.click/channels/hd/hd4.php" },
  { time: "12:00", title: "Hertha BSC x Arminia Bielefeld", url: "https://ww1.sportsonnline.click/channels/pt/eleven2.php" },
  { time: "12:30", title: "Aston Villa x Manchester City", url: "https://ww1.sportsonnline.click/channels/hd/hd1.php" },
  { time: "12:30", title: "Aston Villa x Manchester City", url: "https://ww1.sportsonnline.click/channels/pt/eleven1.php" },
  { time: "12:30", title: "Aston Villa x Manchester City", url: "https://ww1.sportsonnline.click/channels/bra/br2.php" },
  { time: "12:30", title: "Charlton Athletic x Norwich City", url: "https://ww1.sportsonnline.click/channels/pt/sporttv4.php" },
  { time: "12:30", title: "Charlton Athletic x Norwich City", url: "https://ww1.sportsonnline.click/channels/bra/br6.php" },
  { time: "12:45", title: "Tottenham Hotspur W x Arsenal W", url: "https://ww1.sportsonnline.click/channels/hd/hd2.php" },
  { time: "13:00", title: "Rayo Vallecano x Elche", url: "https://ww1.sportsonnline.click/channels/hd/hd6.php" },
  { time: "13:00", title: "Rayo Vallecano x Elche", url: "https://ww1.sportsonnline.click/channels/pt/eleven3.php" },
  { time: "13:00", title: "Euroformula Open: Barcelona - Race 1", url: "https://ww1.sportsonnline.click/channels/pt/sporttv2.php" },
  { time: "13:00", title: "Tennis: ATP World Tour 250 - Lyon 2026", url: "https://ww1.sportsonnline.click/channels/pt/sporttv5.php" },
  { time: "14:00", title: "Cagliari x Bologna", url: "https://ww1.sportsonnline.click/channels/hd/hd8.php" },
  { time: "14:00", title: "Como x Sassuolo", url: "https://ww1.sportsonnline.click/channels/hd/hd7.php" },
  { time: "14:00", title: "Como x Sassuolo", url: "https://ww1.sportsonnline.click/channels/pt/sporttv2.php" },
  { time: "14:00", title: "Gaziantep FK x BB Erzurumspor", url: "https://ww1.sportsonnline.click/channels/hd/hd9.php" },
  { time: "14:30", title: "Köln x Schalke 04", url: "https://ww1.sportsonnline.click/channels/hd/hd3.php" },
  { time: "14:30", title: "Mainz 05 x Werder Bremen", url: "https://ww1.sportsonnline.click/channels/hd/hd11.php" },
  { time: "14:30", title: "RB Leipzig x Elversberg", url: "https://ww1.sportsonnline.click/channels/hd/hd10.php" },
  { time: "14:30", title: "Augsburg x Union Berlin", url: "https://ww1.sportsonnline.click/channels/hd/hd4.php" },
  { time: "15:00", title: "Coventry City x Fulham", url: "https://ww1.sportsonnline.click/channels/hd/hd2.php" },
  { time: "15:00", title: "Coventry City x Fulham", url: "https://ww1.sportsonnline.click/channels/pt/eleven2.php" },
  { time: "15:00", title: "Coventry City x Fulham", url: "https://ww1.sportsonnline.click/channels/bra/br6.php" },
  { time: "15:00", title: "Arsenal x Everton", url: "https://ww1.sportsonnline.click/channels/hd/hd1.php" },
  { time: "15:00", title: "Arsenal x Everton", url: "https://ww1.sportsonnline.click/channels/pt/eleven1.php" },
  { time: "15:00", title: "Arsenal x Everton", url: "https://ww1.sportsonnline.click/channels/bra/br2.php" },
  { time: "15:00", title: "Rangers x St. Johnstone", url: "https://ww1.sportsonnline.click/channels/hd/hd5.php" },
  { time: "15:15", title: "Racing Santander x Espanyol", url: "https://ww1.sportsonnline.click/channels/hd/hd6.php" },
  { time: "15:15", title: "Racing Santander x Espanyol", url: "https://ww1.sportsonnline.click/channels/pt/eleven3.php" },
  { time: "15:30", title: "Estrela x Casa Pia", url: "https://ww1.sportsonnline.click/channels/pt/sporttv1.php" },
  { time: "17:00", title: "Napoli x Roma", url: "https://ww1.sportsonnline.click/channels/hd/hd7.php" },
  { time: "17:00", title: "Napoli x Roma", url: "https://ww1.sportsonnline.click/channels/pt/sporttv3.php" },
  { time: "17:00", title: "Samsunspor x Amed SK", url: "https://ww1.sportsonnline.click/channels/hd/hd9.php" },
  { time: "17:00", title: "UFC 333: Prelims", url: "https://ww1.sportsonnline.click/channels/hd/hd2.php" },
  { time: "17:30", title: "Chelsea x Tottenham Hotspur", url: "https://ww1.sportsonnline.click/channels/hd/hd1.php" },
  { time: "17:30", title: "Chelsea x Tottenham Hotspur", url: "https://ww1.sportsonnline.click/channels/pt/eleven1.php" },
  { time: "17:30", title: "Chelsea x Tottenham Hotspur", url: "https://ww1.sportsonnline.click/channels/bra/br2.php" },
  { time: "17:30", title: "Valencia x Villarreal", url: "https://ww1.sportsonnline.click/channels/hd/hd6.php" },
  { time: "17:30", title: "Valencia x Villarreal", url: "https://ww1.sportsonnline.click/channels/pt/eleven2.php" },
  { time: "17:30", title: "Borussia Dortmund x Eintracht Frankfurt", url: "https://ww1.sportsonnline.click/channels/hd/hd3.php" },
  { time: "17:30", title: "Tennis: ATP World Tour 250 - Brussels", url: "https://ww1.sportsonnline.click/channels/pt/sporttv5.php" },
  { time: "17:45", title: "Willem II x Cambuur", url: "https://ww1.sportsonnline.click/channels/hd/hd11.php" },
  { time: "18:00", title: "Alverca x Arouca", url: "https://ww1.sportsonnline.click/channels/pt/sporttv2.php" },
  { time: "18:00", title: "Zamalek x APR", url: "https://ww1.sportsonnline.click/channels/hd/hd10.php" },
  { time: "18:15", title: "US F1 GP: Practice 3", url: "https://ww1.sportsonnline.click/channels/hd/hd5.php" },
  { time: "18:15", title: "US F1 GP: Practice 3", url: "https://ww1.sportsonnline.click/channels/hd/hd8.php" },
  { time: "18:15", title: "US F1 GP: Practice 3", url: "https://ww1.sportsonnline.click/channels/bra/br3.php" },
  { time: "19:00", title: "UFC 333: Alexander Volkanovski v Movsar Evloev", url: "https://ww1.sportsonnline.click/channels/hd/hd2.php" },
  { time: "19:30", title: "Nürnberg x Kaiserslautern", url: "https://ww1.sportsonnline.click/channels/hd/hd3.php" },
  { time: "19:45", title: "Lazio x Parma", url: "https://ww1.sportsonnline.click/channels/hd/hd7.php" },
  { time: "19:45", title: "Lazio x Parma", url: "https://ww1.sportsonnline.click/channels/pt/sporttv3.php" },
  { time: "19:45", title: "Lens x Paris", url: "https://ww1.sportsonnline.click/channels/hd/hd4.php" },
  { time: "19:45", title: "Lens x Paris", url: "https://ww1.sportsonnline.click/channels/pt/sporttv4.php" },
  { time: "20:00", title: "Atlético Madrid x Deportivo La Coruña", url: "https://ww1.sportsonnline.click/channels/hd/hd6.php" },
  { time: "20:00", title: "Atlético Madrid x Deportivo La Coruña", url: "https://ww1.sportsonnline.click/channels/pt/eleven1.php" },
  { time: "20:00", title: "ADO Den Haag x Heerenveen", url: "https://ww1.sportsonnline.click/channels/hd/hd11.php" },
  { time: "20:00", title: "Rugby: RC Toulon x Saction Paloise", url: "https://ww1.sportsonnline.click/channels/pt/sporttv5.php" },
  { time: "20:30", title: "Gil Vicente x Porto", url: "https://ww1.sportsonnline.click/channels/pt/sporttv1.php" },
  { time: "20:30", title: "Gil Vicente x Porto", url: "https://ww1.sportsonnline.click/channels/bra/br6.php" },
  { time: "20:30", title: "Internacional x Botafogo", url: "https://ww1.sportsonnline.click/channels/bra/br4.php" },
  { time: "20:30", title: "Vitória x Athletico-PR", url: "https://ww1.sportsonnline.click/channels/bra/br1.php" },
  { time: "20:30", title: "Mirassol x São Paulo", url: "https://ww1.sportsonnline.click/channels/bra/br5.php" },
  { time: "20:30", title: "Atlético Goianiense x Novorizontino", url: "https://ww1.sportsonnline.click/channels/bra/br2.php" },
  { time: "20:30", title: "US F1 GP: Qualifying", url: "https://ww1.sportsonnline.click/channels/hd/hd5.php" },
  { time: "20:30", title: "US F1 GP: Qualifying", url: "https://ww1.sportsonnline.click/channels/hd/hd8.php" },
  { time: "20:30", title: "US F1 GP: Qualifying", url: "https://ww1.sportsonnline.click/channels/bra/br3.php" },
  { time: "21:00", title: "Talleres Córdoba x Defensa y Justicia", url: "https://ww1.sportsonnline.click/channels/hd/hd10.php" },
  { time: "22:30", title: "New York RB x Inter Miami", url: "https://ww1.sportsonnline.click/channels/hd/hd11.php" },
  { time: "22:30", title: "Vasco da Gama x Corinthians", url: "https://ww1.sportsonnline.click/channels/bra/br4.php" },
  { time: "22:30", title: "Palmeiras x RB Bragantino", url: "https://ww1.sportsonnline.click/channels/bra/br1.php" },
  { time: "22:30", title: "Ponte Preta x Fortaleza", url: "https://ww1.sportsonnline.click/channels/bra/br2.php" },
  { time: "23:30", title: "Chapecoense x Fluminense", url: "https://ww1.sportsonnline.click/channels/bra/br3.php" },
  { time: "00:00", title: "Moto3: GP of Australia", url: "https://ww1.sportsonnline.click/channels/hd/hd2.php" },
  { time: "00:00", title: "Moto3: GP of Australia", url: "https://ww1.sportsonnline.click/channels/pt/sporttv4.php" },
  { time: "00:00", title: "Moto3: GP of Australia", url: "https://ww1.sportsonnline.click/channels/bra/br6.php" },
  { time: "00:00", title: "O'Higgins x Cobresal", url: "https://ww1.sportsonnline.click/channels/hd/hd9.php" },
  { time: "00:30", title: "NBA: Milwaukee Bucks @ Philadelphia 76ers", url: "https://ww1.sportsonnline.click/channels/hd/hd1.php" },
  { time: "01:00", title: "NBA: San Antonio Spurs @ Dallas Mavericks", url: "https://ww1.sportsonnline.click/channels/pt/sporttv2.php" },
  { time: "01:00", title: "Moto2: GP of Australia", url: "https://ww1.sportsonnline.click/channels/hd/hd2.php" },
  { time: "01:00", title: "Moto2: GP of Australia", url: "https://ww1.sportsonnline.click/channels/pt/sporttv4.php" },
  { time: "01:00", title: "Moto2: GP of Australia", url: "https://ww1.sportsonnline.click/channels/bra/br6.php" },
  { time: "01:00", title: "Santos x Bahia", url: "https://ww1.sportsonnline.click/channels/bra/br5.php" },
  { time: "01:00", title: "Monterrey x Guadalajara", url: "https://ww1.sportsonnline.click/channels/hd/hd8.php" },
  { time: "01:30", title: "Rosario Central x Huracán", url: "https://ww1.sportsonnline.click/channels/hd/hd10.php" },
  { time: "01:30", title: "Rosario Central x Huracán", url: "https://ww1.sportsonnline.click/channels/pt/sporttv1.php" },
  { time: "01:30", title: "Universitario x Juan Pablo II College", url: "https://ww1.sportsonnline.click/channels/hd/hd11.php" },
  { time: "02:00", title: "NBA: Golden State Warriors @ Phoenix Suns", url: "https://ww1.sportsonnline.click/channels/hd/hd1.php" },
  { time: "02:15", title: "MotoGP: GP of Australia", url: "https://ww1.sportsonnline.click/channels/hd/hd2.php" },
  { time: "02:15", title: "MotoGP: GP of Australia", url: "https://ww1.sportsonnline.click/channels/pt/sporttv4.php" },
  { time: "02:15", title: "MotoGP: GP of Australia", url: "https://ww1.sportsonnline.click/channels/bra/br6.php" },
  { time: "02:30", title: "Golf: DP World Tour - Genesis Championship - D4", url: "https://ww1.sportsonnline.click/channels/pt/sporttv2.php" },
  { time: "03:10", title: "Pumas UNAM x Tigres UANL", url: "https://ww1.sportsonnline.click/channels/hd/hd8.php" },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getGroup(url: string) {
  const parts = url.split("/channels/");
  if (parts[1]) {
    const g = parts[1].split("/")[0];
    return g;
  }
  return "other";
}

const map = new Map<string, StreamItem>();
for (const r of raw) {
  if (!map.has(r.url)) {
    map.set(r.url, {
      id: `${slugify(r.title)}-${slugify(r.url.split("/").pop() ?? r.url)}`,
      title: r.title,
      time: r.time,
      url: r.url,
      group: getGroup(r.url),
    });
  }
}

export const streams: StreamItem[] = Array.from(map.values());
export const groups = Array.from(new Set(streams.map((s) => s.group).filter(Boolean))) as string[];
