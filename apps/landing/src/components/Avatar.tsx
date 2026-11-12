import { createAvatar } from "@dicebear/core";
import type { StyleOptions } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import type { Options as AvataaarsOptions } from "@dicebear/avataaars";
import { cx } from "../lib/ui";

/* Cartoon people, generated locally from each person's name: the same name always gets the same
   face, and nothing is fetched from a third-party service. Options are narrowed to friendly
   expressions, natural hair colours and brown skin tones. Cached, since names repeat on the page. */

type Options = Partial<StyleOptions<AvataaarsOptions>>;

const base: Options = {
  skinColor: ["614335", "ae5d29", "d08b5b"],
  hairColor: ["2c1b18", "4a312c", "724133"],
  facialHairColor: ["2c1b18", "4a312c"],
  mouth: ["smile", "default", "twinkle"],
  eyes: ["default", "happy", "squint"],
  eyebrows: ["defaultNatural", "raisedExcitedNatural", "flatNatural"],
  top: ["shortFlat", "shortRound", "shortCurly", "theCaesar", "fro", "bun", "curly", "bob", "bigHair", "dreads01"],
  clothing: ["blazerAndShirt", "collarAndSweater", "hoodie", "shirtCrewNeck", "shirtVNeck"],
  clothesColor: ["262e33", "3c4f5c", "65c9ff", "5199e4", "ff5c5c", "a7ffc4"],
  accessoriesProbability: 15,
  accessories: ["prescription01", "prescription02", "round"],
  facialHairProbability: 0,
  backgroundColor: ["e4ecfb", "dcf7e5", "f6e3ea", "ece7f8", "e8e8e5"],
  radius: 50,
};

/* The illustrative characters get a fixed look; anyone else is seeded from their name. */
const looks: Record<string, Options> = {
  "Adaeze Okafor": { top: ["bigHair"] },
  "Tunde Bakare": { top: ["shortFlat"], facialHairProbability: 100, facialHair: ["beardLight"] },
  "Ifeoma Nwosu": { top: ["bun"], accessoriesProbability: 100, accessories: ["round"] },
  "Zainab Yusuf": { top: ["hijab"], hatColor: ["65c9ff"] },
  "Emeka Obi": { top: ["theCaesar"] },
};

const cache = new Map<string, string>();

function avatarUri(name: string) {
  let uri = cache.get(name);
  if (!uri) {
    uri = createAvatar(avataaars, { ...base, ...looks[name], seed: name }).toDataUri();
    cache.set(name, uri);
  }
  return uri;
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  return <img src={avatarUri(name)} alt="" className={cx("shrink-0 rounded-full", className)} />;
}
